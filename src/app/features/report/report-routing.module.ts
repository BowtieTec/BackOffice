import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {ReportMenuComponent} from './report-menu.component'
//import { PaymentReportComponent } from './components/payment-report/payment-report.component';
const routes: Routes = [
  {path: '', component: ReportMenuComponent, outlet: 'home'}
  //{ path: 'df', component: PaymentReportComponent, outlet: 'home' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {
}
