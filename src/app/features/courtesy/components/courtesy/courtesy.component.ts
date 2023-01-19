import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {CourtesyService} from '../../services/courtesy.service'
import {MessageService} from '../../../../shared/services/message.service'
import {CourtesyModel, CourtesyTypeModel} from '../../models/Courtesy.model'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {UtilitiesService} from '../../../../shared/services/utilities.service'
import {AuthService} from '../../../../shared/services/auth.service'
import {DataTableDirective} from 'angular-datatables'
import {Subject} from 'rxjs'
import {DataTableOptions} from '../../../../shared/model/DataTableOptions'
import {saveAs} from 'file-saver'
import {PermissionsService} from '../../../../shared/services/permissions.service'
import {environment} from '../../../../../environments/environment'
import {ParkingService} from '../../../parking/services/parking.service'
import {CompaniesModel} from '../../../management/components/users/models/companies.model'
import {CompaniesService} from '../../../management/components/users/services/companies.service'
import {SelectModel} from '../../../../shared/model/CommonModels'
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-courtesy',
  templateUrl: './courtesy.component.html',
  styleUrls: ['./courtesy.component.css']
})
export class CourtesyComponent implements AfterViewInit, OnDestroy, OnInit {
  courtesyTypes: CourtesyTypeModel[] = []
  newCourtesyForm: FormGroup
  parkingId: string = ''
  courtesies: CourtesyModel[] = []
  allCompanies: CompaniesModel[] = []
  discountOnWhatList: SelectModel[] = this.courtesyService.DiscountOnWhatOptions
  typeOfCondition: SelectModel[] = environment.TypeOfCondition
  cantCourtesiesCreating = 0
  /*Table*/
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective
  dtTrigger: Subject<any> = new Subject()
  formGroup: FormGroup

  /*Permissions*/
  listCourtesy = environment.listCourtesy
  downloadCourtesy = environment.downloadCourtesy
  createCourtesy = environment.createCourtesy

  constructor(
    private courtesyService: CourtesyService,
    private message: MessageService,
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private authService: AuthService,
    private permissionService: PermissionsService,
    private parkingService: ParkingService,
    private companyService: CompaniesService,
    private toast: ToastrService
  ) {
    this.formGroup = formBuilder.group({filter: ['']})
    this.newCourtesyForm = this.createForm()
  }

  get isSudo() {
    return this.authService.isSudo
  }

  get parkingSelected() {
    return this.newCourtesyForm.get('parkingId')?.value
  }

  get dtOptions() {
    return DataTableOptions.getSpanishOptions(10)
  }

  get conditionValue() {
    return this.newCourtesyForm.get('condition')?.value
  }

  inputValueFromNewCourtesy() {
    const type = this.newCourtesyForm.get('type')?.value
    return this.courtesyService.InputValueFromNewCourtesy(type)
  }

