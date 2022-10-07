import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core'
import {DataTableDirective} from 'angular-datatables'
import {Subject} from 'rxjs'
import {MessageService} from '../../../../shared/services/message.service'
import {DataTableOptions} from '../../../../shared/model/DataTableOptions'
import {ReportService} from '../service/report.service'
import {UtilitiesService} from '../../../../shared/services/utilities.service'
import {AuthService} from '../../../../shared/services/auth.service'
import {PermissionsService} from '../../../../shared/services/permissions.service'
import {environment} from 'src/environments/environment'
import {jsPDF} from 'jspdf'
import {DxDataGridComponent} from 'devextreme-angular'
import {exportDataGrid as exportDataGridToPdf} from 'devextreme/pdf_exporter'
import {Workbook} from 'exceljs'
import {saveAs} from 'file-saver'

import {ParkingService} from '../../../parking/services/parking.service'
import * as logoFile from '../logoEbi'
import {FormBuilder, FormGroup} from '@angular/forms'

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.css']
})
export class PaymentReportComponent implements OnInit, AfterViewInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid!: DxDataGridComponent
  dtElement!: DataTableDirective
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject()
  pdfTable!: ElementRef
  reportForm: FormGroup
  report: any
  dataSource: any
  now = new Date()
  verTodosLosParqueosReport = environment.verTodosLosParqueosReport
  @ViewChild('inputParking') inputParking!: ElementRef

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private reportService: ReportService,
    private messageService: MessageService,
    private utilitiesService: UtilitiesService,
    private authService: AuthService,
    private permissionService: PermissionsService,
    private excelService: ReportService,
    private parkingService: ParkingService
  ) {
    this.reportForm = this.createReportForm()
  }

  get isSudo() {
    return this.authService.isSudo
  }

  ngOnInit(): void {
    this.messageService.showLoading()
    this.dtOptions = DataTableOptions.getSpanishOptions(10)
    this.authService.user$.subscribe(({ parkingId }) => {
      this.reportForm.get('parkingId')?.setValue(parkingId)
      this.getReport()
    })
  }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }

  getReport() {
    let { startDate, endDate, parkingId, telephone } = this.reportForm.value
    telephone = telephone ?? ''
    if (endDate < startDate) {
      this.messageService.error(
        '',
        'La fecha de inicio debe ser mayor a la fecha fin'
      )
      return
    }
    this.messageService.showLoading()

    return this.reportService
      .getPaymentsRpt(startDate, endDate, parkingId, telephone)
      .toPromise()
      .then((data) => {
        this.report = data
        this.dataSource = data
      })
      .finally(() => this.messageService.hideLoading())
  }

  ngAfterViewInit() {
    this.dtTrigger.next()
  }

  exportGrid() {
    if (this.report.length == 0) {
      this.messageService.infoTimeOut('No hay información para exportar')
      return
    }
    const doc = new jsPDF()
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.dataGrid.instance
    }).then(() => {
      doc.save('Duracin.pdf')
    })
  }

  onExporting(e: any) {
    if (this.report.length == 0) {
      this.messageService.infoTimeOut('No hay información para exportar')
      return
    }
    const { startDate, endDate, parkingId, telephone } = this.reportForm.value
    const header = [
      '',
      'Teléfono',
      'Ingreso',
      'Salida',
      'Tiempo estacionado',
      'Sub monto (Q)',
      'Descuento',
      'Total (Q)',
      'Nombre de descuento',
      'Estado',
      'No. Factura',
      'Fecha de emisión de Factura',
      'Fecha de pago',
      'No. Transacción',
      'Método de pago'
    ]
    //Create workbook and worksheet
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Pagos por fecha')
    //Add Row and formatting
    worksheet.addRow([])

    const busienssRow = worksheet.addRow(['', '', '', 'ebiGO'])
    busienssRow.font = { name: 'Calibri', family: 4, size: 11, bold: true }
    busienssRow.alignment = { horizontal: 'center', vertical: 'middle' }
    busienssRow.eachCell((cell, number) => {
      if (number > 1) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      }
    })
    worksheet.mergeCells('D2:O3')
    const addressRow = worksheet.addRow(['', '', '', this.authService.getParking().name])
    addressRow.font = { name: 'Calibri', family: 4, size: 11, bold: true }
    addressRow.alignment = { horizontal: 'center', vertical: 'middle' }
    addressRow.eachCell((cell, number) => {
      if (number > 1) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      }
    })
    worksheet.mergeCells('D4:O5')
    const titleRow = worksheet.addRow(['', '', '', 'Reporte - Pago de parqueo'])
    titleRow.font = { name: 'Calibri', family: 4, size: 11, bold: true }
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
    titleRow.eachCell((cell, number) => {
      if (number > 1) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      }
    })
    worksheet.mergeCells('D6:O8')
    //Add Image
    worksheet.mergeCells('B2:C8')
    const logo = workbook.addImage({
      base64: logoFile.logoBase64,
      extension: 'png'
    })
    worksheet.addImage(logo, 'B3:C6')
    worksheet.addRow([])
    const infoRow = worksheet.addRow(['', 'Información General'])
    infoRow.font = { name: 'Calibri', family: 4, size: 11, bold: true }
    infoRow.alignment = { horizontal: 'center', vertical: 'middle' }
    infoRow.eachCell((cell, number) => {
      if (number > 1) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      }
    })
    worksheet.mergeCells('B10:O11')
    worksheet.addRow([])
    const header1 = worksheet.addRow([
      '',
      'Fecha Inicio: ' + new Date(startDate).toLocaleDateString(),
      '',
      '',
      '',
      '',
      '',
      '',
      'Fecha Fin: ' + new Date(endDate).toLocaleDateString()
    ])
    header1.eachCell((cell, number) => {
      if (number > 1) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      }
    })
    worksheet.mergeCells('B13:H14')
    worksheet.mergeCells('I13:O14')
    const header2 = worksheet.addRow([
      '',
      'Total de vehiculos que ingresaron: ' + this.dataSource.length,
      '',
      '',
      '',
      '',
      '',
      '',
      'Documento generado: ' +
        new Date().toLocaleDateString('es-GT') +
        '  ' +
        new Date().toLocaleTimeString()
    ])
    header2.eachCell((cell, number) => {
      if (number > 1) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      }
    })
    worksheet.mergeCells('B15:H16')
    worksheet.mergeCells('I15:O16')
    worksheet.addRow([])
    const headerRow = worksheet.addRow(header)

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      if (number > 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' },
          bgColor: { argb: 'FF0000FF' }
        }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      }
    })
    // Add Data and Conditional Formatting
    this.dataSource.forEach((d: any) => {
      const row = worksheet.addRow([
        '',
        d.phone_key,
        d.entry_date ? new Date(d.entry_date).toLocaleString() : '',
        d.exit_date ? new Date(d.exit_date).toLocaleString() : '',
        d.timeIn,
        d.subtotal,
        d.discount,
        d.total,
        d.courtesy,
        d.paymentStatus,
        d.invoice,
        d.invoiceDate ? new Date(d.invoiceDate).toLocaleString() : '',
        d.paymentDate ? new Date(d.paymentDate).toLocaleString() : '',
        d.transaction,
        d.typePayment
      ])
      row.eachCell((cell, number) => {
        if (number > 1) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        }
      })
    })
    worksheet.addRow([])
    worksheet.addRow([])
    worksheet.addRow([])

    worksheet.getColumn(2).width = 15
    worksheet.getColumn(3).width = 20
    worksheet.getColumn(4).width = 20
    worksheet.getColumn(5).width = 20
    worksheet.getColumn(6).width = 20
    worksheet.getColumn(7).width = 20
    worksheet.getColumn(8).width = 25
    worksheet.getColumn(9).width = 25
    worksheet.getColumn(10).width = 20
    worksheet.getColumn(11).width = 15
    worksheet.getColumn(12).width = 20
    worksheet.getColumn(13).width = 20
    worksheet.getColumn(14).width = 15
    worksheet.getColumn(15).width = 25
    worksheet.getColumn(16).width = 25

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      saveAs(
        blob,
        `Reporte Detalle de Pagos por Ticket - Generado - '${this.now.toLocaleString()}.xlsx`
      )
    })
    e.cancel = true
  }

  getTimeInParking(rowData: any) {
    const oldTime: Date = new Date(rowData.entry_date)
    const timeNow: Date = new Date(rowData.exit_date)

    return this.reportService.descriptionOfDiffOfTime(oldTime, timeNow)
  }

  private createReportForm() {
    return this.formBuilder.group({
      startDate: [new Date()],
      endDate: [new Date()],
      parkingId: ['0'],
      telephone: ['']
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
}
