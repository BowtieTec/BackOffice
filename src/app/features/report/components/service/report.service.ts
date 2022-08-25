import { Injectable } from '@angular/core'
import { environment } from '../../../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { ResponseModel } from 'src/app/shared/model/Request.model'
import { payFilter } from '../model/paymentModel'
import { map } from 'rxjs/operators'
//import * as jsPDF from 'jspdf';

const EXCEL_TYPE =
  'application/vnd.openxlmformats-officedocument.spreedsheetml.sheet; charset = UTF-8'
const EXCEL_EXT = '.xlsx'

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  payDate: payFilter[] = new Array<payFilter>()
  private apiUrl = environment.serverAPI

  constructor(private http: HttpClient) {}

  getPaymentsRpt(
    initDate: string,
    endDate: string,
    parqueo: string,
    telephone: string = ''
  ) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/report/getPagos/dates?initDate=${initDate}&endDate=${endDate}&parqueo=${parqueo}&telephone=${telephone}`
      )
      .pipe(
        map((res) => {
          return res.data.map((item: any) => {
            return {
              phone_key: item.user.phone_number,
              paymentStatus: item.status == 2 ? 'Pendiente de Pago' : 'Exitoso',
              subtotal: item.subtotal,
              discount: item.discount,
              total: item.total,
              entry_date: item.entry_date,
              exit_date: item.exit_date,
              invoice:
                item.status == 2
                  ? 'Pendiente de Pago'
                  : item.payment[0]?.billing?.fiscal_number ??
                    (item.total > 0 ? 'No generada' : 'No requerida'),
              invoiceDate: item.payment[0]?.billing?.certification_time ?? '',
              paymentDate: item.payment[0]?.created_at ?? '',
              timeIn: this.descriptionOfDiffOfTime(
                new Date(item.entry_date),
                new Date(item.exit_date)
              ),
              transaction: item.payment[0]?.trace_number ?? '',
              courtesy: item.courtesy?.courtesy_details?.name ?? '',
              typePayment:
                item.payment_type == 0
                  ? 'Tarjeta C/D'
                  : item.payment_type == 1
                  ? 'Efectivo ó Pendiente de Pago'
                  : item.payment_type == 3
                  ? 'Salida gratuita'
                  : ''
            }
          })
        })
      )
  }

  getHistoryOfCourtesyRpt(initDate: string, endDate: string, parqueo: string) {
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/report/historyOfCourtesies/dates?initDate=${initDate}&endDate=${endDate}&parqueo=${parqueo}`
    )
  }

  getTicketsRpt(initDate: Date, endDate: Date, parqueo: string) {
    let _initDate = new Date(initDate).toISOString().split('T')[0]
    let _endDate = new Date(endDate).toISOString().split('T')[0]
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/report/ticketRpt/dates?initDate=${_initDate}&endDate=${_endDate}&parqueo=${parqueo}`
    )
  }

  getBillingRpt(
    initDate: string,
    endDate: string,
    parqueo: string,
    dateTypeSearch: number = 0
  ) {
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/report/getFacturas/dates?initDate=${initDate}&endDate=${endDate}&parqueo=${parqueo}&dateTypeSearch=${dateTypeSearch}`
    )
  }

  getTicketsDateRpt(initDate: string, parqueo: string) {
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/report/ticketDetailRpt/dates?initDate=${initDate}&parqueo=${parqueo}`
    )
  }

  getDurationRpt(initDate: string, endDate: string, parqueo: string) {
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/report/durationRpt/dates?initDate=${initDate}&endDate=${endDate}&parqueo=${parqueo}`
    )
  }

  getCourtesyRpt(parqueo: string) {
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/report/courtesiesDetail/info?parqueo=${parqueo}`
    )
  }

  getCourtesyStationRpt(initDate: string, endDate: string, parqueo: string) {
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/report/courtesiesStationDetail/dates?initDate=${initDate}&endDate=${endDate}&parqueo=${parqueo}`
    )
  }

  getTransitDetailRpt(initDate: Date, endDate: Date, parqueo: string) {
    const _initDate = new Date(initDate).toISOString().split('T')[0]
    const _endDate = new Date(endDate).toISOString().split('T')[0]
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/report/allTransitDetail/dates?dateInit=${_initDate}&dateEnd=${_endDate}&parqueo=${parqueo}`
      )
      .pipe(
        map((res) => {
          return res.data.map((item: any) => {
            return {
              phone_key: item.user?.phone_number ?? '',
              entry_date: item.entry_date
                ? new Date(item.entry_date).toLocaleString()
                : '',
              exit_date: item.exit_date
                ? new Date(item.exit_date).toLocaleString()
                : '',
              timeIn: this.descriptionOfDiffOfTime(
                new Date(item.entry_date),
                new Date(item.exit_date || new Date())
              ),
              subtotal: item.subtotal ?? '--',
              discount: item.discount ?? '',
              total: item.total ?? '--',
              courtesy: item.courtesy?.courtesy_details?.name ?? '',
              typePayment:
                item.payment_type == 0
                  ? 'Tarjeta C/D'
                  : item.payment_type == 1
                  ? 'Efectivo'
                  : item.payment_type == 3
                  ? 'Salida gratuita'
                  : '',
              transaction: item.payment[0]?.trace_number ?? '',
              invoice: item.payment[0]?.billing?.fiscal_number ?? '',
              entry_station: item.entry_station?.name ?? '',
              exit_station: item.exit_station?.name ?? '',
              type:
                item.type == 0
                  ? 'ebigo Ticket'
                  : item.type == 1
                  ? 'ebigo Mensual'
                  : item.type == 5
                  ? 'Test'
                  : '',
              status:
                item.status == 2
                  ? 'Puede salir'
                  : item.status == 1
                  ? 'Dentro del parqueo'
                  : item.status == 3 || item.status == 5
                  ? 'Fuera del parqueo'
                  : 'Intento fallido'
            }
          })
        })
      )
  }

  getParkingMonthlyRpt(
    initDate: Date,
    endDate: Date,
    parqueo: string,
    telephone: string = ''
  ) {
    let _initDate = new Date(initDate).toISOString().split('T')[0]
    let _endDate = new Date(endDate).toISOString().split('T')[0]

    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/report/parkingMonthlyRpt/dates?initDate=${_initDate}&endDate=${_endDate}&parqueo=${parqueo}&phoneNumber=${telephone}`
      )
      .pipe(
        map((res) => {
          return res.data.map((item: any) => {
            return {
              phone_number: item.user.phone_number,
              name: `${item.user.name} ${item.user.lastName ?? ''}`,
              email: item.user.email,
              nit: item.billing?.buyer_nit ?? 'CF',
              amount_monthly: item.subscription?.amount,
              amount: item.amount ?? '',
              month_paid: item.month_paid ?? '',
              payment_date: new Date(item.created_at).toLocaleString(),
              trace_number: item.trace_number,
              certification_time: item.billing?.certification_time,
              noInvoice:
                item.billing?.fiscal_number &&
                item.billing?.fiscal_number != ' '
                  ? item.billing?.fiscal_number
                  : 'No generada',
              is_aproved: item.is_aproved,
              last_payment: item.subscription?.last_payment_date ?? '',
              parking: item.terminal?.parking.name
            }
          })
        })
      )
  }

  descriptionOfDiffOfTime(oldTime: Date, timeNow: Date): string {
    if (!timeNow) {
      return 'No ha salido del parqueo'
    }
    let days: number = timeNow.getDay() - oldTime.getDay()
    let hours: number = timeNow.getHours() - oldTime.getHours()
    let minutes: number = timeNow.getMinutes() - oldTime.getMinutes()
    if (minutes < 0) {
      hours--
      minutes += 60
    }
    if (hours < 0) {
      days--
      hours += 24
    }
    if (days < 0) {
      days += 7
    }
    let response: string = ''

    if (days > 0 && hours > 0 && minutes > 0)
      return `${days} días, ${hours} horas y ${minutes} minutos`
    if (days > 0 && hours > 0 && minutes === 0)
      return `${days} días, ${hours} horas`
    if (days > 0 && hours === 0 && minutes > 0)
      return `${days} días y ${minutes} minutos`
    if (days > 0 && hours === 0 && minutes === 0) return `${days} días`
    if (days === 0 && hours > 0 && minutes > 0)
      return `${hours} horas y ${minutes} minutos`
    if (days === 0 && hours > 0 && minutes === 0) return `${hours} horas`
    if (days === 0 && hours === 0 && minutes > 0) return `${minutes} minutos`
    if (days === 0 && hours === 0 && minutes === 0) return '0 minutos'

    return response
  }

  getParkingRpt(initDate: string, endDate: string, parqueo: string) {
    const _initDate = new Date(initDate).toISOString().split('T')[0]
    const _endDate = new Date(endDate).toISOString().split('T')[0]

    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/report/parkingDailyMoSubRpt/dates?initDate=${_initDate}&endDate=${_endDate}&parqueo=${parqueo}`
      )
      .pipe(
        map((res: any) => {
          return res.data.map((item: any) => {
            return {
              id: item.id,
              name: `${item?.user?.name ?? ''} ${item?.user?.lastName ?? ''}`,
              email: item?.user?.email,
              gender: item?.user?.gender == 2 ? 'Masculino' : 'Femenino',
              phone_number: item?.user?.phone_number,
              entry_date: item?.entry_date
                ? item?.entry_date.toLocaleString()
                : '',
              exit_date: item?.exit_date
                ? item?.exit_date.toLocaleString()
                : '',
              timeIn: this.descriptionOfDiffOfTime(
                new Date(item?.entry_date),
                new Date(item?.exit_date)
              ),
              entry_station: item?.entry_station?.name ?? '',
              exit_station: item?.exit_station?.name ?? '',
              type: item?.type == 1 ? 'ebiGo Ticket' : 'ebiGo Mensual'
            }
          })
        })
      )
  }

  getParkingDateRpt(initDate: string, parqueo: string) {
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/report/parkingDailyMoSubDetRpt/dates?initDate=${initDate}&parqueo=${parqueo}`
    )
  }
}
