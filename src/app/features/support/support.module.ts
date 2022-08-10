import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTicketComponent } from './components/new-ticket/new-ticket.component';
import { SupportMenuComponent } from './components/support-menu/support-menu.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { SupportRoutingModule } from './support-routing.module';
import { IssueLogComponent } from './components/issue-log/issue-log.component';
import { DataTablesModule } from 'angular-datatables'



@NgModule({
  declarations: [

    NewTicketComponent,
    SupportMenuComponent,
    IssueLogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    SharedModule,
    SupportRoutingModule,
    DataTablesModule
  ]
})
export class SupportModule { }
