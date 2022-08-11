import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms'
import {MessageService} from '../../../../shared/services/message.service'
import {ParkingService} from '../../../parking/services/parking.service'
import {UtilitiesService} from '../../../../shared/services/utilities.service'
import {AuthService} from '../../../../shared/services/auth.service'
import {PermissionsService} from '../../../../shared/services/permissions.service'
import {environment} from '../../../../../environments/environment'
import {ParkingModel} from '../../../parking/models/Parking.model'
import {CourtesyService} from '../../services/courtesy.service'
import {CreateStationaryCourtesy, StationsCourtesyModel} from '../../../parking/models/StationaryCourtesy.model'
import {CourtesyTypeModel} from '../../models/Courtesy.model'
import {DataTableDirective} from 'angular-datatables'
import {Subject} from 'rxjs'
import {DataTableOptions} from '../../../../shared/model/DataTableOptions'
import {CompaniesModel} from '../../../management/components/users/models/companies.model'
import {CompaniesService} from '../../../management/components/users/services/companies.service'
import {SelectModel} from '../../../../shared/model/CommonModels'

@Component({
  selector: 'app-stationary-courtesy',
  templateUrl: './stationary-courtesy.component.html',
  styleUrls: ['./stationary-courtesy.component.css']
})
export class StationaryCourtesyComponent implements AfterViewInit, OnDestroy, OnInit {
  loading = true
  @Input() parkingId: string = this.authService.getParking().id
  allCompanies: CompaniesModel[] = []
  stationaryForm: FormGroup
  courtesyTypes: CourtesyTypeModel[] = []
  idEditAntenna = ''
  allParking: ParkingModel[] = Array<ParkingModel>()
  typeCourtesies: SelectModel[] = []
  stationsCourtesies: StationsCourtesyModel[] = []
  allAntennas: StationsCourtesyModel[] = []
  typeOfCondition: SelectModel[] = this.courtesyService.TypeOfConditions

  /*Table*/
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective
  dtTrigger: Subject<any> = new Subject()
  formGroup: UntypedFormGroup

  /* Permissions */
  createCourtesyStationary: string = environment.createCourtesyStationary
  editCourtesyStationary: string = environment.editCourtesyStationary
  addStationsCourtesyStationary: string =
    environment.addStationsCourtesyStationary
  private actions: string[] = this.permissionService.actionsOfPermissions

  constructor(
    private formBuilder: UntypedFormBuilder,
    private message: MessageService,
    private parkingService: ParkingService,
    private utilitiesService: UtilitiesService,
    private authService: AuthService,
    private permissionService: PermissionsService,
    private courtesyService: CourtesyService,
    private companyService: CompaniesService
  ) {
    this.stationaryForm = this.createForm()
    this.formGroup = formBuilder.group({filter: ['']})
  }

  getNewConditions() {
    this.typeOfCondition = this.courtesyService.getNewConditions(this.stationaryForm.getRawValue().type)
  }

  get dtOptions() {
    return DataTableOptions.getSpanishOptions(10)
  }

  get conditionValue() {
    return this.stationaryForm.get('condition')?.value
  }

  get isSudo() {
    return this.authService.isSudo
  }

  get stationaryCourtesiesFormValue(): CreateStationaryCourtesy {
    return {
      parkingId: this.stationaryForm.get('parkingId')?.value,
      value: Number(this.stationaryForm.get('value')?.value) + Number((this.stationaryForm.get('valueTimeMinutes')?.value / 60)),
      valueTimeMinutes: this.stationaryForm.get('valueTimeMinutes')?.value,
      type: this.stationaryForm.get('type')?.value,
      name: this.stationaryForm.get('name')?.value,
      stationId: this.stationaryForm.get('stationId')?.value,
      companyId: this.stationaryForm.controls['companyId'].value,
      condition: this.stationaryForm.controls['condition'].value,
      cantHours: this.stationaryForm.controls['cantHours'].value
    }
  }


  ifHaveAction(action: string) {
    return !!this.actions.find((x) => x == action)
  }

  createForm(): UntypedFormGroup {
    return this.formBuilder.group({

      parkingId: [this.parkingId, [Validators.required]],
      value: ['', [Validators.required, Validators.min(0)]],
      valueTimeMinutes: [0, [Validators.max(60), Validators.min(0)]],
      type: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      stationId: ['0', [Validators.required]],
      companyId: ['0', [Validators.required]],
      condition: [1, [Validators.required]],
      cantHours: [0]
    })
  }

  async getTypeCourtesies(): Promise<SelectModel[]> {
    return this.courtesyService
      .getTypes()
      .toPromise()
      .then((x) => {
        return x.data.type.filter((x: any) => x.id != 3)
      })
  }

  validateParam(param: any) {
    return param ? param : 'Sin valor'
  }

  async getCourtesiesStationary(parkingId = this.parkingId): Promise<StationsCourtesyModel[]> {
    /*
     *  When courtesy_details is null, that means that the antenna doesn't have courtesy
     *  is just the antenna.
     *  When courtesy_details is not null,
     *  that means that the antennas has courtesy.
     */
    return await this.parkingService.getAntennasWithStationaryCourtesy(parkingId).then(x => x.filter(a => a.courtesy_detail))
  }

