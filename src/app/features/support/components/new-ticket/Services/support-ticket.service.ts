import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {map} from 'rxjs/operators'
import {ResponseModel} from 'src/app/shared/model/Request.model'
import {MessageService} from 'src/app/shared/services/message.service'
import {environment} from 'src/environments/environment'
import {supportTicketModel} from '../Models/support-ticket.module'

@Injectable({
  providedIn: 'root'
})
export class SupportTicketService {
  apiUrl = environment.serverAPI

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {
  }

  sendSupportTicket(supportTicketModel: supportTicketModel) {
    this.messageService.showLoading()
    return this.http
      .post<ResponseModel>(
        `${this.apiUrl}backoffice/support/sendTicket`,
        supportTicketModel
      )
      .pipe(
        map((x: ResponseModel) => {
          if (x.success) {
            this.messageService.hideLoading()
            return x.success
          } else {
            this.messageService.error('', x.message)
            return []
          }
        })
      )
  }
}
