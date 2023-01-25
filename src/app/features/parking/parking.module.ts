import {NgModule} from '@angular/core'
import {CommonModule, CurrencyPipe, DatePipe} from '@angular/common'

import {ParkingRoutingModule} from './parking-routing.module'
import {ParkedComponent} from './components/parked/parked.component'
import {NewParkingComponent} from './components/new-parking/new-parking.component'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {GoogleMapsModule} from '@angular/google-maps'
import {GeneralDataComponent} from './components/new-parking/components/general-data/general-data.component'
import {ScheduleComponent} from '../shared/schedule/schedule.component'
import {TariffComponent} from '../shared/tariff/tariff.component'
import {BillingDataComponent} from '../shared/billing-data/billing-data.component'
import {AntennasComponent} from './components/antennas/antennas.component'
import {ResumeComponent} from './components/new-parking/components/resume/resume.component'
import {SharedModule} from '../../shared/shared.module'
import {NgbDatepickerModule, NgbModule, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap'
import {ParkingMenuComponent} from './parking-menu.component'
import {MonthlyParkingComponent} from './components/monthly-parking/monthly-parking.component'
import {DataTablesModule} from 'angular-datatables'
import {
  CreateMonthlyParkingComponent
} from './components/monthly-parking/create-monthly-parking/create-monthly-parking.component'
import {FeaturesModule} from '../features.module';
import {AssignCourtesyComponent} from './components/parked/components/assign-courtesy/assign-courtesy.component';
import {ParkingLotComponent} from './components/parking-lot/parking-lot.component'

@NgModule({
  declarations: [
    ParkedComponent,
    NewParkingComponent,
    TariffComponent,
    AntennasComponent,
    ParkingMenuComponent,
    MonthlyParkingComponent,
    CreateMonthlyParkingComponent,
    GeneralDataComponent,
    BillingDataComponent,
    ResumeComponent,
    ScheduleComponent,
    AssignCourtesyComponent,
    ParkingLotComponent
  ],
  imports: [
    CommonModule,
    ParkingRoutingModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    SharedModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbModule,
    FormsModule,
    DataTablesModule,
    FeaturesModule
  ],
  providers: [DatePipe, CurrencyPipe],
  exports: [
    TariffComponent,
    GeneralDataComponent,
    BillingDataComponent,
    ResumeComponent,
    ScheduleComponent
  ]
})
export class ParkingModule {
}
