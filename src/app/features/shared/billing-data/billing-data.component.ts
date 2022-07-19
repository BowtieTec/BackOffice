import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms'
import {MessageService} from '../../../shared/services/message.service'
import {ParkingService} from '../../parking/services/parking.service'
import {UtilitiesService} from '../../../shared/services/utilities.service'
import {SettingsOptionsModel} from '../../parking/models/SettingsOption.model'
import {CreateParkingStepFourModel} from '../../parking/models/CreateParking.model'
import {Router} from '@angular/router'
import {ParkingModel} from '../../parking/models/Parking.model'
import {AuthService} from '../../../shared/services/auth.service'

@Component({
  selector: 'app-billing-data',
  templateUrl: './billing-data.component.html',
  styleUrls: ['./billing-data.component.css']
})
export class BillingDataComponent implements OnInit {
  stepFourForm: UntypedFormGroup = this.createForm()
  settingsOptions!: SettingsOptionsModel
  allParking: ParkingModel[] = []

  @Input() parkingId!: string
  @Input() showNavigationButtons = true
  @Input() isCreatingParking = false
  @Input() isPublic = false
  @Output() changeStep = new EventEmitter<number>()

  constructor(
    private message: MessageService,
    private parkingService: ParkingService,
    private formBuilder: UntypedFormBuilder,
    private utilitiesService: UtilitiesService,
    private route: Router,
    private authService: AuthService
  ) {
  }

  get isSudo() {
    return this.authService.isSudo
  }

  async setPaymentData(parkingId: string) {
    const paymentInfo = await this.parkingService.getParkingInfo(parkingId).toPromise();
    this.stepFourForm.get('business_address')?.setValue(paymentInfo.business_address)
    this.stepFourForm.get('business_name')?.setValue(paymentInfo.business_name)
    this.stepFourForm.get('currency')?.setValue(paymentInfo.currency)
    this.stepFourForm.get('nit')?.setValue(paymentInfo.nit)
  }

  get isVisaSelected() {
    const selected = this.stepFourForm.get('pay_method')?.value
    return selected != 1 && selected
  }

  get isBacSelected() {
    const selected = this.stepFourForm.get('pay_method')?.value
    return selected != 0 && selected
  }

  addValidators() {
    if (this.stepFourForm.controls['is_our_visa_credential'].value) {
      this.stepFourForm.controls['merchant_id_visa'].setValidators(
        Validators.required
      )
      this.stepFourForm.controls['merchant_pass_visa'].setValidators(
        Validators.required
      )
      this.stepFourForm.controls['afiliacion'].setValidators(
        Validators.required
      )
      this.stepFourForm.controls['terminal'].setValidators(Validators.required)
    } else {
      this.stepFourForm.controls['merchant_id_visa'].clearValidators()
      this.stepFourForm.controls['merchant_pass_visa'].clearValidators()
      this.stepFourForm.controls['afiliacion'].clearValidators()
      this.stepFourForm.controls['terminal'].clearValidators()
      this.stepFourForm.controls['merchant_id_visa'].setErrors(null)
      this.stepFourForm.controls['merchant_pass_visa'].setErrors(null)
      this.stepFourForm.controls['afiliacion'].setErrors(null)
      this.stepFourForm.controls['terminal'].setErrors(null)
    }
  }

  controlInvalid(control: string): boolean {
    return this.utilitiesService.controlInvalid(this.stepFourForm, control)
  }

  async emmitStep(number: number) {
    this.stepFourForm.updateValueAndValidity()
    this.message.showLoading()
    if (number == 1) {
      await this.saveBillingData()
      if (this.showNavigationButtons && !this.isPublic) {
        this.changeStep.emit(number)
      } else {
        this.endToken()
        this.route.navigate(['/']).catch()
      }

    } else {
      this.message.hideLoading()
      this.changeStep.emit(number)
    }
  }

  parkingIdSelected() {
    this.message.showLoading()
    this.parkingId = this.stepFourForm.get('parkingId')?.value ? this.stepFourForm.get('parkingId')?.value : this.parkingId
    if (this.parkingId) {
      this.setPaymentData(this.parkingId).catch()
    }
    this.message.hideLoading()
  }

  private async endToken() {
    return this.parkingService.endTempToken().toPromise().then()
  }

  createForm() {
    return this.formBuilder.group({
      parkingId: [this.parkingId],
      nit: [null, [Validators.required]],
      business_address: [null, Validators.required],
      business_name: [null, Validators.required],
      pay_method: ['0'],
      currency: [null, Validators.required],
      is_our_visa_credential: false,
      is_our_bac_credential: false,
      //Visa Credential
      merchant_id_visa: [''],
      merchant_pass_visa: [''],
      afiliacion: [''],
      terminal: [''],
      //  BAC Credential
      merchant_id_bac: [null],
      acquirer_id_bac: [null],
      purchase_currency_bac: [null],
      pmtnpssw_bac: [null],
      url_bac: [null]
    })
  }

  async saveBillingData() {
    if (this.stepFourForm.valid) {
      this.parkingService.parkingStepFour = this.getStepFour()
      this.parkingService.parkingStepFour.parkingId = this.parkingId
      this.parkingService.setStepFour().subscribe((data) => {
        if (data.success) {
          this.message.Ok('Parqueo guardado.')
        } else {
          this.utilitiesService.markAsTouched(this.stepFourForm)
          this.message.error('', data.message)
        }
      })
    } else {
      this.message.errorTimeOut(
        '',
        'Datos faltantes o incorrectos. Validar que los datos sean correctos.'
      )
      this.utilitiesService.markAsTouched(this.stepFourForm)
    }
  }

  ngOnInit(): void {
    this.settingsOptions = this.parkingService.settingsOptions
    if (!this.isCreatingParking) {
      this.stepFourForm.get('parkingId')?.setValue(this.parkingId)
      this.getParkingLot().then()
      this.parkingIdSelected()
    }
  }

  getParkingLot() {
    return this.parkingService.getAllParking().then(x => {
      if (x.success) {
        this.allParking = x.data.parkings
      } else {
        this.message.error(x.message)
        return
      }
    })
  }

  private getStepFour(): CreateParkingStepFourModel {
    return {
      parkingId: this.authService.getParking().id,
      business_address: this.stepFourForm.controls['business_address'].value,
      business_name: this.stepFourForm.controls['business_name'].value,
      currency: this.stepFourForm.controls['currency'].value,
      is_our_bac_credential:
      this.stepFourForm.controls['is_our_bac_credential'].value,
      is_our_visa_credential:
      this.stepFourForm.controls['is_our_visa_credential'].value,
      nit: this.stepFourForm.controls['nit'].value,
      pay_method: this.stepFourForm.controls['pay_method'].value,
      visa_credential: {
        cardAcqId: this.stepFourForm.controls['afiliacion'].value,
        terminal: this.stepFourForm.controls['terminal'].value,
        merchant_user: this.stepFourForm.controls['merchant_id_visa'].value,
        merchant_password:
        this.stepFourForm.controls['merchant_pass_visa'].value
      },
      bac_credential: {
        url: this.stepFourForm.controls['url_bac'].value,
        merchant_id: this.stepFourForm.controls['merchant_id_bac'].value,
        acquirer_id: this.stepFourForm.controls['acquirer_id_bac'].value,
        pmtnpssw: this.stepFourForm.controls['pmtnpssw_bac'].value,
        purchase_currency:
        this.stepFourForm.controls['purchase_currency_bac'].value
      }
    }
  }
}
