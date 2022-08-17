import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import {
  UntypedFormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import { MessageService } from '../../../../shared/services/message.service'
import { ParkingService } from '../../../parking/services/parking.service'
import { UtilitiesService } from '../../../../shared/services/utilities.service'
import { AuthService } from '../../../../shared/services/auth.service'
import { PermissionsService } from '../../../../shared/services/permissions.service'
import { environment } from '../../../../../environments/environment'
import { ParkingModel } from '../../../parking/models/Parking.model'
import { CourtesyService } from '../../services/courtesy.service'
import {
  CreateStationaryCourtesy,
  StationsCourtesyModel
} from '../../../parking/models/StationaryCourtesy.model'
import { CourtesyTypeModel } from '../../models/Courtesy.model'
import { DataTableDirective } from 'angular-datatables'
import { Subject } from 'rxjs'
import { DataTableOptions } from '../../../../shared/model/DataTableOptions'
import { CompaniesModel } from '../../../management/components/users/models/companies.model'
import { CompaniesService } from '../../../management/components/users/services/companies.service'
import { SelectModel } from '../../../../shared/model/CommonModels'
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
import { Subject, Subscription } from 'rxjs'
import {DataTableOptions} from '../../../../shared/model/DataTableOptions'
import {CompaniesModel} from '../../../management/components/users/models/companies.model'
import {CompaniesService} from '../../../management/components/users/services/companies.service'
import { ListCheckModel, listID, SelectModel } from '../../../../shared/model/CommonModels'
import { ListCheckboxService } from '../../../../shared/forms/list-checkbox-container/service/list-checkbox.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-stationary-courtesy',
  templateUrl: './stationary-courtesy.component.html',
  styleUrls: ['./stationary-courtesy.component.css']
})
export class StationaryCourtesyComponent
  implements AfterViewInit, OnDestroy, OnInit
{
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
  courtesyDetailID:string = ''

  /*Table*/
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective
  dtTrigger: Subject<any> = new Subject()
  formGroup: FormGroup

  /* Permissions */
  createCourtesyStationary: string = environment.createCourtesyStationary
  editCourtesyStationary: string = environment.editCourtesyStationary
  addParkingToCourtesyStationary: string = environment.addParkingToCourtesyStationary

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
    private companyService: CompaniesService,
    private listCheckboxService: ListCheckboxService,
    private modal: NgbModal,
  ) {
    this.stationaryForm = this.createForm()
    this.formGroup = formBuilder.group({ filter: [''] })
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
      value:
        Number(this.stationaryForm.get('value')?.value) +
        Number(this.stationaryForm.get('valueTimeMinutes')?.value / 60),
      valueTimeMinutes: this.stationaryForm.get('valueTimeMinutes')?.value,
      type: this.stationaryForm.get('type')?.value,
      name: this.stationaryForm.get('name')?.value,
      stationId: this.stationaryForm.get('stationId')?.value,
      companyId: this.stationaryForm.controls['companyId'].value,
      condition: this.stationaryForm.controls['condition'].value,
      cantHours: this.stationaryForm.controls['cantHours'].value
    }
  }

  get InputValueFromNewCourtesy() {
    const type = this.stationaryForm.getRawValue().type
    return type == 0
      ? 'Valor de tarifa fija'
      : type == 1
      ? 'Porcentaje de descuento'
      : type == 2
      ? 'Valor de descuento'
      : type == 4
      ? 'Cantidad de horas'
      : 'Valor'
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
    return this.formBuilder.group({
      parkingId: [this.parkingId, [Validators.required]],
      value: [0, [Validators.required, Validators.min(0)]],
      valueTimeMinutes: [0, [Validators.max(60), Validators.min(0)]],
      type: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      stationId: ['0', [Validators.required, Validators.minLength(5)]],
      companyId: ['0', [Validators.required, Validators.minLength(5)]],
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
        .finally(() => {
          this.rerender()
          if(this.allCompanies.length > 0){
            this.stationaryForm.get('companyId')?.setValue(this.allCompanies[0].id)
          }
          if(this.allAntennas.length > 0){
            this.stationaryForm.get('stationId')?.setValue(this.allAntennas[0].id)
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

  async openParkingToCourtesy(courtesyDetailId:string = '',contenido:any){
    this.courtesyDetailID = courtesyDetailId
    this.courtesyHasParking  = await this.courtesyService.getParkingForCourtesy(courtesyDetailId).toPromise()

    let newList:ListCheckModel[] = this.allParking.map((p) => {
      return {
        id: p.id,
        name: p.name,
        isChecked: this.courtesyHasParking.find(element => element.id == p.id)?true:false,
        disable: this.courtesyHasParking.find(element => element.id == p.id)?true:false
      }
    })

    this.listCheckboxService.sendData(newList)
    this.modal.open(contenido)
  }

  addParkingToCourtesy(){
    let addParking =  this.listParkingToCourtesy.filter((value) => value.isChecked && !value.disable).map((val) =>val.id)
    this.courtesyService.addParkingToCourtesy(addParking,this.courtesyDetailID).then((data) => this.message.OkTimeOut())
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
      ? { id: null, name: 'Sin descripción' }
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
    this.authService.user$.subscribe(({ parkingId }) => {
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
