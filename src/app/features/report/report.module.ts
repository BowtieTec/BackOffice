import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

import {ReportRoutingModule} from './report-routing.module'
import {ReportMenuComponent} from './report-menu.component'
import {SharedModule} from 'src/app/shared/shared.module'
import {NgbNavModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap'
import {DataTablesModule} from 'angular-datatables'
import {PaymentReportComponent} from './components/payment-report/payment-report.component'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {CourtesyReportComponent} from './components/courtesy-report/courtesy-report.component'
import {CourtesyStationReportComponent} from './components/courtesy-station-report/courtesy-station-report.component'
import {DurationReportComponent} from './components/duration-report/duration-report.component'
import {ParkingTicketReportComponent} from './components/parking-ticket-report/parking-ticket-report.component'
import {
  ParkingMontlyPaymentReportComponent
} from './components/parking-montly-payments-report/parking-montly-payment-report.component'
import {ParkingDayReportComponent} from './components/parking-day-report/parking-day-report.component'
import {ReportService} from './components/service/report.service'

import {DxButtonModule, DxDataGridModule} from 'devextreme-angular'

import {DetailGridComponent} from './components/parking-ticket-report/detail/detail-grid.component'
import {BillingReportComponent} from './components/billing-report/billing-report.component';
import {HistoryCourtesyComponent} from './components/history-courtesy/history-courtesy.component';
import {TransitDetailReportComponent} from './components/transit-detail-report/transit-detail-report.component'

@NgModule({
  declarations: [
    ReportMenuComponent,
    PaymentReportComponent,
    CourtesyReportComponent,
    CourtesyStationReportComponent,
    DurationReportComponent,
    ParkingTicketReportComponent,
    ParkingMontlyPaymentReportComponent,
    ParkingDayReportComponent,
    DetailGridComponent,
    BillingReportComponent,
    HistoryCourtesyComponent,
    TransitDetailReportComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    DataTablesModule,
    NgbNavModule,
    DxDataGridModule,
    DxButtonModule
  ],
  providers: [ReportService]
})
export class ReportModule {
}
