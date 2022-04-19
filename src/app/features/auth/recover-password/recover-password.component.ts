import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from '../../../shared/services/message.service'
import { RecoveryPasswordService } from '../services/recovery-password.service'
import { ConfirmCodeModel } from '../models/RecoveryPassword.model'
import { Router } from '@angular/router'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {
  recoveryPasswordForm: FormGroup
  step = 1
  userId = ''
  email = ''

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private recoveryService: RecoveryPasswordService,
    private route: Router
  ) {
    this.recoveryPasswordForm = this.createForm()
  }

  get emailControl() {
    return this.recoveryPasswordForm.get('email')
  }

  get newPasswordControl() {
    return this.recoveryPasswordForm.get('newPassword')
  }

  get newPasswordConfControl() {
    return this.recoveryPasswordForm.get('newPasswordConfirmation')
  }

  get confirmCodeControl() {
    return this.recoveryPasswordForm.get('validate_code')
  }

  get passwordsValues() {
    return {
      newPassword: this.newPasswordControl?.value,
      newPasswordConfirmation: this.newPasswordConfControl?.value,
      userId: this.userId
    }
  }

  sendConfirmation(email: string) {
      this.email = email
      return this.recoveryService
        .sendConfirmCode(email)
        .toPromise()
        .then((data) => {
          if (data.success) {
            this.messageService.Ok('Código Enviado')
          } else {
            this.messageService.error('', data.message)
          }
          return data.success
        }).catch(err => {
          this.messageService.error('', err.error.message)
        return false
        })

  }

  confirmCode() {
    const confirmCodeModel: ConfirmCodeModel = {
      validate_code: this.confirmCodeControl?.value.trim(),
      email_phone: this.emailControl?.value.trim(),
      type: 1
    }
    return this.recoveryService
      .confirmCode(confirmCodeModel)
      .toPromise()
      .then((data) => {
        if (data.success) {
          this.messageService.OkTimeOut('Código correcto')
          this.userId = data.data
        } else {
          this.messageService.error('', data.message)
        }
        return data.success
      })
  }

  get passwordPattern() {
    return environment.settings.passwordPattern
  }

  validations() {
    if (!this.emailControl?.valid && this.step == 1) {
      this.messageService.errorTimeOut('', 'Correo no valido')
      return false
    }
    if (
      !this.recoveryPasswordForm.get('validate_code')?.valid &&
      this.step == 2
    ) {
      this.messageService.errorTimeOut(
        '',
        'El código de confirmación es necesario'
      )
      return false
    }
    return true
  }

  async changeStep(currentStep: number) {
    this.messageService.showLoading()
    let isEmailSend = false
    let isCodeRight = false
    if (!this.validations()) {
      return
    }

    if (currentStep == 1) {
      isEmailSend = await this.sendConfirmation(this.emailControl?.value.trim())
      if (isEmailSend) {
        this.step++
      } else {
        return
      }
    }
    if (currentStep == 2) {
      isCodeRight = await this.confirmCode()
      if (isCodeRight) {
        this.step++
      } else {
        return
      }
    }
    this.messageService.hideLoading()
  }

  recoveryPassword() {
    this.messageService.showLoading()
    if (this.newPasswordControl?.value != this.newPasswordConfControl?.value) {
      this.messageService.error('', 'Las contraseñas no coinciden')
      return
    }
    if (
      !this.newPasswordControl?.valid &&
      !this.newPasswordConfControl?.valid
    ) {
      this.messageService.error(
        '',
        'La nueva contraseña debe contener al menos un número, una letra mayúscula y un símbolo: @$!%*#?&'
      )
      return
    }
    this.recoveryService
      .recoveryPassword(this.passwordsValues)
      .toPromise()
      .then((data) => {
        if (data.success) {
          this.messageService.OkTimeOut('Contraseña cambiada correctamente')
          this.route.navigate(['/'])
        } else {
          this.messageService.error('', data.message)
        }
      }).catch((x) => {
      console.log('asdfasdfsdf')
      console.log(x.message)
    })
  }

  controlInvalid(control: string) {
    return (
      this.recoveryPasswordForm.get(control)?.invalid &&
      this.recoveryPasswordForm.get(control)?.touched
    )
  }

  createForm() {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      validate_code: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
          /*Validators.pattern(
            '^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\\d]){1,})(?=(.*[\\W]){1,})(?!.*\\s).{8,}$'
          ),*/
        ]
      ],
      newPasswordConfirmation: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
          /* Validators.pattern(
             '^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\\d]){1,})(?=(.*[\\W]){1,})(?!.*\\s).{8,}$'
           ),*/
        ]
      ]
    })
  }
}
