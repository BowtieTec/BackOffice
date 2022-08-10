import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {ManagementRoutingModule} from './management-routing.module'
import {ManagementMenuComponent} from './management-menu.component'
import {ResgisteredUsersComponent} from './components/users/components/resgistered-users/resgistered-users.component'
import {NewUserComponent} from './components/users/components/new-user/new-user.component'
import {UsersComponent} from './components/users/users.component'
import {SharedModule} from '../../shared/shared.module'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {NgbNavModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap'
import {DataTablesModule} from 'angular-datatables'
import {RolesComponent} from './components/roles/roles.component'
import {CompanyComponent} from './components/companies/company/company.component'
import {ParkingModule} from '../parking/parking.module'
import {TariffTestComponent} from './components/tariff-test/tariff-test.component'
import {UsersAppComponent} from './components/users-app/users-app.component'
import {FeaturesModule} from "../features.module";

@NgModule({
  declarations: [
    ManagementMenuComponent,
    ResgisteredUsersComponent,
    NewUserComponent,
    UsersComponent,
    RolesComponent,
    CompanyComponent,
    TariffTestComponent,
    UsersAppComponent
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgbPaginationModule,
    FormsModule,
    DataTablesModule,
    NgbNavModule,
    ParkingModule,
    FeaturesModule
  ],

})
export class ManagementModule {
}
