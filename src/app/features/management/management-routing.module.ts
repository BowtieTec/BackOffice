import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {ManagementMenuComponent} from './management-menu.component'

const routes: Routes = [
  {
    path: '',
    component: ManagementMenuComponent,
    outlet: 'home'
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {
}
