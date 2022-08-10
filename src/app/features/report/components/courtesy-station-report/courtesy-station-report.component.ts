import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { DataTableDirective } from 'angular-datatables'
import { Subject } from 'rxjs'
import { MessageService } from '../../../../shared/services/message.service'
import { DataTableOptions } from '../../../../shared/model/DataTableOptions'
import { ReportService } from '../service/report.service'
import { UtilitiesService } from '../../../../shared/services/utilities.service'
import { AuthService } from '../../../../shared/services/auth.service'
import { PermissionsService } from '../../../../shared/services/permissions.service'
import { environment } from 'src/environments/environment'
import { jsPDF } from 'jspdf'
import { DxDataGridComponent } from 'devextreme-angular'
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter'
import { Workbook } from 'exceljs'
import { saveAs } from 'file-saver'

import { ParkingService } from '../../../parking/services/parking.service'
import { ParkingModel } from '../../../parking/models/Parking.model'
import * as logoFile from '../logoEbi'
import { FormBuilder, FormGroup } from '@angular/forms'

export interface desc {
  fecha: Date
  total_v: number
  total: number
  descuento: number
  pagado: number
}

@Component({
  selector: 'app-courtesy-station-report',
  templateUrl: './courtesy-station-report.component.html',
  styleUrls: ['./courtesy-station-report.component.css']
})
export class CourtesyStationReportComponent implements OnInit {
  //@ViewChild(DataTableDirective)
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid!: DxDataGridComponent
  dtElement!: DataTableDirective
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject()
  pdfTable!: ElementRef
  reportForm: FormGroup
  report: desc[] = []
  dataSource: any
  now = new Date()
  allParking: ParkingModel[] = Array<ParkingModel>()
  verTodosLosParqueosReport = environment.verTodosLosParqueosReport
  @ViewChild('inputParking') inputParking!: ElementRef
  fechaActual = new Date().toISOString().split('T')[0]

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
    this.dtOptions = DataTableOptions.getSpanishOptions(10)

    this.authService.user$.subscribe(({ parkingId }) => {
      this.reportForm.get('parkingId')?.setValue(parkingId)
      this.getReport()
    })
    this.parkingService.parkingLot$.subscribe((parkingLot) => {
      this.allParking = [
        ...parkingLot,
        { id: '0', name: '-- Todos los parqueos --' }
      ]
    })
  }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }

  getReport() {
    const { startDate, endDate, parkingId } = this.reportForm.value
    let _startDate =
      new Date(startDate).toISOString().split('T')[0] + 'T00:00:00.000Z'
    let _endDate =
      new Date(endDate).toISOString().split('T')[0] + 'T23:59:59.999Z'
    if (endDate < startDate) {
      this.messageService.error(
        '',
        'La fecha de inicio debe ser mayor a la fecha fin'
      )
      return
    }
    return this.reportService
      .getCourtesyStationRpt(_startDate, _endDate, parkingId)
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
    const { startDate, endDate, parkingId } = this.reportForm.value
    const header = [
      '',
      'Cortesía',
      'Parqueo',
      'Local',
      'Tipo',
      'Cortesias',
      'Descuento',
      'Transacciones',
      'Disponibles',
      'Total descuento'
    ]
    //Create workbook and worksheet
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Cortesías Estacionarias')
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
    worksheet.mergeCells('D2:J3')
    let ParqueoReporte = 'Todos los parqueos'
    if (parkingId != '0') {
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
    worksheet.mergeCells('D4:J5')
    const titleRow = worksheet.addRow([
      '',
      '',
      '',
      'Reporte - Cortesias estacionarias'
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
    worksheet.mergeCells('D6:J8')
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
    worksheet.mergeCells('B10:J11')
    worksheet.addRow([])
    const header1 = worksheet.addRow([
      '',
      'Fecha Inicio: ' + new Date(startDate).toLocaleDateString(),
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
    worksheet.mergeCells('B13:E14')
    worksheet.mergeCells('F13:J14')
    const header2 = worksheet.addRow([
      '',
      'Total de cortesias: ' + this.dataSource.length,
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
    worksheet.mergeCells('B15:E16')
    worksheet.mergeCells('F15:J16')
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
        d.cs_name,
        d.parqueo,
        d.comercio,
        d.cd_type,
        d.cd_quantity,
        d.cd_value,
        d.transacciones,
        d.disponibles,
        d.total_descuento
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

    worksheet.getColumn(2).width = 25
    worksheet.getColumn(3).width = 20
    worksheet.getColumn(4).width = 20
    worksheet.getColumn(5).width = 20
    worksheet.getColumn(6).width = 20
    worksheet.getColumn(7).width = 20
    worksheet.getColumn(8).width = 25
    worksheet.getColumn(9).width = 25
    worksheet.getColumn(10).width = 15
    worksheet.getColumn(11).width = 15
    worksheet.getColumn(12).width = 15
    worksheet.getColumn(13).width = 15
    worksheet.getColumn(14).width = 15
    worksheet.getColumn(15).width = 15

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      saveAs(
        blob,
        `Reporte de uso de cortesías estacionarias Generado ${this.now.toLocaleDateString()}.xlsx`
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
      doc.save('Duracin.pdf')
    })
  }

  private createReportForm() {
    return this.formBuilder.group({
      startDate: [new Date()],
      endDate: [new Date()],
      parkingId: ['0']
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
