import {Injectable} from '@angular/core'
import {MessageService} from '../../../../../shared/services/message.service'
import {HttpClient} from '@angular/common/http'
import {CompaniesModel} from '../models/companies.model'
import {ResponseModel} from '../../../../../shared/model/Request.model'
import {environment} from '../../../../../../environments/environment'
import {map} from 'rxjs/operators'
import {NEVER, Observable} from 'rxjs'
import {PermissionsService} from "../../../../../shared/services/permissions.service";

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  apiUrl = environment.serverAPI
  companies: CompaniesModel[] = []

  constructor(
    private message: MessageService,
    private http: HttpClient,
    private permissions: PermissionsService
  ) {
  }

  get states() {
    return [
      {
        id: 0,
        name: 'Habilitado'
      },
      {
        id: 1,
        name: 'Inhabilitado'
      }
    ]
  }

  getCompanies(parkingId: string): Observable<Array<CompaniesModel>> {
    if (!this.permissions.ifHaveAction('listLocal')) {
      return NEVER
    }
    this.message.showLoading()
    return this.http
      .get<ResponseModel>(`${this.apiUrl}backoffice/company/${parkingId}`)
      .pipe(
        map((x: ResponseModel) => {
          if (x.success) {
            this.message.hideLoading()
            return x.data
          } else {
            this.message.error('', x.message)
            return []
          }
        })
      )
  }

  createCompany(company: CompaniesModel, callback: () => void) {
    this.message.showLoading()
    return this.http
      .post<ResponseModel>(`${this.apiUrl}backoffice/company`, company)
      .pipe(
        map((x) => {
          if (x.success) {
            callback()
            this.message.OkTimeOut()
          } else {
            this.message.error(x.message)
          }
        })
      )
  }

  editCompany(company: CompaniesModel, callback: () => void) {
    this.message.showLoading()
    return this.http
      .put<ResponseModel>(`${this.apiUrl}backoffice/company`, company)
      .pipe(
        map((x) => {
          if (x.success) {
            callback()
            this.message.OkTimeOut()
          } else {
            this.message.error(x.message)
          }
        })
      )
  }

  deleteCompany(id: string, callback: () => void) {
    this.message.showLoading()
    return this.http
      .delete<ResponseModel>(`${this.apiUrl}backoffice/company/${id}`)
      .pipe(
        map((x) => {
          if (x.success) {
            callback()
            this.message.OkTimeOut()
          } else {
            this.message.error(x.message)
          }
        })
      )
  }
}
