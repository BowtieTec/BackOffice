import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core'
import {CourtesyService} from '../../services/courtesy.service'
import {MessageService} from '../../../../shared/services/message.service'
import {CourtesyModel, CourtesyTypeModel} from '../../models/Courtesy.model'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {UtilitiesService} from '../../../../shared/services/utilities.service'
import {AuthService} from '../../../../shared/services/auth.service'
import {DataTableDirective} from 'angular-datatables'
import {Subject} from 'rxjs'
import {DataTableOptions} from '../../../../shared/model/DataTableOptions'
import {saveAs} from 'file-saver'
import {PermissionsService} from '../../../../shared/services/permissions.service'
import {environment} from '../../../../../environments/environment'
import {ParkingService} from '../../../parking/services/parking.service'
import {ParkingModel} from '../../../parking/models/Parking.model'
import {CompaniesModel} from '../../../management/components/users/models/companies.model'
import {CompaniesService} from '../../../management/components/users/services/companies.service'
import {SelectModel} from '../../../../shared/model/CommonModels'
import {ToastrService} from 'ngx-toastr'

@Component({
  selector: 'app-courtesy',
  templateUrl: './courtesy.component.html',
  styleUrls: ['./courtesy.component.css']
})
export class CourtesyComponent implements AfterViewInit, OnDestroy {
  allParking: ParkingModel[] = []
  courtesyTypes: CourtesyTypeModel[] = []
  newCourtesyForm: FormGroup
  parkingId: string = this.authService.getParking().id
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
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private authService: AuthService,
    private permissionService: PermissionsService,
    private parkingService: ParkingService,
    private companyService: CompaniesService,
    private toast: ToastrService
  ) {
    this.messageService.showLoading()
    this.formGroup = formBuilder.group({filter: ['']})
    this.newCourtesyForm = this.createForm()
    this.getInitialData()
      .then(() => this.messageService.hideLoading())
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
      .toPromise()
      .then((data) => {
        if (data.success) {
          this.courtesyTypes = data.data.type.filter((x: any) => x.id != 3)
          this.messageService.hideLoading()
        } else {
          this.messageService.errorTimeOut(
            '',
            'No se pudo cargar la información inicial. Intente mas tarde.'
          )
        }
      })
      .then(() => {
        return this.getCourtesies()
      })
      .then(() => {
        this.parkingService
          .getAllParking()
          .then((x) => (this.allParking = x.data.parkings))
      })
      .then(() => {
        if (this.ifHaveAction('listLocal')) {
          return this.companyService
            .getCompanies(this.parkingId)
            .toPromise()
            .then((x) => (this.allCompanies = x))
        }
        return
      })
      .then(() => {
        this.messageService.hideLoading()
      })
  }

  get InputValueFromNewCourtesy() {
    const type = this.newCourtesyForm.get('type')?.value
    return type == 0 ? 'Valor de tarifa fija' :
      type == 1 ? 'Porcentaje de descuento' :
        type == 2 ? 'Valor de descuento' :
          type == 4 ? 'Cantidad de horas' : 'Valor'
  }

  getCourtesy(): CourtesyModel {
    const minutes: number = (this.newCourtesyForm.getRawValue().valueTimeMinutes / 60) <= 0 ? 0 : (this.newCourtesyForm.getRawValue().valueTimeMinutes / 60)
    const value: number = (Number(this.newCourtesyForm.getRawValue().value) + Number(minutes))
    return {
      parkingId: this.parkingId,
      name: this.newCourtesyForm.controls['name'].value,
      type: this.newCourtesyForm.controls['type'].value,
      value,
      valueTimeMinutes: this.newCourtesyForm.controls['valueTimeMinutes'].value / 60,
      quantity: this.newCourtesyForm.controls['quantity'].value,
      companyId: this.newCourtesyForm.controls['companyId'].value,
      condition: this.newCourtesyForm.controls['condition'].value,
      cantHours: this.newCourtesyForm.controls['cantHours'].value
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
          this.messageService.error('', data.message)
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
    this.newCourtesyForm.get('type')?.setValue('0')
    this.newCourtesyForm.get('value')?.setValue('')
    this.newCourtesyForm.get('quantity')?.setValue('')
    this.newCourtesyForm.get('parkingId')?.setValue(this.authService.getParking().id)
    this.newCourtesyForm.get('companyId')?.setValue('0')
    this.newCourtesyForm.get('condition')?.setValue('0')
    this.newCourtesyForm.get('cantHours')?.setValue('0')
    this.newCourtesyForm.get('valueTimeMinutes')?.setValue('0')
    this.utilitiesService.markAsUnTouched(this.newCourtesyForm)
  }

  saveCourtesy() {
    if (this.newCourtesyForm.valid) {
      this.cantCourtesiesCreating++
      this.messageService.info('Recibirá una pequeña notificación cuando la cortesía haya terminado de crearse. Tomar en cuenta que entre mayor sea el numero, mas tiempo se necesita para crearse.', 'Creando cortesías')
      const newCourtesy: CourtesyModel = this.getCourtesy()

      this.cleanCourtesyForm()
      this.courtesyService.saveCourtesy(newCourtesy).subscribe((data) => {
        if (data.success) {
          this.toast.success('Cortesía creada satisfactoriamente', 'Cortesía creada')
        } else {
          this.messageService.error('No pudo crearse la cortesía', data.message)
        }
        this.cantCourtesiesCreating--
        this.getCourtesies().then(() => {
          this.messageService.hideLoading()
        })
      })
    } else {
      this.messageService.errorTimeOut(
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
    this.messageService.showLoading()
    courtesies.id = !courtesies.id ? '' : courtesies.id
    this.courtesyService.getPDF(courtesies.id).subscribe((data) => {
      saveAs(data, courtesies.name + '.pdf')
      this.messageService.OkTimeOut()
    })
  }

  private createForm() {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['0', [Validators.required]],
      value: ['0', [Validators.required, Validators.min(0)]],
      valueTimeMinutes: [0, [Validators.max(60), Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(2), Validators.max(100)]],
      parkingId: [this.authService.getParking().id],
      companyId: ['0', [Validators.required, Validators.minLength(2)]],
      condition: ['0', [Validators.required, Validators.minLength(1)]],
      cantHours: ['0', [Validators.required]]
    })
  }

  private rerender() {
    if (this.dtElement != undefined) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy()
        this.dtTrigger.next()
      })
    }
  }

  getNewConditions() {
    this.typeOfCondition = this.courtesyService.getNewConditions(this.newCourtesyForm.getRawValue().type)
  }
}