  async searchAntennasByParking() {

    this.message.showLoading()
    const parkingId = this.stationaryForm.controls['parkingId'].value
    this.allAntennas = await this.parkingService.getAntennasWithStationaryCourtesy(parkingId).then(x => x.filter(a => a.courtesy_detail == null))
    if (this.allAntennas) {
      this.parkingId = parkingId
      this.stationsCourtesies = await this.getCourtesiesStationary(parkingId)
      this.rerender()
    }

    this.message.hideLoading()

  }

  async getInitialData() {
    try {
      this.message.showLoading()
      Promise.all([
        this.getTypeCourtesies(),
        this.getCourtesiesStationary(),
        this.courtesyService.getTypes().toPromise(),
        this.companyService.getCompanies(this.parkingId).toPromise(),
        this.searchAntennasByParking()
      ])
        .then((resp) => {
          this.typeCourtesies = resp[0]
          this.stationsCourtesies = resp[1]
          this.courtesyTypes = resp[2].data.type
          this.allCompanies = resp[3]
          // ignore resp [5]
        })
        .catch((x) => {
          this.message.errorTimeOut(
            '',
            'Hubo un error al recuperar la información inicial.'
          )
        })
        .then(() => {
          this.rerender()
          this.message.hideLoading()
        })
      this.loading = false
    } catch (err: unknown) {
      throw new Error('')
    }
  }

  cleanForm() {
    this.stationaryForm.reset()
    this.stationaryForm.get('value')?.setValue('0')
    this.stationaryForm.get('valueTimeMinutes')?.setValue(0)
    this.stationaryForm.get('type')?.setValue('0')
    this.stationaryForm.get('name')?.setValue('')
    this.stationaryForm.get('stationId')?.setValue('0')
    this.stationaryForm.get('companyId')?.setValue('0')
    this.stationaryForm.get('condition')?.setValue(0)
    this.stationaryForm.get('cantHours')?.setValue(0)
    this.stationaryForm.controls['parkingId'].setValue(this.parkingId)
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next()
  }

  ngOnDestroy(): void {
    try {
      this.dtTrigger.unsubscribe()
    } catch (e) {
    }
  }

  validateId(id: string | undefined) {
    return id == undefined ? '' : id
  }

  editAntenna(antenna: StationsCourtesyModel) {
    antenna.id = this.validateId(antenna.id)
    this.allAntennas.push(antenna);
    this.idEditAntenna = antenna.courtesy_detail!.id;
    this.stationaryForm.get('value')?.setValue(Math.trunc(antenna.courtesy_detail!.value))
    this.stationaryForm.get('valueTimeMinutes')?.setValue(Math.round((antenna.courtesy_detail!.value % 1) * 60))
    this.stationaryForm.get('type')?.setValue(antenna.courtesy_detail!.type)
    this.stationaryForm.get('name')?.setValue(antenna.courtesy_detail!.name)
    this.stationaryForm.get('stationId')?.setValue(antenna.id)
    this.stationaryForm.get('companyId')?.setValue(antenna.courtesy_detail!.company.id)
    this.stationaryForm.get('condition')?.setValue(antenna.courtesy_detail!.condition)
    this.stationaryForm.get('cantHours')?.setValue(antenna.courtesy_detail!.cantHours)
    this.stationaryForm.get('parkingId')?.setValue(this.parkingId)
  }

  deleteAntenna(antenna: StationsCourtesyModel) {
    this.message.infoTimeOut('Funcion en construccion')
  }

  downloadQR(antenna: StationsCourtesyModel) {
    this.message.infoTimeOut('Funcion en construccion')
  }

  get InputValueFromNewCourtesy() {
    const type = this.stationaryForm.getRawValue().type
    return type == 0 ? 'Valor de tarifa fija' :
      type == 1 ? 'Porcentaje de descuento' :
        type == 2 ? 'Valor de descuento' :
          type == 4 ? 'Cantidad de horas' : 'Valor'
  }

  getTypeDescription(id: number) {
    const newDescription = this.courtesyTypes.find((x) => x.id == id)
    return newDescription == undefined
      ? {id: null, name: 'Sin descripción'}
      : newDescription
  }

  async addStationaryCourtesies() {
    if (this.stationaryForm.invalid) {
      this.message.error('', 'Datos faltantes o incorrectos.')
      return
    }
    this.message.showLoading()
    try {
      const newCourtesy: CreateStationaryCourtesy =
        this.stationaryCourtesiesFormValue
      if (this.idEditAntenna == '') {

        const resp = await this.parkingService.createStationaryCourtesy(
          newCourtesy
        )
        if (resp.success) {
          await this.getInitialData()
        } else {
          this.message.error('', resp.message)
        }
      } else {
        newCourtesy.id = this.idEditAntenna
        this.parkingService.editStationaryCourtesy(newCourtesy)
          .subscribe((data) => {
            if (data.success) {
              this.idEditAntenna = ''
              this.getInitialData()
            } else {
              this.message.error(data.message)
            }
          })
      }
    } finally {
      this.cleanForm()
      this.message.OkTimeOut()
      setTimeout(() => this.message.hideLoading(), 3000)
    }
  }

  private rerender() {
    if (this.dtElement != undefined) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy()
        this.dtTrigger.next()
      })
    }
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(({parkingId}) => {
      this.parkingId = parkingId
      this.stationaryForm.get('parkingId')?.setValue(parkingId)
      this.getInitialData().catch()
    })
    this.parkingService.parkingLot$.subscribe((parkings) => {
      this.allParking = parkings
    })
  }
}
