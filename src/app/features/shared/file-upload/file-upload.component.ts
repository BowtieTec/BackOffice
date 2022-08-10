import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { CreateParkingFileModel } from 'src/app/features/parking/models/CreateParking.model'
import { SettingsOptionsModel } from 'src/app/features/parking/models/SettingsOption.model'
import { ParkingService } from 'src/app/features/parking/services/parking.service'
import { MessageService } from 'src/app/shared/services/message.service'
import { UtilitiesService } from 'src/app/shared/services/utilities.service'
import { FileUploadService } from './services/fileUploadService'
import { ParkingModel } from '../../parking/models/Parking.model'
import { AuthService } from '../../../shared/services/auth.service'

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  filesPlans: string[] = []
  fileTariff!: File
  fileLogo!: File
  backGroundApp!: File
  allParking: ParkingModel[] = []
  stepFourForm: FormGroup = this.createForm()
  settingsOptions!: SettingsOptionsModel

  @Output() changeStep = new EventEmitter<number>()
  @Input() parkingId: string = this.parkingService.parkingStepOne.parkingId
  @Input() isCreatingParking: boolean = true

  constructor(
    private message: MessageService,
    private parkingService: ParkingService,
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private fileServices: FileUploadService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.settingsOptions = this.parkingService.settingsOptions
    this.stepFourForm.get('parkingId')?.setValue(this.parkingId)
    if (!this.isCreatingParking) {
      this.authService.user$.subscribe(({ parkingId }) => {
        this.parkingId = parkingId
        this.stepFourForm.get('parkingId')?.setValue(parkingId)
      })
      this.parkingService.parkingLot$.subscribe((parkingLot) => {
        this.allParking = parkingLot
      })
    }
  }

  controlInvalid(control: string): boolean {
    return this.utilitiesService.controlInvalid(this.stepFourForm, control)
  }

  searchFile(name: string) {
    return this.stepFourForm.get(name)?.value
  }

  async emmitStep(number: number) {
    this.parkingId = this.stepFourForm.get('parkingId')?.value
    this.message.showLoading()
    let promises = []
    if (number == 1) {
      if (this.filesPlans) {
        //Plans------------------------------------------
        const formData = new FormData()
        for (let i = 0; i < this.filesPlans.length; i++) {
          formData.append('plans', this.filesPlans[i])
        }
        promises.push(
          this.fileServices
            .UploadPlans(formData, this.parkingId)
            .toPromise()
            .catch((err: any) => this.message.errorTimeOut(err.message))
        )
      }
      if (this.fileTariff) {
        //Tariff-----------------------------------------
        const formDataTariff = new FormData()
        formDataTariff.append('rate', this.fileTariff)
        promises.push(
          this.fileServices
            .UploadTariff(formDataTariff, this.parkingId)
            .toPromise()
            .catch((err: any) => this.message.errorTimeOut(err.message))
        )
      }

      if (this.fileLogo) {
        //LOGO----------------------------------------
        const formDataLogo = new FormData()
        formDataLogo.append('logo', this.fileLogo)
        promises.push(
          this.fileServices
            .UploadLogo(formDataLogo, this.parkingId)
            .toPromise()
            .catch((err: any) => this.message.errorTimeOut(err.message))
        )
      }

      //BACKGROUND---------------------------------------
      if (this.backGroundApp) {
        const formDataBackground = new FormData()
        formDataBackground.append('backgroundApp', this.backGroundApp)
        promises.push(
          this.fileServices
            .UploadBackground(formDataBackground, this.parkingId)
            .toPromise()
            .catch((err: any) => this.message.errorTimeOut(err.message))
        )
      }
    }
    await Promise.all(promises).then((x) => {
      if (x.length <= 1) {
        //Siempre hay un promise porque se hace una promesa por cada archivo
        this.message.info('No se seleccionaron archivos')
      } else {
        this.message.OkTimeOut()
      }
      if (this.isCreatingParking) {
        this.changeStep.emit(number)
      }
    })
  }

  createForm() {
    return this.formBuilder.group({
      logo: [null, Validators.required],
      rate: [null, Validators.required],
      plans: [null, Validators.required],
      backGroundApp: [null, Validators.required],
      parkingId: [this.parkingId, Validators.required]
    })
  }

  getIsSudo(): boolean {
    return this.authService.isSudo
  }

  onFileChangePlans(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      if (
        this.validateFileBeImage(
          event.target.files[i],
          this.stepFourForm.get('plans') as FormControl
        )
      ) {
        this.filesPlans.push(event.target.files[i])
      } else {
        this.message.error('Hay archivos seleccionados que no son una imagen')
        this.filesPlans = []
      }
    }
  }

  validateFileBeImage(file: File, input: FormControl) {
    if (!file.type.includes('image')) {
      this.message.error(
        'El archivo no es una imagen. solo se permiten imágenes png, jpeg y jpg'
      )
      input.reset()
      return false
    }
    return true
  }

  onFileChangeLogo(event: any) {
    if (
      this.validateFileBeImage(
        event.target.files[0],
        this.stepFourForm.get('logo') as FormControl
      )
    ) {
      this.fileLogo = event.target.files[0]
      if (event.target.files.length > 0) {
        const src = URL.createObjectURL(event.target.files[0])
        let preview = document.getElementById('logoPreview') as HTMLImageElement
        preview.src = src
        preview.style.display = 'block'
      }
    }
  }

  onFileChangeTarif(event: any) {
    if (
      this.validateFileBeImage(
        event.target.files[0],
        this.stepFourForm.get('rate') as FormControl
      )
    ) {
      this.fileTariff = event.target.files[0]
      if (event.target.files.length > 0) {
        const src = URL.createObjectURL(event.target.files[0])
        let preview = document.getElementById(
          'tariffPreview'
        ) as HTMLImageElement
        preview.src = src
      }
    }
  }

  onFileChangeBackground(event: any) {
    if (
      this.validateFileBeImage(
        event.target.files[0],
        this.stepFourForm.get('backGroundApp') as FormControl
      )
    ) {
      this.backGroundApp = event.target.files[0]
      if (event.target.files.length > 0) {
        const src = URL.createObjectURL(event.target.files[0])
        let preview = document.getElementById(
          'backGroundAppPreview'
        ) as HTMLImageElement
        preview.src = src
      } else {
        this.stepFourForm.get('logo')?.setValue(null)
      }
    }
  }

  private getFile(): CreateParkingFileModel {
    return {
      parkingId: '',
      logo: this.stepFourForm.controls['logo'].value,
      rate: this.stepFourForm.controls['rate'].value,
      plans: this.stepFourForm.controls['plans'].value
    }
  }
}
