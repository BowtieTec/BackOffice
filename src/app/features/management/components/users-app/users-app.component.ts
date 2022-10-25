import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {environment} from '../../../../../environments/environment'
import {Subject} from 'rxjs'
import {NewUserModel, updateUserApp} from '../users/models/newUserModel'
import {DataTableDirective} from 'angular-datatables'
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms'
import {UserService} from '../users/services/user.service'
import {MessageService} from '../../../../shared/services/message.service'
import {PermissionsService} from '../../../../shared/services/permissions.service'
import {DataTableOptions} from '../../../../shared/model/DataTableOptions'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'
import {UtilitiesService} from '../../../../shared/services/utilities.service'

@Component({
  selector: 'app-users-app',
  templateUrl: './users-app.component.html',
  styleUrls: ['./users-app.component.css']
})
export class UsersAppComponent implements OnInit, OnDestroy, AfterViewInit {
  deleteUser = environment.deleteUser
  editUser = environment.editUser
  isEditEmail = false
  @Input() subject: Subject<NewUserModel> = new Subject<NewUserModel>()
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective
  dtTrigger: Subject<any> = new Subject()
  formGroup: UntypedFormGroup
  appUserForm: UntypedFormGroup
  users: NewUserModel[] = []
  dtOptions: any = {};
  constructor(
    private userService: UserService,
    private formBuilder: UntypedFormBuilder,
    private message: MessageService,
    private permissionsService: PermissionsService,
    private modal: NgbModal,
    private utilitiesService: UtilitiesService
  ) {
    this.formGroup = formBuilder.group({filter: ['']})
    this.appUserForm = this.createEditUserAppForm()
  }

  get formUserAppValues(): updateUserApp {
    return {
      id: this.appUserForm.get('id')?.value,
      name: this.appUserForm.get('name')?.value,
      last_name: this.appUserForm.get('last_name')?.value,
      email: this.appUserForm.get('email')?.value,
      phone_number: this.appUserForm.get('phone')?.value
    }
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'copyHtml5',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend: 'excelHtml5',
          exportOptions: {
            columns: ':visible'
          }
        },
      ]
    };
    this.getUsersApp()
    this.subject.subscribe((user: NewUserModel) => {
      this.getUsersApp()
    })

  }

  ifHaveAction(action: string) {
    return this.permissionsService.ifHaveAction(action)
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next()
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }

  getStatus(status: number) {
    switch (status) {
      case 1:
        return 'Sin confirmar'
      case 2:
        return 'Sin información General'
      case 3:
        return 'Aceptando terminos y condiciones'
      case 4:
        return 'Habilitado'
      case 5:
        return 'Habilitado'
      default:
        return 'Inhabilitado'
    }
  }

  getEmailEdit(user: NewUserModel) {
    this.isEditEmail = !!(user.appleId || user.googleId)
  }

  getRegister(user: NewUserModel) {
    if (user.appleId) {
      return 'AppleId'
    } else if (user.googleId) {
      return 'AppleId'
    } else {
      return 'Registro Normal'
    }
  }

  async EditUserApp() {
    if (this.appUserForm.invalid) {
      this.message.error('', 'Datos no válidos o faltantes')
      return
    }
    const userAppVal = this.formUserAppValues
    this.userService
      .editUserApp(userAppVal)
      .toPromise()
      .then((data) => {
        if (data.success) {
          this.message.infoTimeOut('Se guardaron los cambios correctamente')
          this.getUsersApp()
          this.modal.dismissAll()
        } else {
          this.message.error('', data.message)
        }
      })
  }

  open(user: NewUserModel) {
    this.appUserForm.setValue({id:user.id,name:user.name,last_name:user.last_name,email:user.email,phone:user.phone_number})
    this.getEmailEdit(user)
  }

  private getUsersApp() {
    this.userService
      .getUsersApp()
      .toPromise()
      .then((data) => {
        this.users = data.data.users
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

  private createEditUserAppForm() {
    return this.formBuilder.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      last_name: [''],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(this.utilitiesService.getPatterEmail)
        ]
      ],
      phone: [
        '',
        [Validators.required]
      ]
    })
  }
}
