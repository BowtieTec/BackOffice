import {Component} from '@angular/core'
import {FormGroup, UntypedFormBuilder, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {AuthModel} from 'src/app/shared/model/UserResponse.model'
import {AuthService} from 'src/app/shared/services/auth.service'
import {MessageService} from 'src/app/shared/services/message.service'
import {PermissionsService} from 'src/app/shared/services/permissions.service'
import {UtilitiesService} from 'src/app/shared/services/utilities.service'
import {supportTicketModel} from './Models/support-ticket.module'
import {SupportTicketService} from './Services/support-ticket.service'

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrls: ['./new-ticket.component.css']
})
export class NewTicketComponent {
  supportTicketForm: FormGroup
  date: Date = new Date()
  authData: AuthModel = this.authService.getUser()

  constructor(
    private permissionService: PermissionsService,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private utilitiesService: UtilitiesService,
    private supportTicketService: SupportTicketService,
    private router: Router
  ) {
    this.supportTicketForm = this.createsupportTicketForm()
  }

  get formSupportTicketValues(): supportTicketModel {
    return {
      email: this.authData.user.email, //this.supportTicketForm.get('email')?.value,
      subject: this.supportTicketForm.get('subject')?.value,
      description: this.supportTicketForm.get('description')?.value,
      parkingName: this.authService.getParking().name
        ? this.authService.getParking().name
        : 'No encontrado'
    }
  }

  async sendSupportTicket() {
    if (this.supportTicketForm.invalid) {
      this.messageService.error('', 'Datos no válidos o faltantes')
      return
    }
    const newTicket = this.formSupportTicketValues

    const response = await this.supportTicketService
      .sendSupportTicket(newTicket)
      .toPromise()

    if (response) {
      this.messageService.infoTimeOut(
        'Se ha enviado su petición, pronto recibirá una notificación en su correo'
      )
      this.reloadComponent()
    } else {
      this.messageService.error('', 'No se pudo enviar la solicitud')
    }
  }

  reloadComponent() {
    let currentUrl = this.router.url
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.onSameUrlNavigation = 'reload'
    this.router.navigate([currentUrl])
  }

  private createsupportTicketForm() {
    return this.formBuilder.group({
      description: ['', [Validators.required]],
      subject: ['', [Validators.required]]
    })
  }
}
