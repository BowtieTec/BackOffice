import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {LoginComponent} from './login/login.component'
import {AuthRoutingModule} from './auth-routing.module'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {RecoverPasswordComponent} from './recover-password/recover-password.component'

@NgModule({
  declarations: [LoginComponent, RecoverPasswordComponent],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, FormsModule]
})
export class AuthModule {
}
