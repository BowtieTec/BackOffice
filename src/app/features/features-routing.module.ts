import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {Page404Component} from '../shared/page404/page404.component'
import {RecoverPasswordComponent} from './auth/recover-password/recover-password.component'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'recoverPassword',
    component: RecoverPasswordComponent
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)
  },
  {
    path: '404',
    component: Page404Component
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule {
}
