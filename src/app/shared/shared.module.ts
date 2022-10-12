import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {LeftPanelComponent} from './left-panel/left-panel.component'
import {RouterModule} from '@angular/router'
import {HeaderComponent} from './header/header.component'
import {LocationPanelComponent} from './location-panel/location-panel.component'
import {CardKpiComponent} from './card-kpi/card-kpi.component'
import {BarChartComponent} from './bar-chart/bar-chart.component'
import {LoadingComponent} from './loading/loading.component'
import {TimePipe} from './pipes/time.pipe'
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap'
import {FilterPipe} from './pipes/filter.pipe'
import {Page404Component} from './page404/page404.component'
import {InputContainerComponent} from './forms/input-container/input-container.component'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {SelectContainerComponent} from './forms/select-container/select-container.component'
import {TextAreaContainerComponent} from './forms/text-area-container/text-area-container.component'
import {CheckboxContainerComponent} from './forms/checkbox-container/checkbox-container.component'
import {CourtesyValuePipe} from './pipes/courtesy-value.pipe'
import {CourtesyChartComponent} from './courtesy-chart/courtesy-chart.component'
import {RadioContainerComponent} from './forms/radio-container/radio-container.component';
import {CardPlaceholderComponent} from './card-placeholder/card-placeholder.component';
import {ListCheckboxContainerComponent} from './forms/list-checkbox-container/list-checkbox-container.component'
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  declarations: [
    LeftPanelComponent,
    HeaderComponent,
    LocationPanelComponent,
    CardKpiComponent,
    BarChartComponent,
    LoadingComponent,
    TimePipe,
    FilterPipe,
    Page404Component,
    InputContainerComponent,
    SelectContainerComponent,
    TextAreaContainerComponent,
    CheckboxContainerComponent,
    CourtesyValuePipe,
    CourtesyChartComponent,
    RadioContainerComponent,
    CardPlaceholderComponent,
    ListCheckboxContainerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule
  ],
  exports: [
    LeftPanelComponent,
    HeaderComponent,
    LocationPanelComponent,
    CardKpiComponent,
    BarChartComponent,
    LoadingComponent,
    TimePipe,
    FilterPipe,
    InputContainerComponent,
    SelectContainerComponent,
    TextAreaContainerComponent,
    CheckboxContainerComponent,
    CourtesyValuePipe,
    CourtesyChartComponent,
    RadioContainerComponent,
    ListCheckboxContainerComponent
  ]
})
export class SharedModule {
}
