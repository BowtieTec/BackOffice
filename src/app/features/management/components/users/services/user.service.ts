import {Injectable} from '@angular/core'
import {MessageService} from '../../../../../shared/services/message.service'
import {environment} from '../../../../../../environments/environment'
import {HttpClient} from '@angular/common/http'
import {ResponseModel} from '../../../../../shared/model/Request.model'
import {RolesModel} from '../models/RolesModel'
import {getAdminsPaginatedModel, NewUserModel, updateUserApp} from '../models/newUserModel'
import {Observable} from 'rxjs'
import {AuthService} from '../../../../../shared/services/auth.service'
import {saveAs} from "file-saver";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  roles: RolesModel[] = new Array<RolesModel>()
  newUser: NewUserModel = new NewUserModel()
  users: NewUserModel[] = new Array<NewUserModel>()
  private apiUrl = environment.serverAPI

  constructor(
    private message: MessageService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.getInitialData()
  }

  getInitialData() {
    this.message.showLoading()
    this.getRoles()
      .toPromise()
      .then((data: ResponseModel) => {
        this.roles = data.data.roles
        return data
      })
      .then((data) => {
        this.message.hideLoading()
      })
      .then(() => {
        this.message.hideLoading()
      })
  }

  getRoles() {
    this.message.showLoading()
    return this.http.get<ResponseModel>(`${this.apiUrl}backoffice/role`)
  }

  getUsers(data: getAdminsPaginatedModel): Observable<any> {
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/admin/admins?textToSearch=${data.textToSearch}&page=${data.page}&pageSize=${data.pageSize}`
    )
  }
  exportAdminTable(): Promise<any> {
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/admin/export`, {responseType: 'blob' as 'json'}
    ).toPromise().then((data: any) => {
      const downloadURL = window.URL.createObjectURL(data);
      saveAs(downloadURL, `Administradores ${new Date().toLocaleDateString()}.xlsx`);
    })
  }

  getUsersApp(): Observable<any> {
    this.message.showLoading()
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/user/userApp/`
    )
  }

  getAdminsByParking() {
    this.message.showLoading()
    this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/admin/admins?page=1&per_page=100&status=3`
      )
      .subscribe((data) => {
        this.users = []
        data.data.administradores.data.forEach((administrator: any) => {
          this.users.push({
            role: administrator.role == null ? '' : administrator.role.id,
            name: administrator.name,
            id: administrator.id,
            user: administrator.user,
            parking: administrator.idParking,
            email: administrator.email,
            password: administrator.password,
            last_name: administrator.last_name,
            validate_code: administrator.validate_code
          })
        })
        this.message.hideLoading()
      })
  }

  saveNewUser(newUser: NewUserModel) {
    if (this.authService.isSudo) {
      return this.http.post<ResponseModel>(
        `${this.apiUrl}backoffice/admin/signup-superadmin`,
        newUser
      )
    } else {
      return this.http.post<ResponseModel>(
        `${this.apiUrl}backoffice/admin/signup`,
        newUser
      )
    }
  }

  editUser(newUser: NewUserModel) {
    return this.http.put<ResponseModel>(
      `${this.apiUrl}backoffice/admin/update/${newUser.id}`,
      newUser
    )
  }

  editUserApp(userApp: updateUserApp) {
    return this.http.put<ResponseModel>(`${this.apiUrl}backoffice/user/update/${userApp.id}`, userApp)
  }

  deleteUser(id: string) {
    return this.http.delete<ResponseModel>(
      `${this.apiUrl}backoffice/admin/${id}`
    )
  }

  saveRole(role: string, id: string) {
    const assignRole = {
      adminId: id,
      roleId: role
    }
    return this.http.put<ResponseModel>(
      `${this.apiUrl}backoffice/admin/role`,
      assignRole
    )
  }
}
