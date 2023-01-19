import {Component} from '@angular/core'
import {AuthService} from '../../shared/services/auth.service'
import {PermissionsService} from '../../shared/services/permissions.service'
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-managment',
  templateUrl: './management-menu.component.html',
  styleUrls: ['./management-menu.component.css']
})
export class ManagementMenuComponent {
  assignRole = environment.assignRole
  createUser = environment.createUser
  listLocal = environment.listLocal
  listTariff = environment.listTariff
  listSchedules = environment.listSchedules
  tariffTest = environment.tariffTest
  listUserApp = environment.listUserApp
  updateFiles = environment.updateFiles
  changePermissions = environment.changePermissions

  constructor(
    private authService: AuthService,
    private permissionService: PermissionsService
  ) {
  }

  get parkingId() {
    return this.authService.getParking().id
  }

  getIsSudo() {
    return this.authService.isSudo
  }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }
}
