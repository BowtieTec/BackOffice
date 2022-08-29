import { Component, Input, OnInit } from '@angular/core'
import { UserService } from '../../services/user.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { UtilitiesService } from '../../../../../../shared/services/utilities.service'
import { NewUserModel } from '../../models/newUserModel'
import { MessageService } from '../../../../../../shared/services/message.service'
import { Subject } from 'rxjs'
import { ParkingModel } from '../../../../../parking/models/Parking.model'
import { ParkingService } from '../../../../../parking/services/parking.service'
import { PermissionsService } from '../../../../../../shared/services/permissions.service'
import { environment } from '../../../../../../../environments/environment'
import { AuthService } from '../../../../../../shared/services/auth.service'
import { CompaniesService } from '../../services/companies.service'
import { CompaniesModel } from '../../models/companies.model'
import { Roles } from '../../utilities/User'

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  @Input() subject = new Subject<NewUserModel>()
  newUserForm: FormGroup
  isEdit = false
  allParking: ParkingModel[] = []
  changeParkingAtCreateUser: string = environment.changeParkingAtCreateUser
  parkingId: string = this.authService.getParking().id
  companies: CompaniesModel[] = []

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private messageServices: MessageService,
    private parkingService: ParkingService,
    private permissionService: PermissionsService,
    private authService: AuthService,
    private companiesService: CompaniesService
  ) {
    this.newUserForm = this.createForm()
  }

  get selectedRoleIsCourtesy() {
    return this.newUserForm.getRawValue().role == Roles.Cortesias
  }

  get RawValue() {
    return this.newUserForm.getRawValue()
  }

  getRoles() {
    return this.userService.roles
  }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }

  ngOnInit(): void {
    this.subject.subscribe((user: NewUserModel) => {
      this.messageServices.showLoading()
      this.cleanForm()
      if (user) {
        this.clearPasswordValidations()
        this.newUserForm.controls['name'].setValue(user.name)
        this.newUserForm.controls['last_name'].setValue(user.last_name)
        this.newUserForm.controls['email'].setValue(user.email)
        this.newUserForm.controls['user'].setValue(user.user)
        this.newUserForm.controls['password'].setValue(
          'EstaPuedeOnoSerLaContraseña100&'
        )
        this.newUserForm.controls['role'].setValue(user.role)
        this.newUserForm.controls['name'].setValue(user.name)
        this.newUserForm.controls['parking'].setValue(
          user.parking.id ? user.parking.id : this.authService.getParking().id
        )
        this.newUserForm.controls['id'].setValue(user.id)
        this.isEdit = true
        this.utilitiesService.markAsUnTouched(this.newUserForm)
      }
      this.messageServices.hideLoading()
    })
    this.authService.user$.subscribe(({ parkingId }) => {
      this.parkingId = parkingId
      this.newUserForm.get('parking')?.setValue(parkingId)
      this.parkingId = parkingId
      this.getCompanies().then()
    })
    this.parkingService.parkingLot$.subscribe((parkingLot) => {
      this.allParking = parkingLot
    })
  }

  isSudo() {
    return this.authService.isSudo
  }

  saveNewUser() {
    this.messageServices.showLoading()
    if (this.newUserForm.invalid && !this.isEdit) {
      this.messageServices.error('', 'Datos no válidos o faltantes')
      return
    }
    let newUserValue: NewUserModel = this.newUserForm.getRawValue()
    if(!this.selectedRoleIsCourtesy){
      newUserValue.company = null
    }
    if (!newUserValue) {
      this.utilitiesService.markAsTouched(this.newUserForm)
      this.messageServices.errorTimeOut('Datos incorrectos o faltantes.')
      return
    }
    if (this.isEdit) {
      this.newUserForm.get('password')?.clearValidators()
      delete newUserValue.password
      this.userService
        .editUser(newUserValue)
        .toPromise()
        .then((data) => {
          if (data.success) {
            return data.data
          } else {
            this.messageServices.error('', data.message)
          }
        })
        .then((data) => {
          this.userService
            .saveRole(this.newUserForm.getRawValue().role, data.admin.id)
            .toPromise()
            .then((dataRole) => {
              if (dataRole.success) {
                this.cleanForm()
                this.messageServices.OkTimeOut('Guardado')
              } else {
                this.messageServices.error('', dataRole.message)
              }
            })
            .then(() => {
              this.subject.next()
            })
        })
    } else {
      delete newUserValue.id
      this.addPasswordValidations()
      this.userService
        .saveNewUser(newUserValue)
        .toPromise()
        .then((data) => {
          if (data.success) {
            this.messageServices.OkTimeOut('Guardado')
          } else {
            this.messageServices.error('', data.message)
          }
          this.cleanForm()
          this.isEdit = false
        })
        .catch((x) => {
          throw new Error(x.error.message)
        })
        .then(() => {
          this.cleanForm()
          this.subject.next()
        })
    }
  }

  async getCompanies() {
    this.companies = await this.companiesService
      .getCompanies(this.parkingId)
      .toPromise()
  }

  addPasswordValidations() {
    this.newUserForm
      .get('password')
      ?.addValidators([
        Validators.pattern(environment.settings.passwordPattern),
        Validators.required
      ])
  }

  clearPasswordValidations() {
    this.newUserForm.get('password')?.clearValidators()
  }

  cleanForm() {
    this.newUserForm.reset()
    this.isEdit = false
    this.newUserForm.get('parking')?.setValue(this.parkingId)
    this.newUserForm
      .get('role')
      ?.setValue('b5b821bb-f919-4bae-9b6d-75a144fe2082')
    this.addPasswordValidations()
  }

  controlInvalid(control: string): boolean {
    return this.utilitiesService.controlInvalid(this.newUserForm, control)
  }

  private createForm() {
    return this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(this.utilitiesService.getPatterEmail)
        ]
      ],
      user: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(environment.settings.passwordPattern)
        ]
      ],
      role: ['b5b821bb-f919-4bae-9b6d-75a144fe2082', [Validators.required]],
      company: [],
      parking: [this.parkingId, [Validators.required]]
    })
  }
}
