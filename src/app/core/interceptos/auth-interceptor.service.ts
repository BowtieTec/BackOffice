import {Injectable} from '@angular/core'
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import {Observable, throwError} from 'rxjs'
import {AuthService} from '../../shared/services/auth.service'
import {catchError} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = this.authService.getUser().token
    let request: HttpRequest<any>
    if (!req.url.includes('recovery-password/changePassword')) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Referrer-Policy': 'no-referrer-when-downgrade',
          'X-Permitted-Cross-Domain-Policies': 'none',
          'strict-transport-security': 'max-age=31536000; includeSubDomains',
          'Content-Security-Policy': 'default-src \'self\'',
          'Permissions-Policy': '\'none\'',
          'X-content-type-options': 'nosniff',
          'Cross-Origin-Opener-Policy': 'same-origin',
          'X-Frame-Options': 'SAMEORIGIN'
        }
      })
    } else {
      request = req.clone({
        setHeaders: {
          'Referrer-Policy': 'no-referrer-when-downgrade',
          'X-Permitted-Cross-Domain-Policies': 'none',
          'strict-transport-security': 'max-age=31536000; includeSubDomains',
          'Content-Security-Policy': 'default-src \'self\'',
          'Permissions-Policy': '\'none\'',
          'X-content-type-options': 'nosniff',
          'Cross-Origin-Opener-Policy': 'same-origin',
          'X-Frame-Options': 'SAMEORIGIN'
        }
      })
    }
    return next
      .handle(request)
      .pipe(catchError((err: HttpErrorResponse) => throwError(err)))
  }
}
