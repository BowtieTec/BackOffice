import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {ParkingService} from '../../services/parking.service'
import {ParkedModel, ParkingModel, StatusParked} from '../../models/Parking.model'
import {AuthService} from '../../../../shared/services/auth.service'
import {DataTableDirective} from 'angular-datatables'
import {DataTableOptions} from '../../../../shared/model/DataTableOptions'
import {Subject} from 'rxjs'
import {MessageService} from '../../../../shared/services/message.service'
import {environment} from '../../../../../environments/environment'
import {PermissionsService} from '../../../../shared/services/permissions.service'
import {getCurrentDataTablePage, UtilitiesService} from "../../../../shared/services/utilities.service";
import {ADTSettings} from "angular-datatables/src/models/settings";

@Component({
  selector: 'app-parked',
  templateUrl: './parked.component.html',
  styleUrls: ['./parked.component.css']
})
export class ParkedComponent implements OnDestroy, AfterViewInit, OnInit {
  parkedForm: FormGroup = this.createForm()
  parkedData: Array<ParkedModel> = []
  statusParked = StatusParked
  dateOutToGetOut: Date = new Date()
  allParking: Array<ParkingModel> = []
  parked$ = new Subject<ParkedModel>()
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective
  dtTrigger: Subject<any> = new Subject()
  formGroup: FormGroup = this.formBuilder.group({filter: ['']})

  getOutWithPayment = environment.getOutWithPaymentDoneParkedParking
  getOutWithoutPayment = environment.getOutWithoutPaymentDoneParkedParking
  assignCourtesyPermission = environment.assignCourtesyPermission
  private actions: string[] = this.permissionService.actionsOfPermissions

  constructor(
    private formBuilder: FormBuilder,
    private parkingService: ParkingService,
    private authService: AuthService,
    private message: MessageService,
    private permissionService: PermissionsService,
    private utility: UtilitiesService
  ) {
  }

  get isSudo() {
    return this.authService.isSudo
  }

  get dtOptions(): ADTSettings {
    return {
      ...DataTableOptions.getSpanishOptions(10),
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback: any) => {
        const page = getCurrentDataTablePage(dataTablesParameters)
        this.parkingService
          .getParked(
            {
              ...this.getParkedFormValues(),
              textToSearch: dataTablesParameters.search.value
            }
            , page, dataTablesParameters.length)
          .then((data) => {
            this.parkedData = data.data
            return callback({
              recordsTotal: data.recordsTotal,
              recordsFiltered: data.recordsFiltered,
              data: []
            })
          }).then(() => this.message.hideLoading())
      }
    }
  }

  async getInitialData() {
    setInterval(() => this.rerender(), 600000)
    if (this.isSudo) {
      await this.parkedForm
        .get('parkingId')
        ?.setValue(this.authService.getParking().id)
    }
  }

  async refreshParkedData() {
    this.rerender()
  }

  getTimeInParking(entry: ParkedModel) {
    const entry_date: Date = new Date(entry.entry_date)
    const exit_date: Date = entry.exit_date
      ? new Date(entry.exit_date)
      : new Date()
    return this.utility.descriptionOfDiffOfTime(entry_date, exit_date)
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      parkingId: ['0'],
      status: [1],
      textToSearch: [''],
      dateOutToGetOut: [null, [Validators.required]]
    })
  }

  getParkedFormValues() {
    const status =
      this.parkedForm.get('status')?.value != ''
        ? this.parkedForm.get('status')?.value
        : '1'
    const parkingId =
      this.isSudo && this.parkedForm.get('parkingId')?.value != '0'
        ? this.parkedForm.get('parkingId')?.value
        : this.authService.getParking().id
    const textToSearch = this.parkedForm.get('textToSearch')?.value
    return {
      status,
      parkingId,
      textToSearch
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next()
  }

  ngOnDestroy(): void {
    if (!this.dtTrigger.closed) this.dtTrigger.unsubscribe()
  }

  ifHaveAction(action: string) {
    return !!this.actions.find((x) => x == action)
  }

  async getStatusToSave(parked_type: number): Promise<any> {
    let payment_method = 3
    if (parked_type == 0) {
      if (
        this.ifHaveAction(this.getOutWithoutPayment) &&
        this.ifHaveAction(this.getOutWithPayment)
      ) {
        const statusWillUpdate =
          await this.message.areYouSureWithCancelAndInput(
            '¿Dejar salir a usuario con el cobro pendiente o cancelado?',
            'Salir y cobrar a la tarjeta',
            'Salir sin cobrar',
            this.dateOutToGetOut
          )
        if (statusWillUpdate.isDismissed) return -1

        if (statusWillUpdate.isFree) payment_method = 3
        if (statusWillUpdate.isWithPayment) payment_method = 1
        if (statusWillUpdate.isCash) payment_method = 2

        return {
          payment_method,
          dateToGetOut: statusWillUpdate.dateToGetOut
        }
        /*
         *  get_out_and_pay = 1,
         *   payment_cash = 2,
         *  get_out = 3
         * */
      }
    }
    return payment_method
  }

  isValidDate(d: any) {
    // @ts-ignore
    return d instanceof Date && !isNaN(d)
  }

  async getOut(parked: ParkedModel) {
    const statusData = await this.getStatusToSave(parked.type)
    const payment_method = statusData.payment_method
    this.dateOutToGetOut = new Date(statusData.dateToGetOut)

    if (statusData == -1) return
    if (
      !this.dateOutToGetOut ||
      (!this.isValidDate(this.dateOutToGetOut) && parked.type == 0)
    ) {
      this.message.error('Debe seleccionar una fecha de salida valida')
      return
    }
    if (parked.type == 1) {
      this.dateOutToGetOut = new Date()
    }
    if (this.dateOutToGetOut <= new Date(parked.entry_date)) {
      this.message.error(
        'La fecha y hora de salida debe ser mayor a la de entrada.'
      )
      return
    }
    if (payment_method == -1) {
      return
    }
    const result = await this.message.areYouSure(
      `¿Está seguro que desea sacar al usuario ${parked.user_name} ${
        parked.last_name
      } del parqueo ${
        parked.parking
      } con fecha y hora de salida ${this.dateOutToGetOut.toLocaleString()}?`
    )
    if (result.isDenied) {
      this.message.infoTimeOut(
        '!No te preocupes!, no se hicieron cambios.'
      )
      return
    }

    if (result.isConfirmed) {
      this.message.showLoading()
      this.parkingService
        .getOutParked(parked.id, payment_method, this.dateOutToGetOut)
        .then((data) => {
          if (data.success) {
            this.refreshParkedData()
            this.message.OkTimeOut(data.message)
            this.dateOutToGetOut = new Date()
          } else {
            this.message.error('', data.message)
          }
        })
    }
  }

  rerender() {
    if (this.dtElement != undefined) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy()
        this.dtTrigger.next()
      })
    }
  }

  changeParkedSelected(parked: ParkedModel) {
    this.parked$.next(parked)
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(({parkingId}) => {
      this.parkedForm.get('parkingId')?.setValue(parkingId)
      this.getInitialData().then()
    })

    this.parkingService.parkingLot$.subscribe((parkingLot) => {
      this.allParking = parkingLot
    })
  }
}
