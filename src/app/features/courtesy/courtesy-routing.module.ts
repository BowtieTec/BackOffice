import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {CourtesyMenuComponent} from './courtesy-menu/courtesy-menu.component'

const routes: Routes = [
  {path: '', component: CourtesyMenuComponent, outlet: 'home'}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourtesyRoutingModule {
}
