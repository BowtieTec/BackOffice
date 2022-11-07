import {Component, Input, OnInit, ViewChild} from '@angular/core'
import {FormGroup, UntypedFormBuilder, Validators} from '@angular/forms'
import {MessageService} from '../../../../shared/services/message.service'
import {PermissionsService} from '../../../../shared/services/permissions.service'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'
import {getCurrentDataTablePage, UtilitiesService} from '../../../../shared/services/utilities.service'
import {DataTableOptions} from '../../../../shared/model/DataTableOptions'
import {Subject} from 'rxjs'
import {DataTableDirective} from 'angular-datatables'
import {IssueModel} from './issue/issue.module'
import {IssueLogService} from './Services/issue-log.service'
import {ADTSettings} from "angular-datatables/src/models/settings";

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
  searchLogForm: FormGroup
  now: Date = new Date()

  constructor(
    private logService: IssueLogService,
    private formBuilder: UntypedFormBuilder,
    private message: MessageService,
    private permissionsService: PermissionsService,
    private modal: NgbModal,
    private utilitiesService: UtilitiesService
  ) {
    this.searchLogForm = this.createLogForm()
  }

  get dtOptions(): ADTSettings {
    return {
      ...DataTableOptions.getSpanishOptions(25),
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback: any) => {
        const {initDate, endDate, telephone} = this.searchLogForm.getRawValue()
        if (this.searchLogForm.invalid) {
          return callback({
            recordsTotal: 0,
            recordsFiltered: 0,
            data: []
          })
        }
        if (endDate < initDate) {
          this.message.error('', 'La fecha de inicio debe ser mayor a la fecha fin')
          return callback({
            recordsTotal: 0,
            recordsFiltered: 0,
            data: []
          })
        }
        const page = getCurrentDataTablePage(dataTablesParameters)
        this.logService
          .getAllAppLogs(initDate, endDate, telephone, page, dataTablesParameters.length)
          .toPromise()
          .then((data) => {
            console.log(data);
            this.issues = data.data
            this.message.hideLoading()
            return callback({
              recordsTotal: data.recordsTotal,
              recordsFiltered: data.recordsFiltered,
              data: []
            })
          })

      }
    }
  }

  createLogForm() {
    return this.formBuilder.group({
      initDate: [new Date(), [Validators.required]],
      endDate: [new Date, [Validators.required]],
      telephone: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next()
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }

  openContext(data: string, contenido: any) {
    this.valContext = data
    this.modal.open(contenido)
  }

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy()
      this.dtTrigger.next()
    })
  }
}
