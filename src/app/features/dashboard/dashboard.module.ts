import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

import {DashboardRoutingModule} from './dashboard-routing.module'
import {DashboardComponent} from './dashboard/dashboard.component'
import {SharedModule} from '../../shared/shared.module'
import {NgApexchartsModule} from 'ng-apexcharts'
import {NgbDatepickerModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap'

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgApexchartsModule,
    NgbNavModule,
    NgbDatepickerModule
  ]
})
export class DashboardModule {
}
