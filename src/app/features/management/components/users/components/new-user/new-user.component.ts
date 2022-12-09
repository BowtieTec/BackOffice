import {Component, Input, OnInit} from '@angular/core'
import {UserService} from '../../services/user.service'
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {UtilitiesService} from '../../../../../../shared/services/utilities.service'
import {NewUserModel} from '../../models/newUserModel'
import {MessageService} from '../../../../../../shared/services/message.service'
import {Subject} from 'rxjs'
import {ParkingService} from '../../../../../parking/services/parking.service'
import {PermissionsService} from '../../../../../../shared/services/permissions.service'
import {environment} from '../../../../../../../environments/environment'
import {AuthService} from '../../../../../../shared/services/auth.service'
import {CompaniesService} from '../../services/companies.service'
import {CompaniesModel} from '../../models/companies.model'
import {Roles} from '../../utilities/User'
import {ParkingModel} from "../../../../../parking/models/Parking.model";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  @Input() subject = new Subject<NewUserModel>()
  newUserForm: FormGroup
  isEdit = false
  changeParkingAtCreateUser: string = environment.changeParkingAtCreateUser
  parkingId: string = this.authService.getParking().id
  companies: CompaniesModel[] = []
  otherParkingLot: ParkingModel[] = this.authService.getUser().user.otherParkings
  otherParkingLogSelected: ParkingModel[] = []
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
 fillFormWithUser (user: NewUserModel) {
   this.newUserForm.patchValue({
     name: user.name || '',
     last_name: user.last_name || '',
     email: user.email || '',
     role: user.role.id || '',
     user: user.user || '',
     password: 'EstaPuedeOnoSerLaContraseña100&'|| '',
     company: user.company?.id || user.company || null,
     parking: user.parking.id || this.authService.getParking().id,
     id: user.id || null
   })
  this.isEdit = true
  this.utilitiesService.markAsUnTouched(this.newUserForm)
}
  ngOnInit(): void {
    this.addCheckboxes()
     this.authService.user$.subscribe(async({user, parkingId}) => {
       this.messageServices.showLoading()
      this.parkingId = parkingId
      this.newUserForm.get('parking')?.setValue(parkingId)
      this.clearAllCheckboxes()
       await this.getCompanies()
       this.messageServices.hideLoading()
    })
       this.subject.subscribe(async(user: NewUserModel | null) => {
        if(user){
          this.cleanForm()
          if (user) {
            this.clearPasswordValidations()
            this.fillFormWithUser(user)
          }
          if (user?.otherParkings) {
            this.fillOtherParkingLotArrayCheckBox(user)
          }
          await this.authService.saveNewParking(user.parking)
        }
      })
  }

  isSudo() {
    return this.authService.isSudo
  }

  selectDefaultCheckBox() {
    this.getParkingLotsFormArray().controls.forEach((control: AbstractControl, index) => {
      if (this.otherParkingLot[index].id === this.newUserForm.get('parking')?.value) {
        control.setValue(true)
        control.disable()
        if (!this.otherParkingLogSelected.includes(this.otherParkingLot[index])) {
          this.otherParkingLogSelected.push(this.otherParkingLot[index])
        }
      }
    });
  }

  clearAllCheckboxes() {
    this.getParkingLotsFormArray().controls.forEach((control: AbstractControl, index) => {
      control.setValue(false)
      control.enable()
    });
    this.otherParkingLogSelected = [];
    this.selectDefaultCheckBox()
  }

  selectAllCheckboxes() {
    this.getParkingLotsFormArray().controls.forEach((control: AbstractControl) => {
      control.setValue(true);
    });
    this.otherParkingLogSelected = this.otherParkingLot;
  }

  saveNewUser() {
    this.messageServices.showLoading()
    if (this.newUserForm.invalid && !this.isEdit) {
      this.messageServices.error('', 'Datos no válidos o faltantes')
      return
    }
    let newUserValue: NewUserModel = this.newUserForm.getRawValue()
    if (!this.selectedRoleIsCourtesy) {
      newUserValue.company = null
    }
    if (!newUserValue) {
      this.utilitiesService.markAsTouched(this.newUserForm)
      this.messageServices.errorTimeOut('Datos incorrectos o faltantes.')
      return
    }
    newUserValue.otherParkings = this.getOtherParkingLotsIdSelected()
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
      this.cleanForm()
          this.subject.next()
          this.messageServices.OkTimeOut('Usuario editado con éxito.')
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

  getParkingLotsFormArray() {
    return this.newUserForm.controls['otherParkings'] as FormArray;
  }

  clearPasswordValidations() {
    this.newUserForm.get('password')?.clearValidators()
  }

  cleanForm() {
    this.newUserForm.reset()
    this.isEdit = false
    this.newUserForm.get('parking')?.setValue(this.parkingId)
    this.addPasswordValidations()
    this.selectAllCheckboxes()
  }

  controlInvalid(control: string): boolean {
    return this.utilitiesService.controlInvalid(this.newUserForm, control)
  }

  onChangeCheckbox(i: number, parking: ParkingModel, $event: Event) {
    const checked = ($event.target as HTMLInputElement).checked;
    if (checked) {
      this.otherParkingLogSelected.push(parking)
    } else {
      this.otherParkingLogSelected = this.otherParkingLogSelected.filter((item) => item.id !== parking.id)
    }
  }

  private addCheckboxes() {
    this.otherParkingLot.forEach((item) => this.getParkingLotsFormArray().push(new FormControl({
      value: true,
      disabled: item.id === this.parkingId
    })));

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
      role: [null, [Validators.required]],
      company: [],
      parking: [this.parkingId, [Validators.required]],
      otherParkings: new FormArray([])
    })
  }

  private fillOtherParkingLotArrayCheckBox (user: NewUserModel = this.authService.getUser().user as NewUserModel) {
    this.otherParkingLot.forEach((item, index) => {
      if (user.otherParkings?.find((obj: any) => obj.id === item.id)) {
        this.getParkingLotsFormArray().controls[index].setValue(true);
      } else {
        this.getParkingLotsFormArray().controls[index].setValue(false);
      }
      if (user.parking.id === item.id) {
        this.getParkingLotsFormArray().controls[index].disable()
      } else {
        this.getParkingLotsFormArray().controls[index].enable()
      }

    })
  }

  private getOtherParkingLotsIdSelected(): string[] {
    return this.otherParkingLogSelected.map(x => x.id)
  }
}
