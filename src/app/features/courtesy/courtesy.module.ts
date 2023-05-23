import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

import {CourtesyRoutingModule} from './courtesy-routing.module'
import {ReactiveFormsModule} from '@angular/forms'
import {DataTablesModule} from 'angular-datatables'
import {SharedModule} from '../../shared/shared.module'
import {CourtesyMenuComponent} from './courtesy-menu/courtesy-menu.component'
import {ParkingModule} from '../parking/parking.module'
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap'
import {CourtesyComponent} from './components/courtesy/courtesy.component'
import {StationaryCourtesyComponent} from './components/stationary-courtesy/stationary-courtesy.component'
import {
  AntennasFromCourtesyComponent
} from './components/stationary-courtesy/components/antennas-from-courtesy/antennas-from-courtesy.component';
import { ShowCourtesiesComponent } from './components/show-courtesies/show-courtesies.component'

@NgModule({
  declarations: [
    CourtesyMenuComponent,
    CourtesyComponent,
    StationaryCourtesyComponent,
    AntennasFromCourtesyComponent,
    ShowCourtesiesComponent
  ],
  imports: [
    CommonModule,
    CourtesyRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    SharedModule,
    ParkingModule,
    NgbNavModule,
  ]
})
export class CourtesyModule {

}
