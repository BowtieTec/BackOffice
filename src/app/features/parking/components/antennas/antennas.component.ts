import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core'
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms'
import {AccessModel, CreateParkingStepFiveModel} from '../../models/CreateParking.model'
import {MessageService} from '../../../../shared/services/message.service'
import {ParkingService} from '../../services/parking.service'
import {UtilitiesService} from '../../../../shared/services/utilities.service'
import {ResponseModel} from '../../../../shared/model/Request.model'
import {AuthService} from '../../../../shared/services/auth.service'
import {PermissionsService} from '../../../../shared/services/permissions.service'
import {environment} from '../../../../../environments/environment'
import {DataTableDirective} from 'angular-datatables'
import {DataTableOptions} from '../../../../shared/model/DataTableOptions'
import {Subject} from 'rxjs'

@Component({
  selector: 'app-antennas', templateUrl: './antennas.component.html', styleUrls: ['./antennas.component.css']
})
export class AntennasComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() isCreatingParking = false
  @Input() parkingId: string = this.authService.getParking().id
  stepFiveForm!: UntypedFormGroup
  @Output() changeStep = new EventEmitter<number>()
  idEditAntenna = ''
  accessList: AccessModel[] = this.parkingService.getAccesses()
  antennas: CreateParkingStepFiveModel[] = new Array<CreateParkingStepFiveModel>()
  /*Table*/
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective
  dtTrigger: Subject<any> = new Subject()
  formGroup: UntypedFormGroup
  /*Permissions*/
  editAntennaAction = environment.editAntennas
  deleteAntennaAction = environment.deleteAntennas
  createAntennaAction = environment.createAntennas
  downloadQRAntennaAction = environment.downloadQRAntenna
  private actions: string[] = this.permissionService.actionsOfPermissions

  constructor(private formBuilder: UntypedFormBuilder, private message: MessageService, private parkingService: ParkingService, private utilitiesService: UtilitiesService, private authService: AuthService, private permissionService: PermissionsService) {
    this.stepFiveForm = this.createForm()
    this.formGroup = formBuilder.group({filter: ['']})
  }

  get dtOptions() {
    return DataTableOptions.getSpanishOptions(10)
  }

  getAccessName(type: number): AccessModel {
    const result = this.accessList.find((x) => x.id == type)

    return result === undefined ? new AccessModel() : result
  }

  controlInvalid(control: string) {
    return this.utilitiesService.controlInvalid(this.stepFiveForm, control)
  }

  addAntenna() {
    this.message.showLoading()
    if (this.stepFiveForm.invalid) {
      this.message.warningTimeOut('No ha llenado todos los datos. Para continuar por favor llene los datos necesarios.')
      return
    }
    if (this.idEditAntenna == '') {
      this.parkingService
        .setStepFive(this.getStepFive())
        .then((data: ResponseModel) => {
          if (data.success) {
            this.getInitialData().then(() => {
              this.message.OkTimeOut(data.message)
              this.cleanForm()
            })
          } else {
            this.message.error('', 'No pudo guardarse la antena, error: ' + data.message)
          }
        })
    } else {
      const antennaToEdit: CreateParkingStepFiveModel = this.getStepFive()
      antennaToEdit.id = this.idEditAntenna
      this.parkingService
        .editStepFive(antennaToEdit)
        .subscribe((data: ResponseModel) => {
          if (data.success) {
            this.cleanForm()
            this.getInitialData().then(() => {
              this.message.OkTimeOut('Guardado')
            })
          } else {
            this.message.error('', 'No pudo guardarse la antena, error: ' + data.message)
          }
          this.idEditAntenna = ''
        })
    }
  }

  emmitStep(number: number) {
    this.changeStep.emit(number)
  }

  validateId(id: string | undefined) {
    return id == undefined ? '' : id
  }

  editAntenna(antenna: CreateParkingStepFiveModel) {
    antenna.id = this.validateId(antenna.id)
    this.idEditAntenna = antenna.id
    this.stepFiveForm.controls['parking'].setValue(antenna.parking.id)
    this.stepFiveForm.controls['type_access'].setValue(antenna.type)
    this.stepFiveForm.controls['name_access'].setValue(antenna.name)
    this.stepFiveForm.controls['mac_access'].setValue(antenna.mac)
    this.stepFiveForm.controls['antenna_access'].setValue(antenna.antena)
    this.stepFiveForm.controls['isPrivate'].setValue(antenna.isPrivate)
  }

  deleteAntenna(antenna: CreateParkingStepFiveModel) {
    this.message.showLoading()
    antenna.id = this.validateId(antenna.id)
    this.parkingService.deleteAntenna(antenna.id).subscribe((data) => {
      if (data.success) {
        this.getInitialData().then(() => {
          this.message.OkTimeOut('Borrado')
        })
      }
    })
  }

  cleanForm() {
    this.idEditAntenna = ''
    this.stepFiveForm.controls['parking'].setValue(this.parkingId)
    this.stepFiveForm.controls['type_access'].setValue('')
    this.stepFiveForm.controls['name_access'].setValue('')
    this.stepFiveForm.controls['mac_access'].setValue('')
    this.stepFiveForm.controls['antenna_access'].setValue('')
    this.stepFiveForm.controls['isPrivate'].setValue(false)
    this.utilitiesService.markAsUnTouched(this.stepFiveForm)
  }

  downloadQR(antenna: CreateParkingStepFiveModel) {
    this.message.showLoading()
    antenna.id = this.validateId(antenna.id)
    this.parkingService.getQR(antenna.id).subscribe((data) => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(data)
      a.download = `${antenna.antena} - ${antenna.name}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      this.message.hideLoading()
    }, (err) => {
      this.message.error('', 'No pudo descargarse el QR. Por favor verifique si los datos existen.')
    })
  }

  ifHaveAction(action: string) {
    return !!this.actions.find((x) => x == action)
  }

  async searchAntennasByParking() {
    if (this.authService.isSudo && !this.idEditAntenna) {
      const parkingId = this.stepFiveForm.controls['parking'].value
      this.antennas = await this.parkingService.searchAntennasByParking(parkingId)
      if (this.antennas) {
        this.parkingId = parkingId
        this.rerender()
      }
    }
  }

  getInitialData() {
    this.message.showLoading()
    return this.parkingService
      .getAntennas(this.parkingId)
      .toPromise()
      .then((data: ResponseModel) => {
        if (data.success) {
          this.antennas = data.data.stations
          this.rerender()
        } else {
          this.message.error('', data.message)
        }

        this.message.hideLoading()
        return data
      })
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next()
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(({parkingId}) => {
      if (!this.isCreatingParking) {
        this.parkingId = parkingId
        this.stepFiveForm.get('parking')?.setValue(parkingId)
      }
      this.getInitialData().then()

    })
  }

  private getStepFive(): CreateParkingStepFiveModel {
    return {
      parking: this.stepFiveForm.controls['parking'].value || this.parkingId,
      name: this.stepFiveForm.controls['name_access'].value,
      type: this.stepFiveForm.controls['type_access'].value,
      antena: this.stepFiveForm.controls['antenna_access'].value,
      mac: this.stepFiveForm.controls['mac_access'].value,
      isPrivate: this.stepFiveForm.controls['isPrivate'].value
    }
  }

  private createForm() {
    return this.formBuilder.group({
      parking: [this.parkingId],
      type_access: [0, Validators.required],
      name_access: [''],
      mac_access: ['', Validators.required],
      antenna_access: [''],
      isPrivate: [false]
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
