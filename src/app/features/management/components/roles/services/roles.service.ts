import {Injectable} from '@angular/core'
import {MessageService} from '../../../../../shared/services/message.service'
import {HttpClient} from '@angular/common/http'
import {environment} from '../../../../../../environments/environment'
import {ResponseModel} from '../../../../../shared/model/Request.model'
import {PermissionSaveModel} from '../models/Permissions.model'

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = environment.serverAPI

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {
  }

  getAllPermissions() {
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/role/permission/list`
    )
  }

  getPermissionsForRole() {
    return this.http.get<ResponseModel>(`${this.apiUrl}backoffice/role/`)
  }

  savePermissionsForRole(permissions: PermissionSaveModel) {
    return this.http.post<ResponseModel>(
      `${this.apiUrl}backoffice/role/update`,
      permissions
    )
  }
}
