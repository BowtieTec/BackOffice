import { Injectable } from '@angular/core'
import { environment } from '../../../../../../environments/environment'
import { MessageService } from '../../../../../shared/services/message.service'
import { HttpClient } from '@angular/common/http'
import { ResponseModel } from '../../../../../shared/model/Request.model'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class IssueLogService {
  apiUrl = environment.serverAPI

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  getAllAppLogs(initDate: string, endDate: string, telephone: string) {
    this.messageService.showLoading()
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/log/getAllAppLogs/dates?initDate=${initDate}&endDate=${endDate}&telephone=${telephone}`
      )
      .pipe(
        map((res) => {
          return res.data.map((item: any) => {
            return {
              level: item.level ?? '',
              message: item.message ?? '',
              name: item.full_name ?? '',
              userDevice: item.model ?? '',
              context: item.l_context ?? '',
              created_at:
                new Date(item.l_created_at).toLocaleDateString('es-GT') +
                  ' ' +
                  new Date(item.l_created_at).toLocaleTimeString('es-GT') ?? '',
              phone_number: item.phone_number ?? ''
            }
          })
        })
      )
  }
}
