import {Component, OnInit} from '@angular/core'
import {UserService} from '../users/services/user.service'
import {UtilitiesService} from '../../../../shared/services/utilities.service'
import {MessageService} from '../../../../shared/services/message.service'
import {PermissionSaveModel, PermissionsModel} from './models/Permissions.model'
import {RolesService} from './services/roles.service'

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  allPermissions: PermissionsModel[] = []
  roleIdSelected = ''

  constructor(
    private userService: UserService,
    private utilitiesService: UtilitiesService,
    private roleService: RolesService,
    private messageServices: MessageService
  ) {
  }

  get Roles() {
    return this.userService.roles
  }

  get getModules() {
    return [...new Set(Array.from(this.allPermissions, (x) => x.module))]
  }

  ngOnInit(): void {
    this.getAllPermissions()
  }

  getAllPermissions() {
    this.messageServices.showLoading()
    this.roleService
      .getAllPermissions()
      .toPromise()
      .then((data) => {
        this.allPermissions = data.data.permissions
        this.messageServices.hideLoading()
      })
  }

  getPermissionsForModules(module: string): Array<PermissionsModel> {
    return this.allPermissions.filter((x) => x.module == module)
  }

  changeRole() {
    this.messageServices.showLoading()
    console.log(this.roleIdSelected)
    if(this.roleIdSelected != ''){
      this.getPermissionsForRole(this.roleIdSelected).then(
        (data: PermissionsModel[]) => {
          this.cleanAllPermission()
          data.forEach((item: any) => {
            const found = this.allPermissions.find((x) => x.id == item.id)
            if (found) {
              found.checked = true
            }
          })
          this.messageServices.hideLoading()
        }
      )
    }
  }

  cleanAllPermission() {
    this.allPermissions.forEach((x) => (x.checked = false))
  }

  getPermissionsForRole(id: string) {
    return this.roleService
      .getPermissionsForRole()
      .toPromise()
      .then((data) => {
        if (data.success) {
          return data.data.roles.find((x: any) => x.id == id).permissions
        } else {
          this.messageServices.error(
            '',
            'No se pudo cargar la información solicitada. Error: ' +
            data.message
          )
        }
      })
  }

  savePermissions() {
    if (this.roleIdSelected.length > 0) {
      const permissionsToSave: PermissionSaveModel = new PermissionSaveModel()
      permissionsToSave.roleId = this.roleIdSelected
      permissionsToSave.permissions = this.allPermissions.filter(
        (x) => x.checked
      )
      const idsArray: Array<any> = []
      Array.from(permissionsToSave.permissions, (x) => x.id).forEach((data) => {
        idsArray.push({
          id: data
        })
      })
      permissionsToSave.permissions = idsArray
      this.roleService
        .savePermissionsForRole(permissionsToSave)
        .subscribe((data) => {
          if (data.success) {
            this.messageServices.OkTimeOut()
          } else {
            this.messageServices.error(
              '',
              'Los permisos no pudieron guardarse. ' + data.message
            )
          }
        })
    } else {
      this.messageServices.warning('Debe seleccionar un rol para continuar')
    }
  }
}
