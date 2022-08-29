import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {HomeComponent} from './home/home.component'
import {AuthGuard} from '../../core/Services/auth.guard'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'management',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../management/management.module').then(
            (m) => m.ManagementModule
          )
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'parking',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../parking/parking.module').then((m) => m.ParkingModule)
      },
      {
        path: 'courtesy',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../courtesy/courtesy.module').then((m) => m.CourtesyModule)
      },
      {
        path: 'report',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../report/report.module').then((m) => m.ReportModule)
      },
      {
        path: 'support',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../support/support.module').then((m) => m.SupportModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
