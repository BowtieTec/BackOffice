import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ParkingService } from '../../services/parking.service'
import {
  ParkedModel,
  ParkingModel,
  StatusParked
} from '../../models/Parking.model'
import { AuthService } from '../../../../shared/services/auth.service'
import { DataTableDirective } from 'angular-datatables'
import { DataTableOptions } from '../../../../shared/model/DataTableOptions'
import { Subject } from 'rxjs'
import { MessageService } from '../../../../shared/services/message.service'
import { environment } from '../../../../../environments/environment'
import { PermissionsService } from '../../../../shared/services/permissions.service'
import { ReportService } from '../../../report/components/service/report.service'

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
  formGroup: FormGroup = this.formBuilder.group({ filter: [''] })

  getOutWithPayment = environment.getOutWithPaymentDoneParkedParking
  getOutWithoutPayment = environment.getOutWithoutPaymentDoneParkedParking
  assignCourtesyPermission = environment.assignCourtesyPermission
  private actions: string[] = this.permissionService.actionsOfPermissions

  constructor(
    private formBuilder: FormBuilder,
    private parkingService: ParkingService,
    private authService: AuthService,
    private messageService: MessageService,
    private permissionService: PermissionsService,
    private reportService: ReportService
  ) {}

  get isSudo() {
    return this.authService.isSudo
  }

  get dtOptions() {
    return DataTableOptions.getSpanishOptions(10)

  }

  async getInitialData() {
    if (this.isSudo) {
      await this.parkedForm
        .get('parkingId')
        ?.setValue(this.authService.getParking().id)
    }
    await this.getParkedData().then(() => this.rerender())
    setInterval(() => {
      if (!this.dtTrigger.closed) this.refreshParkedData()
    }, 30000)
  }

  async refreshParkedData() {
    return this.getParkedData().then(() => this.rerender())
  }

  getTimeInParking(entry: ParkedModel) {
    const entry_date: Date = new Date(entry.entry_date)
    const exit_date: Date = entry.exit_date
      ? new Date(entry.exit_date)
      : new Date()
    return this.reportService.descriptionOfDiffOfTime(entry_date, exit_date)
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      parkingId: ['0'],
      status: ['1'],
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
          await this.messageService.areYouSureWithCancelAndInput(
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
      this.messageService.error('Debe seleccionar una fecha de salida valida')
      return
    }
    if (parked.type == 1) {
      this.dateOutToGetOut = new Date()
    }
    if (this.dateOutToGetOut <= new Date(parked.entry_date)) {
      this.messageService.error(
        'La fecha y hora de salida debe ser mayor a la de entrada.'
      )
      return
    }
    if (payment_method == -1) {
      return
    }
    const result = await this.messageService.areYouSure(
      `¿Está seguro que desea sacar al usuario ${parked.user_name} ${
        parked.last_name
      } del parqueo ${
        parked.parking
      } con fecha y hora de salida ${this.dateOutToGetOut.toLocaleString()}?`
    )
    if (result.isDenied) {
      this.messageService.infoTimeOut(
        '!No te preocupes!, no se hicieron cambios.'
      )
      return
    }

    if (result.isConfirmed) {
      this.messageService.showLoading()
      this.parkingService
        .getOutParked(parked.id, payment_method, this.dateOutToGetOut)
        .then((data) => {
          if (data.success) {
            this.refreshParkedData()
            this.messageService.Ok(data.message)
            this.dateOutToGetOut = new Date()
          } else {
            this.messageService.error('', data.message)
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
    this.authService.user$.subscribe(({ parkingId }) => {
      this.parkedForm.get('parkingId')?.setValue(parkingId)
      this.getInitialData().then()
    })

    this.parkingService.parkingLot$.subscribe((parkingLot) => {
      this.allParking = parkingLot
    })
  }

  private async getParkedData() {
    return this.parkingService
      .getParked(this.getParkedFormValues())
      .toPromise()
      .then((data) => {
        this.parkedData = data.data
      })
  }
}
