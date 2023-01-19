import {Component} from '@angular/core'
import {AuthService} from '../../../shared/services/auth.service'
import {PermissionsService} from '../../../shared/services/permissions.service'
import {environment} from '../../../../environments/environment'

@Component({
  selector: 'app-courtesy-menu',
  templateUrl: './courtesy-menu.component.html',
  styleUrls: ['./courtesy-menu.component.css']
})
export class CourtesyMenuComponent {
  listCourtesy = environment.listCourtesy
  listCourtesyStationary = environment.listCourtesyStationary

  constructor(
    private authService: AuthService,
    private permissionService: PermissionsService
  ) {
  }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }
}
