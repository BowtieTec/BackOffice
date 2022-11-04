import {Injectable} from '@angular/core'
import {environment} from '../../../../../../environments/environment'
import {MessageService} from '../../../../../shared/services/message.service'
import {HttpClient} from '@angular/common/http'
import {ResponseModel} from '../../../../../shared/model/Request.model'
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class IssueLogService {
  apiUrl = environment.serverAPI

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {
  }

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
              level: item.log_code.level ?? '',
              message: item.log_code.message ?? '',
              aux_msg: item.message ?? '',
              station_name: item.station?.name ?? '',
              parking_name: item.station?.parking?.name ?? '',
              name: item.user.name ?? '' + item.user.last_name ?? '',
              userDevice: item.user_device.model ?? '',
              context: item.context ?? '',
              version: item.version ?? '',
              created_at:
                new Date(item.created_at).toLocaleDateString('es-GT') +
                ' ' +
                new Date(item.created_at).toLocaleTimeString('es-GT') ?? '',
              phone_number: item.user.phone_number ?? ''
            }
          })
        })
      )
  }
}
