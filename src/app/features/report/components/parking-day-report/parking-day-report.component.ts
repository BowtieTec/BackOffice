import {Component, ElementRef, OnInit, ViewChild} from '@angular/core'
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
import {ParkingModel} from '../../../parking/models/Parking.model'
import * as logoFile from '../logoEbi'

export interface dayPark {
  fecha: Date
  total_v: number
  total: number
  descuento: number
}

@Component({
  selector: 'app-parking-day-report',
  templateUrl: './parking-day-report.component.html',
  styleUrls: ['./parking-day-report.component.css']
})
export class ParkingDayReportComponent implements OnInit {
  //@ViewChild(DataTableDirective)
  @ViewChild(DxDataGridComponent, {static: false})
  dataGrid!: DxDataGridComponent
  dtElement!: DataTableDirective
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject()
  pdfTable!: ElementRef

  report: dayPark[] = []
  dataSource: any
  parqueo: any
  nowDateTime = new Date()
  allParking: ParkingModel[] = Array<ParkingModel>()
  verTodosLosParqueosReport = environment.verTodosLosParqueosReport
  @ViewChild('inputParking') inputParking!: ElementRef
  fechaActual = new Date().toISOString().split('T')[0]

  datosUsuarioLogeado = this.auth.getParking()
  parqueoDetalle = '0'
  startDateReport: any
  endDateReport: any

  constructor(
    private auth: AuthService,
    private reportService: ReportService,
    private messageService: MessageService,
    private utilitiesService: UtilitiesService,
    private authService: AuthService,
    private permisionService: PermissionsService,
    private excelService: ReportService,
    private parkingService: ParkingService
  ) {
    this.messageService.showLoading()

    this.messageService.hideLoading()
  }

  ngOnInit(): void {
    this.dtOptions = DataTableOptions.getSpanishOptions(10)
    this.parkingService.getAllParking().then((data) => {
      if (data.success) {
        this.allParking = data.data.parkings
      }
    })
  }

  ifHaveAction(action: string) {
    return this.permisionService.ifHaveAction(action)
  }

  getInitialData() {
    // Calling
    //this.getPaymentRpt();
  }

  getParkingsRpt(initDate: string, endDate: string) {
    if (endDate < initDate) {
      this.messageService.error(
        '',
        'La fecha de inicio debe ser mayor a la fecha fin'
      )
      return
    }
    this.startDateReport = new Date(initDate + 'T00:00:00').toLocaleDateString('es-GT')
    this.endDateReport = new Date(endDate + 'T00:00:00').toLocaleDateString('es-GT')
    this.parqueo = this.datosUsuarioLogeado.id
    if (this.ifHaveAction('verTodosLosParqueosReport')) {
      this.parqueo = this.inputParking.nativeElement.value
    }
    this.parqueoDetalle = this.parqueo
    return this.reportService
      .getParkingRpt(initDate, endDate, this.parqueo)
      .toPromise()
      .then((data) => {
        if (data.success) {
          this.report = data.data
          this.dataSource = data.data
          if (this.report.length == 0) {
            this.messageService.infoTimeOut('No se encontraron datos')
          }
          this.rerender()
        } else {
          this.messageService.error('', data.message)
        }
      })
      .then(() => {
        this.messageService.hideLoading()
      })
  }

