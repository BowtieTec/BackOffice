import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core'
import {CreateStation, StationsCourtesyModel} from '../../../../../parking/models/StationaryCourtesy.model'
import {FormGroup, UntypedFormBuilder, Validators} from '@angular/forms'
import {MessageService} from '../../../../../../shared/services/message.service'
import {ParkingService} from '../../../../../parking/services/parking.service'
import {ParkingModel} from '../../../../../parking/models/Parking.model'
import {AuthService} from '../../../../../../shared/services/auth.service'
import {DataTableDirective} from 'angular-datatables'
import {Subject} from 'rxjs'
import {DataTableOptions} from '../../../../../../shared/model/DataTableOptions'
import {UtilitiesService} from '../../../../../../shared/services/utilities.service'
import {environment} from '../../../../../../../environments/environment'
import {PermissionsService} from '../../../../../../shared/services/permissions.service'

@Component({
  selector: 'app-antennas-from-courtesy',
  templateUrl: './antennas-from-courtesy.component.html',
  styleUrls: ['./antennas-from-courtesy.component.css']
})
export class AntennasFromCourtesyComponent
  implements AfterViewInit, OnDestroy, OnInit {
  @Input() parkingId: string = this.authService.getParking().id
  @Output() stationsSaved = new EventEmitter<boolean>()
  stationsCourtesy: StationsCourtesyModel[] = []
  idEditAntenna = ''
  antennasForm: FormGroup
  allParking: ParkingModel[] = Array<ParkingModel>()
  /* Permissions */
  editStationsCourtesyStationary: string =
    environment.editStationsCourtesyStationary
  deleteStationsCourtesyStationary: string =
    environment.deleteStationsCourtesyStationary

  /*Table*/
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective
  dtTrigger: Subject<any> = new Subject()
  formGroup: FormGroup
  private actions: string[] = this.permissionService.actionsOfPermissions

  constructor(
    private formBuilder: UntypedFormBuilder,
    private message: MessageService,
    private parkingService: ParkingService,
    private utilitiesService: UtilitiesService,
    private authService: AuthService,
    private permissionService: PermissionsService
  ) {
    this.antennasForm = this.createAntennasForm()
    this.formGroup = formBuilder.group({ filter: [''] })
    this.getInitialData()
  }

  get isSudo() {
    return this.authService.isSudo
  }

  get dtOptions() {
    return DataTableOptions.getSpanishOptions(10)
  }

  get antennaFormValue(): CreateStation {
    return {
      parking: this.antennasForm.get('parkingId')?.value,
      mac: this.antennasForm.get('mac')?.value.trim(),
      name: this.antennasForm.get('name')?.value.trim(),
      antena: this.antennasForm.get('antena')?.value.trim()
    }
  }

  ngOnInit(): void {
    this.parkingService.parkingLot$.subscribe((parkingLot) => {
      this.allParking = parkingLot
    })
    this.authService.user$.subscribe(({ parkingId }) => {
      this.parkingId = parkingId
      this.antennasForm.get('parkingId')?.setValue(parkingId)
      this.getInitialData()
    })
  }

  cleanForm() {
    this.idEditAntenna = ''
    this.antennasForm.controls['parkingId'].setValue(this.parkingId)
    this.antennasForm.controls['name'].setValue('')
    this.antennasForm.controls['mac'].setValue('')
    this.antennasForm.controls['antena'].setValue('')
    this.utilitiesService.markAsUnTouched(this.antennasForm)
  }

  validateId(id: string | undefined) {
    return id == undefined ? '' : id
  }

  editAntenna(antenna: StationsCourtesyModel) {
    antenna.id = this.validateId(antenna.id)
    this.idEditAntenna = antenna.id
    this.antennasForm.controls['parkingId'].setValue(antenna.parking.id)
    this.antennasForm.controls['name'].setValue(antenna.name)
    this.antennasForm.controls['mac'].setValue(antenna.mac)
    this.antennasForm.controls['antena'].setValue(antenna.antena)
  }

  deleteAntenna(antenna: StationsCourtesyModel) {
    this.message.showLoading()
    antenna.id = this.validateId(antenna.id)
    this.parkingService
      .deleteAntennaWithCourtesy(antenna.id)
      .subscribe((data) => {
        if (data.success) {
          this.searchStationsByParking()
          this.message.OkTimeOut('Borrada')
          this.stationsSaved.emit(true)
        } else {
          this.message.error(data.message)
        }
      })
  }

  getInitialData() {
    try {
      this.message.showLoading()
      this.parkingService
        .getAntennasWithStationaryCourtesy(this.parkingId)
        .then((resp) => {
          this.stationsCourtesy = resp
        })
        .then(() => this.rerender())
    } catch (ex: any) {
      throw new Error(ex.message)
    } finally {
      setTimeout(() => {
        this.message.hideLoading()
      }, 3000)
    }
  }

  ifHaveAction(action: string) {
    return !!this.actions.find((x) => x == action)
  }

  async searchStationsByParking() {
    const parkingId = this.antennasForm.controls['parkingId'].value
    this.stationsCourtesy =
      await this.parkingService.getAntennasWithStationaryCourtesy(parkingId)
    if (this.stationsCourtesy) {
      this.parkingId = parkingId
      this.rerender()
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next()
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }

  async createStationWithCourtesy() {
    if (this.antennasForm.invalid) {
      this.utilitiesService.markAsTouched(this.antennasForm)
      this.message.errorTimeOut('', 'Datos incorrectos o faltantes.')
      return
    }
    this.message.showLoading()
    const newAntenna = this.antennaFormValue

    if (this.idEditAntenna == '') {
      this.parkingService
        .createStationWithCourtesy(newAntenna)
        .subscribe((data) => {
          if (data.success) {
            this.cleanForm()
            this.searchStationsByParking()
            this.message.OkTimeOut()
            this.stationsSaved.emit(true)
          } else {
            this.message.error(data.message)
          }
        })
    } else {
      newAntenna.id = this.idEditAntenna
      this.parkingService
        .editStationWithCourtesy(newAntenna)
        .subscribe((data) => {
          if (data.success) {
            this.cleanForm()
            this.searchStationsByParking()
            this.message.OkTimeOut()
            this.stationsSaved.emit(true)
          } else {
            this.message.error(data.message)
          }
        })
      this.idEditAntenna = ''
    }
  }

  private createAntennasForm() {
    return this.formBuilder.group({
      parkingId: [this.parkingId, [Validators.required]],
      mac: ['', [Validators.required, Validators.pattern('^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$')]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      antena: ['', [Validators.required, Validators.maxLength(36), Validators.minLength(36)]]
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
