import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {environment} from '../../../../environments/environment'
import {ResponseModel} from '../../../shared/model/Request.model'
import {ChangePasswordModel, ConfirmCodeModel} from '../models/RecoveryPassword.model'

@Injectable({
  providedIn: 'root'
})
export class RecoveryPasswordService {
  private apiUrl = environment.serverAPI

  constructor(private http: HttpClient) {
  }

  sendConfirmCode(email: string) {
    return this.http.post<ResponseModel>(
      `${this.apiUrl}backoffice/recovery-password/email`,
      {
        email
      }
    )
  }

  confirmCode(confirmModel: ConfirmCodeModel) {
    return this.http.post<ResponseModel>(
      `${this.apiUrl}backoffice/recovery-password/confirmCode`,
      confirmModel
    )
  }

  recoveryPassword(recoveryModel: ChangePasswordModel, token: string) {
    return this.http.post<ResponseModel>(
      `${this.apiUrl}backoffice/recovery-password/changePassword`,
      recoveryModel, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  }

  requestNewPassword(newPassword: string, userId: string) {
    if (!userId) throw new Error('No se seleccionó un usuario')
    const recoveryModel: ChangePasswordModel = {
      newPassword,
      newPasswordConfirmation: newPassword,
      userId
    }
    return this.http.post<ResponseModel>(
      `${this.apiUrl}backoffice/admin/reset-password`,
      recoveryModel
    ).toPromise().then(({data}) => data)
      .catch((err) => {
        throw new Error(`No se pudo cambiar la contraseña: ${err.message}`)
      })
  }
}
