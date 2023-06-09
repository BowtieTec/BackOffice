import {Injectable} from '@angular/core'
import {environment} from '../../../../../environments/environment'
import {HttpClient} from '@angular/common/http'
import {ResponseModel} from 'src/app/shared/model/Request.model'
import {payFilter} from '../model/paymentModel'
import {map} from 'rxjs/operators'
import {UtilitiesService} from "../../../../shared/services/utilities.service";

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  payDate: payFilter[] = new Array<payFilter>()
  private apiUrl = environment.serverAPI

  constructor(private http: HttpClient, private utility: UtilitiesService) {
  }

  getPaymentsRpt(
    initDate: string,
    endDate: string,
    parqueo: string,
    telephone: string = ''
  ) {
    console.log({initDate, endDate, parqueo, telephone})
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/report/getPagos/dates?initDate=${initDate}&endDate=${endDate}&parqueo=${parqueo}&telephone=${telephone}`
      )
      .pipe(
        map((res) => {
          return res.data.map((item: any) => {
            const payment = item.payment.find((x: any) => x.is_aproved && x.billing)
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
                  : payment?.billing?.fiscal_number ??
                  (item.total > 0 ? 'No generada' : 'No requerida'),
              invoiceDate: payment?.billing?.certification_time ?? '',
              paymentDate: payment?.created_at ?? '',
              timeIn: this.utility.descriptionOfDiffOfTime(
                new Date(item.entry_date),
                new Date(item.exit_date)
              ),
              transaction: payment?.trace_number ?? '',
              noAutoritation: payment?.auth_id_response ?? '',
              courtesy: item.courtesy?.courtesy_details?.name ?? '',
              company: item.courtesy?.courtesy_details?.company.name ?? '',
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
isApproved(payment: any) {
    return payment.is_aproved == true && payment.billing
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
            const payment = item.payment.find((x: any) => x.is_aproved && x.billing)
            return {
              phone_key: item.user?.phone_number ?? '',
              entry_date: item.entry_date
                ? new Date(item.entry_date).toLocaleString()
                : '',
              exit_date: item.exit_date
                ? new Date(item.exit_date).toLocaleString()
                : '',
              timeIn: this.utility.descriptionOfDiffOfTime(
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
              transaction: payment?.trace_number ?? '',
              invoice: payment?.billing?.fiscal_number ?? '',
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

  getBlackListRpt(initDate: Date, endDate: Date, parqueo: string) {
    const _initDate = new Date(initDate).toISOString().split('T')[0]
    const _endDate = new Date(endDate).toISOString().split('T')[0]
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/report/reportBlackList/dates?initDate=${_initDate}&endDate=${_endDate}&parqueo=${parqueo}`
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res.data.map((item: any) => {
            console.log(item.status);
            console.log(item.payment_type);
            return {
              phone_key: item.user?.phone_number ?? '',
              entry_date: item.entry_date
                ? new Date(item.entry_date).toLocaleString()
                : '',
              exit_date: item.exit_date
                ? new Date(item.exit_date).toLocaleString()
                : '',
              timeIn: this.utility.descriptionOfDiffOfTime(
                new Date(item.entry_date),
                new Date(item.exit_date || new Date())
              ),
              subtotal: item.subtotal ?? '--',
              discount: item.discount ?? '',
              total: item.total ?? '--',
              courtesy: item.courtesy?.courtesy_details?.name ?? '--',
              typePayment:
                item.payment_type == 4 || item.status == 3
                  ? 'Pagado'
                  : item.status == 2
                    ? 'Pendiente de pago'
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

  dateDiffInDays(oldDate: Date, currentDate: Date) {
    const date1 = new Date(oldDate);
    const date2 = new Date(currentDate);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);
    console.log(diffInDays)
    return diffInDays;
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
                : 'No ha salido',
              timeIn: this.utility.descriptionOfDiffOfTime(
                item?.entry_date,
                item?.exit_date
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
