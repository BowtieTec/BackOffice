import {Injectable} from '@angular/core'
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router'
import {Observable} from 'rxjs'
import {AuthService} from '../../shared/services/auth.service'
import {PermissionsService} from '../../shared/services/permissions.service'
import {MessageService} from '../../shared/services/message.service'
import {EncryptionService} from '../../shared/services/encryption.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private permissions: PermissionsService,
    private message: MessageService,
    private crypto: EncryptionService,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (sessionStorage.getItem(this.crypto.encryptKey('User')) == undefined) {
      this.message.infoTimeOut(
        'Debe iniciar sesión para acceder a las funcionalidades.',
        'Iniciar sesión'
      )
      this.router.navigate(['/'])
      return false
    }
    return true
  }
}
