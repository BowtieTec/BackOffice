import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {ResponseModel} from '../model/Request.model'
import {environment} from '../../../environments/environment'
import {AuthService} from './auth.service'
import {map} from 'rxjs/operators'
import {MessageService} from './message.service'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  actions: string[] = []
  private apiUrl = environment.serverAPI

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private messageService: MessageService
  ) {
  }

  get actionsOfDashboard() {
    return this.actions
  }

  //Entradas
  getDailyEntries(parkingId: string, fecha: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/daily-entries/${parkingId}/${fecha}`
      )
      .pipe(
        map((data) => {
          return data.data
        })
      )
  }

  getMonthlyEntries(parkingId: string, mes: string, anio: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/monthly-entries/${parkingId}/${anio}/${mes}`
      )
      .pipe(
        map((data) => {
          return data.data
        })
      )
  }

  getYearEntries(parkingId: string, anio: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/year-entries/${parkingId}/${anio}`
      )
      .pipe(
        map((data) => {
          return data.data
        })
      )
  }

  //Cortesías normales
  getDailyCourtesies(parkingId: string, fecha: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/daily-courtesy/${parkingId}/${fecha}`
      )
      .pipe(
        map((data) => {
          return data.data
        })
      )
  }

  getMonthlyCourtesies(parkingId: string, mes: string, anio: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/monthly-courtesy/${parkingId}/${anio}/${mes}`
      )
      .pipe(
        map((data) => {
          return data.data
        })
      )
  }

  getYearCourtesies(parkingId: string, anio: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/year-courtesy/${parkingId}/${anio}`
      )
      .pipe(
        map((data) => {
          return data.data
        })
      )
  }

  getTotalCourtesiesPerDate(
    parkingId: string,
    startDate: string,
    endDate: string
  ) {
    this.messageService.showLoading()
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/total-courtesies/${parkingId}/${startDate}/${endDate}`
      )
      .pipe(
        map((data) => {
          this.messageService.hideLoading()
          return data.data
        })
      )
  }

  getCompanyCourtesiesPerDate(
    parkingId: string,
    startDate: string,
    endDate: string
  ) {
    this.messageService.showLoading()
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/company-courtesies/${parkingId}/${startDate}/${endDate}`
      )
      .pipe(
        map((data) => {
          this.messageService.hideLoading()
          return data.data
        })
      )
  }

  getCompanyCourtesiesTypePerDate(
    parkingId: string,
    companyId: string,
    startDate: string,
    endDate: string
  ) {
    this.messageService.showLoading()
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/company-courtesies-type/${parkingId}/${companyId}/${startDate}/${endDate}`
      )
      .pipe(
        map((data) => {
          this.messageService.hideLoading()
          return data.data
        })
      )
  }

  getCompanyCourtesiesStatusPerDate(
    parkingId: string,
    companyId: string,
    startDate: string,
    endDate: string
  ) {
    this.messageService.showLoading()
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/company-courtesies-status/${parkingId}/${companyId}/${startDate}/${endDate}`
      )
      .pipe(
        map((data) => {
          this.messageService.hideLoading()
          return data.data
        })
      )
  }

  getCompanyCourtesiesTypeValuePerDate(
    parkingId: string,
    companyId: string,
    startDate: string,
    endDate: string
  ) {
    this.messageService.showLoading()
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/company-courtesies-type-value/${parkingId}/${companyId}/${startDate}/${endDate}`
      )
      .pipe(
        map((data) => {
          this.messageService.hideLoading()
          return data.data
        })
      )
  }

  //Cortesías estacionarias
  getDailyCourtesiesStation(parkingId: string, fecha: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/daily-courtesy-station/${parkingId}/${fecha}`
      )
      .pipe(
        map((data) => {
          return data.data
        })
      )
  }

  getMonthlyCourtesiesStation(parkingId: string, mes: string, anio: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/monthly-courtesy-station/${parkingId}/${anio}/${mes}`
      )
      .pipe(
        map((data) => {
          return data.data
        })
      )
  }

  getYearCourtesiesStation(parkingId: string, anio: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/year-courtesy-station/${parkingId}/${anio}`
      )
      .pipe(
        map((data) => {
          return data.data
        })
      )
  }

  getTotalCourtesiesStationPerDate(
    parkingId: string,
    startDate: string,
    endDate: string
  ) {
    this.messageService.showLoading()
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/total-courtesies-station/${parkingId}/${startDate}/${endDate}`
      )
      .pipe(
        map((data) => {
          this.messageService.hideLoading()
          return data.data
        })
      )
  }

  getCompanyCourtesiesStationPerDate(
    parkingId: string,
    startDate: string,
    endDate: string
  ) {
    this.messageService.showLoading()
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/company-courtesies-station/${parkingId}/${startDate}/${endDate}`
      )
      .pipe(
        map((data) => {
          this.messageService.hideLoading()
          return data.data
        })
      )
  }

  getCompanyCourtesiesStationTypePerDate(
    parkingId: string,
    companyId: string,
    startDate: string,
    endDate: string
  ) {
    this.messageService.showLoading()
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/company-courtesies-station-type/${parkingId}/${companyId}/${startDate}/${endDate}`
      )
      .pipe(
        map((data) => {
          this.messageService.hideLoading()
          return data.data
        })
      )
  }

  getCompanyCourtesiesStationStatusPerDate(
    parkingId: string,
    companyId: string,
    startDate: string,
    endDate: string
  ) {
    this.messageService.showLoading()
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/company-courtesies-station-status/${parkingId}/${companyId}/${startDate}/${endDate}`
      )
      .pipe(
        map((data) => {
          this.messageService.hideLoading()
          return data.data
        })
      )
  }

  getCompanyCourtesiesStationTypeValuePerDate(
    parkingId: string,
    companyId: string,
    startDate: string,
    endDate: string
  ) {
    this.messageService.showLoading()
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/company-courtesies-station-type-value/${parkingId}/${companyId}/${startDate}/${endDate}`
      )
      .pipe(
        map((data) => {
          this.messageService.hideLoading()
          return data.data
        })
      )
  }

  //Flujo
  getDailyPayments(parkingId: string, fecha: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/daily-payment/${parkingId}/${fecha}`
      )
      .pipe(
        map((data) => {
          return data.data
        })
      )
  }

  getMonthlyPayments(parkingId: string, mes: string, anio: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/monthly-payment/${parkingId}/${anio}/${mes}`
      )
      .pipe(
        map((data) => {
          return data.data
        })
      )
  }

  getYearPayments(parkingId: string, anio: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/dashboard/year-payment/${parkingId}/${anio}`
      )
      .pipe(
        map((data) => {
          return data.data
        })
      )
  }
}
