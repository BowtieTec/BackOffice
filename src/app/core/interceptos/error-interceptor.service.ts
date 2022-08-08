import { ErrorHandler, Injectable, NgZone } from '@angular/core'
import { MessageService } from '../../shared/services/message.service'
import { Router } from '@angular/router'
import { AuthService } from '../../shared/services/auth.service'
import { throwError } from 'rxjs'
import { environment } from '../../../environments/environment'
import { HttpErrorResponse } from '@angular/common/http'

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private message: MessageService,
    private router: Router,
    private auth: AuthService,
    private zone: NgZone
  ) {}

  handleError(error: Response | HttpErrorResponse | any) {
    const errorString = error.toString()
    if (errorString.includes('Recipient address rejected: Domain not found')) {
      this.message.error('Parece que el correo no existe. Por favor verifique')
      return
    }
    if (error.error?.message) {
      const err = error.error.message.toString()
      if (err.includes('Duplicate entry')) {
        const message = err.slice(
          err.indexOf("Duplicate entry '") + 17,
          err.indexOf("' for key ")
        )
        this.message.error(` "${message}" ya existe`)
        return
      } else if (err.includes('Error: Error:')) {
        const message = err.slice(
          err.indexOf('Error: Error:') + 14,
          err.lastIndexOf('Error: Error:')
        )
        this.message.error(message)
        return
      } else if (err.includes('"success":false,"message":"')) {
        const message = err.slice(
          err.indexOf('"success":false,"message":"') + 27,
          err.lastIndexOf('"}}:') - 2
        )
        this.message.error(message)
        return
      }
    } else if (error.status > 0) {
      switch (error.status) {
        case 401:
          this.message.error(
            'Token vencido. Por favor iniciar sesión nuevamente'
          )
          this.goToLogin()
          return
        case 500:
          this.message.error('Error')
          return
      }
    } else if (error instanceof Response) {
      let errMsg: string
      const body: any = error.json() || ''
      const err = body.error || JSON.stringify(body)
      errMsg = `${error.status} - ${error.statusText || ''} ${err.message}`
      return throwError(errMsg)
    } else if (errorString.includes('Duplicate entry')) {
      const message = errorString.slice(
        errorString.indexOf("D'Duplicate entry \''+ 17,
        errorString.indexOf("''\' for key '      )
      this.message.error(` "${message}" ya existe`)
      return
    } else if (errorString.includes('Error: Error:')) {
      const message = errorString.slice(
        errorString.indexOf('Error: Error:') + 14,
        errorString.lastIndexOf('Error: Error:')
      )
      this.message.error(message)
      return
    } else if (errorString.includes('"success":false,"message":"')) {
      const message = errorString.slice(
        errorString.indexOf('"success":false,"message":"') + 27,
        errorString.lastIndexOf('"}}:') - 2
      )
      this.message.error(message)
      return
    } else if (errorString.includes('ObjectUnsubscribedError:')) {
      return
    } else if (errorString.includes('"statusText":"Unauthorized"')) {
      this.message.error('Token vencido. Por favor iniciar sesión nuevamente')
      this.goToLogin()
      return
    }
    this.message.error('Error no manejado. Por favor contacte al administrador')
    if (!environment.production) console.error('Error: ', error)
    throw Error(error)
  }

  goToLogin() {
    this.zone.run((x) => {
      this.auth.cleanUser()
      this.router.navigate(['/'])
    })
  }

  protected extractData(res: Response) {
    const body: any = res.json()
    return body.data || {}
  }
}
