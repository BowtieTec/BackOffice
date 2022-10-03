import {Component, ElementRef, OnInit, ViewChild} from '@angular/core'
import {DxDataGridComponent} from 'devextreme-angular'
import {DataTableDirective} from 'angular-datatables'
import {Subject} from 'rxjs'
import {ParkingModel} from '../../../parking/models/Parking.model'
import {environment} from '../../../../../environments/environment'
import {AuthService} from '../../../../shared/services/auth.service'
import {ReportService} from '../service/report.service'
import {MessageService} from '../../../../shared/services/message.service'
import {UtilitiesService} from '../../../../shared/services/utilities.service'
import {PermissionsService} from '../../../../shared/services/permissions.service'
import {ParkingService} from '../../../parking/services/parking.service'
import {DataTableOptions} from '../../../../shared/model/DataTableOptions'
import {jsPDF} from 'jspdf'
import {exportDataGrid as exportDataGridToPdf} from 'devextreme/pdf_exporter'
import {Workbook} from 'exceljs'
import * as logoFile from '../logoEbi'
import {saveAs} from 'file-saver'
import {FormBuilder, FormGroup} from '@angular/forms'

export interface billingData {
  serial: string
  fiscal_number: string
  receip_number: string
  total: string
  descuento: number
  pagado: number
  nit: number
  typeService: string
  dateBilling: Date
}

@Component({
  selector: 'app-billing-report',
  templateUrl: './billing-report.component.html',
  styleUrls: ['./billing-report.component.css']
})
export class BillingReportComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid!: DxDataGridComponent
  dtElement!: DataTableDirective
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject()
  pdfTable!: ElementRef
  now: Date = new Date()
  report: billingData[] = []
  dataSource: any

  allParking: ParkingModel[] = Array<ParkingModel>()
  verTodosLosParqueosReport = environment.verTodosLosParqueosReport
  @ViewChild('inputParking') inputParking!: ElementRef
  fechaActual = new Date().toISOString().split('T')[0]

  nowDateTime = new Date()
  parkingId: string = ''
  reportForm: FormGroup

  constructor(
    private auth: AuthService,
    private reportService: ReportService,
    private messageService: MessageService,
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
    this.messageService.showLoading()
    this.dtOptions = DataTableOptions.getSpanishOptions(10)

    this.parkingService.parkingLot$.subscribe((parkingLot) => {
      this.allParking = [
        ...parkingLot,
        { id: '0', name: '-- Todos los parqueos --' }
      ]
    })
    this.authService.user$.subscribe(({ parkingId }) => {
      this.parkingId = parkingId
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
    const {
      startDate,
      endDate,
      parkingId,
      dateTypeSearch
    }: {
      startDate: Date
      endDate: Date
      parkingId: string
      dateTypeSearch: number
    } = this.reportForm.getRawValue()
    let _startDate = startDate.toISOString().split('T')[0] + ' 00:00:00'
    let _endDate = endDate.toISOString().split('T')[0] + ' 23:59:59'
    if (endDate < startDate) {
      this.messageService.error(
        '',
        'La fecha de inicio debe ser mayor a la fecha fin'
      )
      return
    }
    console.log(startDate)
    return this.reportService
      .getBillingRpt(_startDate, _endDate, parkingId, dateTypeSearch)
      .toPromise()
      .then((data) => {

        if (data.success) {
          this.report = data.data
          this.dataSource = data.data
          this.rerender()
        } else {
          this.messageService.error('', data.message)
        }
      })
      .then(() => {
        this.messageService.hideLoading()
      })
  }

  onExporting(e: any) {
    if (this.report.length == 0) {
      this.messageService.infoTimeOut('No hay información para exportar')
      return
    }
    const { startDate, endDate, parkingId } = this.reportForm.getRawValue()
    const header = [
      '',
      'Fecha emisión factura',
      'Teléfono',
      'Nit del Cliente',
      'Total (Q)',
      'Moneda del documento',
      'Número de Factura',
      'Tipo'
    ]
    //Create workbook and worksheet
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('ebiGO Facturación')
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
    worksheet.mergeCells('D2:G3')
    let ParqueoReporte = 'Todos los parqueos'
    if (this.parkingId != '0') {
      const parqueoEncontrado = this.allParking.find(
        (parqueos) => parqueos.id == parkingId
      )
      if (parqueoEncontrado) {
        ParqueoReporte = parqueoEncontrado.name
      }
    }
    const addressRow = worksheet.addRow(['', '', '', ParqueoReporte])
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
    worksheet.mergeCells('D4:G5')
    const titleRow = worksheet.addRow([
      '',
      '',
      '',
      'Reporte - ebiGO Facturación'
    ])
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
    worksheet.mergeCells('D6:G8')
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
    worksheet.mergeCells('B10:G11')
    worksheet.addRow([])
    const header1 = worksheet.addRow([
      '',
      'Fecha Inicio: ' + new Date(startDate).toLocaleDateString(),
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
    worksheet.mergeCells('B13:D14')
    worksheet.mergeCells('E13:G14')
    const header2 = worksheet.addRow([
      '',
      'Total de facturas emitidas: ' + this.dataSource.length,
      '',
      '',
      'Documento generado: ' +
        new Date().toLocaleDateString() +
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
    worksheet.mergeCells('B15:D16')
    worksheet.mergeCells('E15:G16')
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
        d.dateBilling
          ? new Date(d.dateBilling).toLocaleDateString('es-GT')
          : ' ',
        d.phone_key,
        d.nit,
        d.total,
        'GTQ',
        d.noFactura,
        d.typeService
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

    worksheet.getColumn(2).width = 20
    worksheet.getColumn(3).width = 20
    worksheet.getColumn(4).width = 20
    worksheet.getColumn(5).width = 20
    worksheet.getColumn(6).width = 20
    worksheet.getColumn(7).width = 20
    worksheet.getColumn(8).width = 20
    worksheet.getColumn(9).width = 15
    worksheet.getColumn(10).width = 15
    worksheet.getColumn(11).width = 30
    worksheet.getColumn(12).width = 20
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
      this.messageService.infoTimeOut('No hay información para exportar')
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


