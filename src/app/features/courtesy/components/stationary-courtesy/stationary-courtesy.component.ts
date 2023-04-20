import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {FormBuilder, FormControl, FormGroup} from '@angular/forms'
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
import {Subject, Subscription} from 'rxjs'
import {DataTableOptions} from '../../../../shared/model/DataTableOptions'
import {CompaniesModel} from '../../../management/components/users/models/companies.model'
import {CompaniesService} from '../../../management/components/users/services/companies.service'
import {ListCheckModel, SelectModel} from '../../../../shared/model/CommonModels'
import {ListCheckboxService} from '../../../../shared/forms/list-checkbox-container/service/list-checkbox.service'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-stationary-courtesy',
  templateUrl: './stationary-courtesy.component.html',
  styleUrls: ['./stationary-courtesy.component.css']
})
export class StationaryCourtesyComponent
  implements AfterViewInit, OnDestroy, OnInit {
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
  $subs: Subscription = Subscription.EMPTY
  listParkingToCourtesy: ListCheckModel[] = []
  courtesyHasParking: ParkingModel[] = []
  courtesyDetailID: string = ''

  /*Table*/
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective
  dtTrigger: Subject<any> = new Subject()
  formGroup: FormGroup

  /* Permissions */
  createCourtesyStationary: string = environment.createCourtesyStationary
  editCourtesyStationary: string = environment.editCourtesyStationary
  addParkingToCourtesyStationary: string =
    environment.addParkingToCourtesyStationary

  addStationsCourtesyStationary: string =
    environment.addStationsCourtesyStationary
  private actions: string[] = this.permissionService.actionsOfPermissions

  constructor(
    private formBuilder: FormBuilder,
    private message: MessageService,
    private parkingService: ParkingService,
    private utilitiesService: UtilitiesService,
    private authService: AuthService,
    private permissionService: PermissionsService,
    private courtesyService: CourtesyService,
    private companyService: CompaniesService,
    private listCheckboxService: ListCheckboxService,
    private modal: NgbModal
  ) {
    this.stationaryForm = this.createForm()
    this.formGroup = formBuilder.group({filter: ['']})
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
        ...this.courtesyService.getCourtesyFormValue(this.stationaryForm, this.parkingId),
      stationId: this.stationaryForm.get('stationId')?.value
    }
  }

  inputValueFromNewCourtesy() {
    const type = this.stationaryForm.get('type')?.value
    return this.courtesyService.InputValueFromNewCourtesy(type)
  }

  getNewConditions() {

    this.typeOfCondition = this.courtesyService.getNewConditions(
      this.stationaryForm.getRawValue().type
    )

  }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }

  createForm(): FormGroup {
    const courtesyForm = this.courtesyService.createCourtesyFormGroup(this.authService.getParking().id)
    courtesyForm.addControl('stationId', new FormControl(null, []))
  return courtesyForm

  }

  async getTypeCourtesies(): Promise<SelectModel[]> {
    return await this.courtesyService.getTypes()

  }

  async getCourtesiesStationary(
    parkingId = this.parkingId
  ): Promise<StationsCourtesyModel[]> {
    /*
     *  When courtesy_details is null, that means that the antenna doesn't have courtesy
     *  is just the antenna.
     *  When courtesy_details is not null,
     *  that means that the antennas has courtesy.
     */
    return await this.parkingService
      .getAntennasWithStationaryCourtesy(parkingId)
      .then((x) => x.filter((a) => a.courtesy_detail))
  }

  async searchAntennasByParking() {
    this.message.showLoading()
    const parkingId = this.stationaryForm.controls['parkingId'].value
    this.allAntennas = await this.parkingService
      .getAntennasWithStationaryCourtesy(parkingId)
      .then((x) => x.filter((a) => a.courtesy_detail == null))
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
      return Promise.all([
        this.getTypeCourtesies(),
        this.getCourtesiesStationary(),
        this.courtesyService.getTypes().then(),
        this.companyService.getCompanies(this.parkingId).toPromise(),
        this.searchAntennasByParking()
      ])
        .then((resp) => {
          this.typeCourtesies = resp[0]
          this.stationsCourtesies = resp[1]
          this.courtesyTypes = resp[2]
          this.allCompanies = resp[3]
          // ignore resp [5]
        })
        .catch((x) => {
          this.message.errorTimeOut(
            '',
            'Hubo un error al recuperar la información inicial.'
          )
        })
        .finally(() => {
          this.rerender()
          if (this.allCompanies.length > 0) {
            this.stationaryForm
              .get('companyId')
              ?.setValue(this.allCompanies[0].id)
          }
          if (this.allAntennas.length > 0) {
            this.stationaryForm
              .get('stationId')
              ?.setValue(this.allAntennas[0].id)
          }
          this.message.hideLoading()
          this.loading = false
        })
    } catch (err: unknown) {
      throw new Error('')
    }
  }

  cleanForm() {
    this.stationaryForm.reset()
    this.stationaryForm.get('value')?.setValue(0)
    this.stationaryForm.get('valueTimeMinutes')?.setValue(0)
    this.stationaryForm.get('name')?.setValue('')
    this.stationaryForm.get('condition')?.setValue(1)
    this.stationaryForm.get('cantHours')?.setValue(0)
    this.stationaryForm.get('parkingId')?.setValue(this.parkingId)
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next()
  }

  ngOnDestroy(): void {
    try {
      this.dtTrigger.unsubscribe()
      this.$subs.unsubscribe()
    } catch (e) {
    }
  }

  validateId(id: string | undefined) {
    return id == undefined ? '' : id
  }

  async openParkingToCourtesy(courtesyDetailId: string = '', contenido: any) {
    this.courtesyDetailID = courtesyDetailId
    this.courtesyHasParking = await this.courtesyService
      .getParkingForCourtesy(courtesyDetailId)
      .toPromise()

    let newList: ListCheckModel[] = this.allParking.map((p) => {
      return {
        id: p.id,
        name: p.name,
        isChecked: !!this.courtesyHasParking.find((element) => element.id == p.id),
        disable: !!this.courtesyHasParking.find((element) => element.id == p.id)
      }
    })

    this.listCheckboxService.sendData(newList)
    this.modal.open(contenido)
  }

  addParkingToCourtesy() {
    let addParking = this.listParkingToCourtesy
      .filter((value) => value.isChecked && !value.disable)
      .map((val) => val.id)
    this.courtesyService
      .addParkingToCourtesy(addParking, this.courtesyDetailID)
      .then((data) => this.message.OkTimeOut())
    this.modal.dismissAll()
  }

  editAntenna(antenna: StationsCourtesyModel) {
    antenna.id = this.validateId(antenna.id)
    this.allAntennas.push(antenna)
    this.idEditAntenna = antenna.courtesy_detail!.id
    this.stationaryForm
      .get('value')
      ?.setValue(Math.trunc(antenna.courtesy_detail!.value ?? 0))
    this.stationaryForm
      .get('valueTimeMinutes')
      ?.setValue(Math.round((antenna.courtesy_detail!.value % 1) * 60))
    this.stationaryForm.get('type')?.setValue(antenna.courtesy_detail!.type)
    this.stationaryForm.get('name')?.setValue(antenna.courtesy_detail!.name)
    this.stationaryForm.get('stationId')?.setValue(antenna.id)
    this.stationaryForm
      .get('companyId')
      ?.setValue(antenna.courtesy_detail!.company.id)
    this.stationaryForm
      .get('condition')
      ?.setValue(antenna.courtesy_detail!.condition)
    this.stationaryForm
      .get('cantHours')
      ?.setValue(antenna.courtesy_detail!.cantHours)
    this.stationaryForm.get('parkingId')?.setValue(this.parkingId)
  }

  deleteAntenna(antenna: StationsCourtesyModel) {
    this.message.infoTimeOut('Funcion en construccion')
  }

  downloadQR(antenna: StationsCourtesyModel) {
    this.message.infoTimeOut('Funcion en construccion')
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
      this.utilitiesService.markAsTouched(this.stationaryForm)
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
        this.parkingService
          .editStationaryCourtesy(newCourtesy)
          .subscribe((data) => {
            if (data.success) {
              this.idEditAntenna = ''
            } else {
              this.message.error(data.message)
            }
          })
      }
    } finally {
      this.getInitialData()
      this.cleanForm()
      this.message.OkTimeOut()
    }
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(({parkingId}) => {
      this.parkingId = parkingId
      this.stationaryForm.get('parkingId')?.setValue(parkingId)

      this.utilitiesService.markAsUnTouched(this.stationaryForm)
      this.getInitialData().then()
    })
    this.parkingService.parkingLot$.subscribe((parkings) => {
      this.allParking = parkings
    })

    this.$subs = this.listCheckboxService.recivedData().subscribe((p) => {
      this.listParkingToCourtesy = p
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
}
