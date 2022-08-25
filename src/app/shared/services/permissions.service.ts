import {Injectable, OnInit} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {ResponseModel} from '../model/Request.model'
import {environment} from '../../../environments/environment'
import {AuthService} from './auth.service'
import {map} from 'rxjs/operators'
import {OptionMenuModel} from '../model/OptionMenu.model'
import {MessageService} from './message.service'

@Injectable({
  providedIn: 'root'
})
export class PermissionsService implements OnInit {
  actions: string[] = []
  modules: string[] = []
  private apiUrl = environment.serverAPI

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private messageService: MessageService
  ) {
    this.getMenuOptionsValidated(this.auth.getUser().user.id).then()
  }

  get actionsOfPermissions() {
    return this.actions
  }

  getPermissions(userId: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/admin/role/permissions/${userId}`
      )
      .pipe(
        map((data) => {
          return data.data
        })
      )
  }

  ifHaveAction(action: string) {
    return !!this.actions.find((x) => x == action)
  }

  ifHaveModule(module: string) {
    return !!this.modules.find((x: string) => x == module)
  }

  getMenuOptionsValidated(userId: string) {
    const options: OptionMenuModel[] = environment.leftMenu
    const menu: OptionMenuModel[] = Array<OptionMenuModel>()
    return this.getPermissions(userId)
      .toPromise()
      .then((permissions: any) => {
        this.actions = permissions.permissions.map((a: any) => a.action)
        this.modules = permissions.permissions.map((a: any) => a.module)
        options.forEach((option: OptionMenuModel) => {
          if (
            permissions.permissions.find(
              (permission: any) => permission.module == option.module
            )
          ) {
            menu.push(option)
          }
        })
        return menu
      })
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {

    })
  }
}
