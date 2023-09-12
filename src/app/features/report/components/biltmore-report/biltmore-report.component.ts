import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from "../../../../shared/services/auth.service";
import { ReportService } from "../service/report.service";
import { MessageService } from "../../../../shared/services/message.service";
import { UtilitiesService } from "../../../../shared/services/utilities.service";
import { PermissionsService } from "../../../../shared/services/permissions.service";
import { ParkingService } from "../../../parking/services/parking.service";
import { DataTableOptions } from "../../../../shared/model/DataTableOptions";
import { Workbook } from "exceljs";
import * as logoFile from "../logoEbi";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { billingData } from "../billing-report/billing-report.component";

@Component({
  selector: 'app-biltmore-report',
  templateUrl: './biltmore-report.component.html',
  styleUrls: ['./biltmore-report.component.css']
})
export class BiltmoreReportComponent implements OnInit{
  @ViewChild(DxDataGridComponent, {static: false})
  dataGrid!: DxDataGridComponent
  dtElement!: DataTableDirective
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject()
  pdfTable!: ElementRef
  now: Date = new Date()
  report: billingData[] = []
  dataSource: any

  verTodosLosParqueosReport = environment.verTodosLosParqueosReport
  @ViewChild('inputParking') inputParking!: ElementRef
  fechaActual = new Date().toISOString().split('T')[0]

  nowDateTime = new Date()
  reportForm: FormGroup

  constructor(
    private auth: AuthService,
    private reportService: ReportService,
    private message: MessageService,
    private utilitiesService: UtilitiesService,
    private authService: AuthService,
    private permissionService: PermissionsService,
    private excelService: ReportService,
    private parkingService: ParkingService,
    private formBuilder: FormBuilder
  ) {
    this.reportForm = this.createReportForm()
  }

  get isSudo() {
    return this.authService.isSudo
  }

  ngOnInit(): void {
    this.message.showLoading()
    this.dtOptions = DataTableOptions.getSpanishOptions(10)

    this.authService.user$.subscribe(({parkingId}) => {
      this.reportForm.get('parkingId')?.setValue(parkingId)
      this.getInitialData()?.then()
    })
  }

  getInitialData() {
    return this.getReport()?.then()
  }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }

  getReport() {
    this.message.showLoading()


    const {
      startDate,
      endDate,
      parkingId,
    }: {
      startDate: Date
      endDate: Date
      parkingId: string
    } = this.reportForm.getRawValue()
    if (endDate < startDate) {
      this.message.error(
        '',
        'La fecha de inicio debe ser mayor a la fecha fin'
      )
      return
    }
    let _startDate = new Date(startDate).toISOString().split('T')[0] + ' 00:00:00'
    let _endDate = new Date(endDate).toISOString().split('T')[0] + ' 23:59:59'
    return this.reportService
      .getBiltmoreRpt(_startDate, _endDate, parkingId)
      .toPromise()
      .then((data) => {
       this.report = data
        this.dataSource = data
        this.rerender()
      })
      .then(() => this.message.hideLoading())
  }

  onExporting(e: any) {
    if (this.report.length == 0) {
      this.message.infoTimeOut('No hay información para exportar')
      return
    }
    const {startDate, endDate, parkingId} = this.reportForm.getRawValue()
    const header = [
      'Serie Interna',
      'Numero Interno',
      'Fecha Emisión',
      'Monto',
      'Estado',
      'TransID',
      'Terminal',
      'Concepto',
      'NIT',
      'Razon Social',
      'Direccion',
      'Tipo de Pago',
      'Serie',
      'Numero',
      'Numero Autorización'
    ]
    //Create workbook and worksheet
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('ebiGO Facturación')
    //Add Row and formatting
    const headerRow = worksheet.addRow(header)

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      if (number > 0) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'FFFFFF00'},
          bgColor: {argb: 'FF0000FF'}
        }
        cell.border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        }
      }
    })
    // Add Data and Conditional Formatting
    this.dataSource.forEach((d: any) => {
      const row = worksheet.addRow([
        d.serieInterna,
        d.numeroInterno,
        d.certification_time,
        d.total,
        d.status,
        '',
        d.terminal,
        '',
        d.nit,
        d.razonSocial,
        d.address,
        d.paymentType,
        d.serial,
        d.noFactura,
        d.noAutorizacion,
      ])
      row.eachCell((cell, number) => {
        if (number > 1) {
          cell.border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
          }
        }
      })
    })
    worksheet.addRow([])
    worksheet.addRow([])
    worksheet.addRow([])

    worksheet.getColumn(1).width = 20
    worksheet.getColumn(2).width = 20
    worksheet.getColumn(3).width = 20
    worksheet.getColumn(4).width = 20
    worksheet.getColumn(5).width = 20
    worksheet.getColumn(6).width = 20
    worksheet.getColumn(7).width = 15
    worksheet.getColumn(8).width = 15
    worksheet.getColumn(9).width = 25
    worksheet.getColumn(10).width = 25
    worksheet.getColumn(11).width = 15
    worksheet.getColumn(12).width = 30
    worksheet.getColumn(13).width = 20

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      saveAs(
        blob,
        `Reporte de Facturación - Generado - ${this.nowDateTime.toLocaleString()}.xlsx`
      )
    })
    e.cancel = true
  }

  ngAfterViewInit() {
    this.dtTrigger.next()
  }

  exportGrid() {
    if (this.report.length == 0) {
      this.message.infoTimeOut('No hay información para exportar')
      return
    }
    const doc = new jsPDF()
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.dataGrid.instance
    }).then(() => {
      doc.save('ReporteFacturación.pdf')
    })
  }

  private rerender() {
    if (this.dtElement != undefined) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy()
        this.dtTrigger.next()
      })
    }
  }

  private createReportForm() {
    return this.formBuilder.group({
      startDate: [new Date()],
      endDate: [new Date()],
      parkingId: ['0'],
      dateTypeSearch: [0]
    })
  }

}