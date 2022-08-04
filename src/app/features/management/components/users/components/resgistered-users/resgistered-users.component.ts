import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {NewUserModel} from '../../models/newUserModel'
import {UserService} from '../../services/user.service'
import {Subject} from 'rxjs'
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms'
import {DataTableOptions} from '../../../../../../shared/model/DataTableOptions'
import {DataTableDirective} from 'angular-datatables'
import {MessageService} from '../../../../../../shared/services/message.service'
import {PermissionsService} from '../../../../../../shared/services/permissions.service'
import {environment} from '../../../../../../../environments/environment'
import {RecoveryPasswordService} from "../../../../../auth/services/recovery-password.service";
import {UtilitiesService} from "../../../../../../shared/services/utilities.service";
import {AuthService} from "../../../../../../shared/services/auth.service";

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
  formGroup: UntypedFormGroup
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

  get dtOptions() {
    return DataTableOptions.getSpanishOptions(10)
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(({parkingId}) => {
      this.parkingId = parkingId
      this.getUsers(parkingId)
    })
    this.subject.subscribe((user: NewUserModel) => {
      this.getUsers()
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
          this.message.Ok('Eliminado')
          this.getUsers()
        } else {
          this.message.errorTimeOut('', data.message)
        }
      })
  }

  async editTheUser(user: NewUserModel) {
    const loading = new Promise((resolve, reject) => {
      this.message.showLoading()
      resolve('ok')
    }).then(() => {
      this.subject.next(user)

    })
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next()
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }

  private getUsers(parkingId: string = this.parkingId) {
    this.userService
      .getUsers(parkingId)
      .toPromise()
      .then((data) => {
        const results = data.data.administradores.data
        results.forEach((result: any) => {
          result.role = result.role == null ? '' : result.role.id
        })
        return results
      })
      .then((results) => {
        this.users = results
        this.rerender()
        this.message.hideLoading()
      })
  }

  private rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy()
      this.dtTrigger.next()
    })
  }

  restartPasswordUser(user: NewUserModel) {
    const newPassword: string = this.utilitiesService.randomString() + '$$';

    this.recoveryService.requestNewPassword({
      newPassword,
      newPasswordConfirmation: newPassword,
      userId: user.id as string
    })
      .subscribe((data) => {
        if (data.success) {
          this.message.Ok('Contraseña reiniciada')
        } else {
          this.message.errorTimeOut('', data.message)
        }
      })
  }
}
