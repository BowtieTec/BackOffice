import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {SharedModule} from '../../../../shared/shared.module'
import {UsersRoutingModule} from './users-routing.module'
import {DataTablesModule} from 'angular-datatables'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutingModule,
    SharedModule,
    DataTablesModule
  ]
})
export class UsersModule {
}
