import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { UntypedFormBuilder } from '@angular/forms'
import { MessageService } from '../../../../shared/services/message.service'
import { PermissionsService } from '../../../../shared/services/permissions.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { UtilitiesService } from '../../../../shared/services/utilities.service'
import { DataTableOptions } from '../../../../shared/model/DataTableOptions'
import { Subject } from 'rxjs'
import { DataTableDirective } from 'angular-datatables'
import { IssueModel } from './issue/issue.module'
import { IssueLogService } from './Services/issue-log.service'

@Component({
  selector: 'app-issue-log',
  templateUrl: './issue-log.component.html',
  styleUrls: ['./issue-log.component.css']
})
export class IssueLogComponent implements OnInit {
  @Input() subject: Subject<IssueModel> = new Subject<IssueModel>()
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective
  dtTrigger: Subject<any> = new Subject()
  issues: IssueModel[] = []
  nowDateTime = new Date()
  fechaActual = new Date().toISOString().split('T')[0]
  startDate: any
  endDate: any
  valContext: any

  constructor(
    private logService: IssueLogService,
    private formBuilder: UntypedFormBuilder,
    private message: MessageService,
    private permissionsService: PermissionsService,
    private modal: NgbModal,
    private utilitiesService: UtilitiesService
  ) {}

  get dtOptions() {
    return DataTableOptions.getSpanishOptions(25)
  }

  getIssues(initDate: string, endDate: string, telephone: string = '') {
    this.getLogsApp(initDate, endDate, telephone)
    this.subject.subscribe((issue: IssueModel) => {
      this.getLogsApp(initDate, endDate, telephone)
    })
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dtTrigger.next()
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }

  private rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy()
      this.dtTrigger.next()
    })
  }

  openContext(data: string, contenido: any) {
    this.valContext = data
    this.modal.open(contenido)
  }

  private getLogsApp(
    initDate: string,
    endDate: string,
    telephone: string = ''
  ) {
    if (endDate < initDate) {
      this.message.error('', 'La fecha de inicio debe ser mayor a la fecha fin')
      return
    }
    this.message.showLoading()
    this.logService
      .getAllAppLogs(initDate, endDate, telephone)
      .toPromise()
      .then((data) => {
        this.issues = data
        this.rerender()
        this.message.hideLoading()
      })
  }
}