  getTypeDescription(id: number) {
    const newDescription = this.courtesyTypes.find((x) => x.id == id)
    return newDescription == undefined
      ? new CourtesyTypeModel()
      : newDescription
  }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }

  controlInvalid(control: string) {
    return this.utilitiesService.controlInvalid(this.newCourtesyForm, control)
  }

  getInitialData() {
    return this.courtesyService
      .getTypes()
      .then((data) => {
        this.courtesyTypes = data
        return this.getCourtesies()
      })
      .then(() => {
        return this.companyService
          .getCompanies(this.parkingId)
          .toPromise()
          .then((x) => (this.allCompanies = x))
      })
      .finally(() => {
        this.newCourtesyForm.get('parkingId')?.setValue(this.parkingId)
        this.newCourtesyForm.get('companyId')?.setValue(this.allCompanies[0].id)
      })
  }

  getCourtesy(): CourtesyModel {
    return {
      ...this.courtesyService.getCourtesyFormValue(this.newCourtesyForm, this.parkingId),
      quantity: this.newCourtesyForm.controls['quantity'].value
    }
  }

  getCourtesies(parkingId = this.parkingId) {
    return this.courtesyService
      .getCourtesys(parkingId)
      .toPromise()
      .then((data) => {
        if (data.success) {
          this.courtesies = data.data
          this.rerender()
        } else {
          this.message.error('', data.message)
        }
      })
  }

  getConditionDescription(courtesy: CourtesyModel) {
    return courtesy.condition == 2
      ? 'Si el total de horas es menor o igual a ' + courtesy.cantHours
      : 'Siempre'
  }

  getCompanyName(id: string) {
    return this.allCompanies.find((x) => x.id == id)?.name
  }

  cleanCourtesyForm() {
    this.newCourtesyForm.get('name')?.setValue('')
    this.newCourtesyForm.get('value')?.setValue(null)
    this.newCourtesyForm.get('type')?.setValue(null)
    this.newCourtesyForm.get('quantity')?.setValue(null)
    this.newCourtesyForm
      .get('parkingId')
      ?.setValue(this.authService.getParking().id)
    this.newCourtesyForm.get('cantHours')?.setValue(0)
    this.newCourtesyForm.get('valueTimeMinutes')?.setValue(0)
    this.utilitiesService.markAsUnTouched(this.newCourtesyForm)
  }

  saveCourtesy() {
    this.validateValue()
    if (this.newCourtesyForm.valid) {
      this.cantCourtesiesCreating++
      this.message.info(
        'Recibirá una pequeña notificación cuando la cortesía haya terminado de crearse. Tomar en cuenta que entre mayor sea el numero, mas tiempo se necesita para crearse.',
        'Creando cortesías'
      )
      const newCourtesy: CourtesyModel = this.getCourtesy()
      this.courtesyService.saveCourtesy(newCourtesy).then(async (data) => {
        if (data.success) {
          this.toast.success(
            'Cortesía creada satisfactoriamente',
            'Cortesía creada'
          )
        } else {
          this.message.error('No pudo crearse la cortesía', data.message)
        }
        this.cantCourtesiesCreating--
        await this.getCourtesies()
      }).catch((err) => {
        this.cantCourtesiesCreating--
        throw new Error(err.message)
      }).then(() => this.cleanCourtesyForm());
    } else {
      this.utilitiesService.markAsTouched(this.newCourtesyForm)
      this.message.errorTimeOut(
        'Datos faltantes o incorrectos',
        'Por favor, verificar que los datos son correctos y estan completos.'
      )
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next()
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
    this.cantCourtesiesCreating = 0
  }

  downloadPDF(courtesies: CourtesyModel) {
    this.message.OkTimeOut('...Generando archivo PDF')
    courtesies.id = !courtesies.id ? '' : courtesies.id
    this.courtesyService.getPDF(courtesies.id).subscribe((data) => {
      saveAs(data, courtesies.name + '.pdf')
      this.message.OkTimeOut()
    })
  }

  validateValue() {
    const type = this.newCourtesyForm.get('type')?.value
    if (type == 1) {
      this.newCourtesyForm.get('value')?.setValidators([Validators.required, Validators.min(0), Validators.max(100)])
      this.newCourtesyForm.get('value')?.updateValueAndValidity()
      return
    }
    if (type == 4) {
      this.newCourtesyForm.get('value')?.setValidators([Validators.required, Validators.min(0), Validators.max(24)])
      this.newCourtesyForm.get('value')?.updateValueAndValidity()
      return
    }
    this.newCourtesyForm.get('value')?.setValidators([Validators.required, Validators.max(100), Validators.min(0)])
    this.newCourtesyForm.get('value')?.updateValueAndValidity()
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(({parkingId, user}) => {
      this.message.showLoading()
      this.parkingId = parkingId
      this.newCourtesyForm.get('parkingId')?.setValue(parkingId)
      this.getInitialData().finally(() => this.message.hideLoading())
    })
  }

  private createForm(): FormGroup {
    const parkingId = this.authService.getParking().id
    const courtesyForm = this.courtesyService.createCourtesyFormGroup(parkingId)
    courtesyForm.addControl('quantity', new FormControl('', [Validators.required, Validators.min(2), Validators.max(100)]))
    return courtesyForm
  }

  private rerender() {
    if (this.dtElement != undefined) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy()
        this.dtTrigger.next()
      })
    }
  }
}