  ngAfterViewInit() {
    this.dtTrigger.next()
    this.parqueo = this.datosUsuarioLogeado.id
    if (this.ifHaveAction('verTodosLosParqueosReport')) {
      this.parqueo = '0'
    }
    this.parqueoDetalle = this.parqueo
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
      doc.save('TicketMensuak.pdf')
    })
  }

  onExporting(e: any) {
    if (this.report.length == 0) {
      this.messageService.infoTimeOut('No hay información para exportar')
      return
    }
    const header = [
      '',
      'Nombre',
      'Apellido',
      'Nombre completo',
      'Email',
      'Género',
      'Teléfono',
      'Entrada',
      'Salida',
      'Estación de entrada',
      'Estación de salida',
      'Tipo de entrada',
    ]
    //Create workbook and worksheet
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('ebiGO Mensual')
    //Add Row and formatting
    worksheet.addRow([])

    const busienssRow = worksheet.addRow(['', '', '', 'ebiGO'])
    busienssRow.font = {name: 'Calibri', family: 4, size: 11, bold: true}
    busienssRow.alignment = {horizontal: 'center', vertical: 'middle'}
    busienssRow.eachCell((cell, number) => {
      if (number > 1) {
        cell.border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        }
      }
    })
    worksheet.mergeCells('D2:F3')
    let ParqueoReporte = 'Todos los parqueos'
    if (this.parqueo != '0') {
      const parqueoEncontrado = this.allParking.find(
        (parqueos) => parqueos.id == this.parqueo
      )
      if (parqueoEncontrado) {
        ParqueoReporte = parqueoEncontrado.name
      }
    }
    const addressRow = worksheet.addRow(['', '', '', ParqueoReporte])
    addressRow.font = {name: 'Calibri', family: 4, size: 11, bold: true}
    addressRow.alignment = {horizontal: 'center', vertical: 'middle'}
    addressRow.eachCell((cell, number) => {
      if (number > 1) {
        cell.border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        }
      }
    })
    worksheet.mergeCells('D4:F5')
    const titleRow = worksheet.addRow(['', '', '', 'Reporte - ebiGO Mensual'])
    titleRow.font = {name: 'Calibri', family: 4, size: 11, bold: true}
    titleRow.alignment = {horizontal: 'center', vertical: 'middle'}
    titleRow.eachCell((cell, number) => {
      if (number > 1) {
        cell.border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        }
      }
    })
    worksheet.mergeCells('D6:F8')
    //Add Image
    worksheet.mergeCells('B2:C8')
    const logo = workbook.addImage({
      base64: logoFile.logoBase64,
      extension: 'png'
    })
    worksheet.addImage(logo, 'B3:C6')
    worksheet.addRow([])
    const infoRow = worksheet.addRow(['', 'Información General'])
    infoRow.font = {name: 'Calibri', family: 4, size: 11, bold: true}
    infoRow.alignment = {horizontal: 'center', vertical: 'middle'}
    infoRow.eachCell((cell, number) => {
      if (number > 1) {
        cell.border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        }
      }
    })
    worksheet.mergeCells('B10:F11')
    worksheet.addRow([])
    const header1 = worksheet.addRow([
      '',
      'Fecha Inicio: ' + this.startDateReport,
      '',
      '',
      'Fecha Fin: ' + this.endDateReport
    ])
    header1.eachCell((cell, number) => {
      if (number > 1) {
        cell.border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        }
      }
    })
    worksheet.mergeCells('B13:D14')
    worksheet.mergeCells('E13:F14')
    const header2 = worksheet.addRow([
      '',
      'Total de días con ingreso: ' + this.dataSource.length,
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
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        }
      }
    })
    worksheet.mergeCells('B15:D16')
    worksheet.mergeCells('E15:F16')
    worksheet.addRow([])
    const headerRow = worksheet.addRow(header)

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      if (number > 1) {
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
        '',
        d.user?.name ?? '',
        d.user?.last_name ?? '',
        `${d.user?.name ?? ''} ${d.user?.last_name ?? ''}`,
        d.user?.email ?? '',
        d.user?.gender == 2 ? 'Masculino' : 'Femenino',
        d.user?.phone_number ?? '',
        new Date(d.entry_date).toLocaleString('es-GT') ?? '',
        new Date(d.exit_date).toLocaleString('es-GT') ?? '',
        d.entry_station?.name ? d.entry_station?.name : '',
        d.exit_station?.name ? d.exit_station?.name : '',
        d.type == 1 ? 'ebiGo Ticket' : 'ebiGo Mensual'
      ])
    })
    worksheet.addRow([])
    worksheet.addRow([])
    worksheet.addRow([])
    worksheet.getColumn(2).width = 20
    worksheet.getColumn(3).width = 20
    worksheet.getColumn(4).width = 20
    worksheet.getColumn(5).width = 35
    worksheet.getColumn(6).width = 20
    worksheet.getColumn(7).width = 20
    worksheet.getColumn(8).width = 20
    worksheet.getColumn(9).width = 20
    worksheet.getColumn(10).width = 20
    worksheet.getColumn(11).width = 20
    worksheet.getColumn(12).width = 20

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      saveAs(blob, `Entradas ebiGo Mensual Generado ${new Date().toLocaleString()}.xlsx`)
    })
    e.cancel = true
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
