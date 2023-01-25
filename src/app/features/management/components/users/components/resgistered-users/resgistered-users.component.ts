import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {getAdminsPaginatedModel, NewUserModel} from '../../models/newUserModel'
import {UserService} from '../../services/user.service'
import {Subject} from 'rxjs'
import {FormGroup, UntypedFormBuilder} from '@angular/forms'
import {DataTableOptions} from '../../../../../../shared/model/DataTableOptions'
import {DataTableDirective} from 'angular-datatables'
import {MessageService} from '../../../../../../shared/services/message.service'
import {PermissionsService} from '../../../../../../shared/services/permissions.service'
import {environment} from '../../../../../../../environments/environment'
import {RecoveryPasswordService} from "../../../../../auth/services/recovery-password.service";
import {getCurrentDataTablePage, UtilitiesService} from "../../../../../../shared/services/utilities.service";
import {AuthService} from "../../../../../../shared/services/auth.service";
import {ADTSettings} from "angular-datatables/src/models/settings";

@Component({
  selector: 'app-resgistered-users',
  templateUrl: './resgistered-users.component.html',
  styleUrls: ['./resgistered-users.component.css']
})
export class ResgisteredUsersComponent
  implements OnInit, AfterViewInit, OnDestroy {
  deleteUser = environment.deleteUser
  editUser = environment.editUser
  restartPassword = environment.restartPassword
  @Input() subject: Subject<NewUserModel> = new Subject<NewUserModel>()
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective
  dtTrigger: Subject<any> = new Subject()
  formGroup: FormGroup
  users: NewUserModel[] = []
  parkingId: string = ''

  constructor(
    private userService: UserService,
    private formBuilder: UntypedFormBuilder,
    private message: MessageService,
    private permissionsService: PermissionsService,
    private recoveryService: RecoveryPasswordService,
    private utilitiesService: UtilitiesService,
    private authService: AuthService,
  ) {
    this.formGroup = formBuilder.group({filter: ['']})
  }

  get DtOptions(): ADTSettings {
    return {
      ...DataTableOptions.getSpanishOptions(10),
      serverSide: true,
      processing: true,
      responsive: true,
      ajax: async (dataTablesParameters: any, callback: any) => {
        const page = getCurrentDataTablePage(dataTablesParameters)
        const data = await this.getUsers({
          textToSearch: dataTablesParameters.search.value,
          page,
          pageSize: dataTablesParameters.length
        })
        this.users = data.admins
        callback({
          recordsTotal: data.recordsTotal,
          recordsFiltered: data.recordsFiltered,
          data: []
        })
        this.message.hideLoading()
      }
    }
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(({parkingId}) => {
      this.parkingId = parkingId
      this.getUsers({textToSearch: '', page: 1, pageSize: 10}).then((data) => {
        this.users = data.admins
        console.log(this.users);
      })
    })
    this.subject.subscribe((user: NewUserModel) => {
      if (!user) {
        this.rerender()
      }
    })
  }

  ifHaveAction(action: string) {
    return this.permissionsService.ifHaveAction(action)
  }

  deleteTheUser(user: NewUserModel) {
    this.message.showLoading()
    this.userService
      .deleteUser(user.id == undefined ? '' : user.id)
      .subscribe((data) => {
        if (data.success) {
          this.message.OkTimeOut('Eliminado')
          this.rerender()
        } else {
          this.message.errorTimeOut('', data.message)
        }
      })
  }

  async editTheUser(user: NewUserModel) {
    this.utilitiesService.goToElementById("locationPanel")
    this.subject.next(user)
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next()
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }

  async restartPasswordUser(user: NewUserModel) {
    const newPassword: string = this.utilitiesService.randomString();
    try {
      const data = await this.recoveryService.requestNewPassword(newPassword, user.id ?? '')
      this.message.OkTimeOut('Contraseña cambiada. El usuario recibirá un correo con la nueva contraseña.')
    } catch (e: any) {
      throw new Error(e)
    }
  }

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy()
      this.dtTrigger.next()
    })
  }

  private getUsers(data: getAdminsPaginatedModel) {
    return this.userService
      .getUsers(data)
      .toPromise()
      .then((data) => data.data)
  }

  async exportTable() {
    this.message.infoTimeOut('Descargando...', '', 0)
    await this.userService.exportAdminTable()
    this.message.OkTimeOut()
  }

  getOtherParkings(otherParkings: any[]) {
    return otherParkings.map((parking) => parking.name).join(`,
    `)
  }
}
