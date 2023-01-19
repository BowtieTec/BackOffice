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
import * as logoFile from '../logoEbi'
import {FormBuilder, FormGroup} from '@angular/forms'

export interface duration {
  duration: number
  vehicles: string
  apply_disc_vehic: string
  disc: number
  total_no_disc: number
}

@Component({
  selector: 'app-duration-report',
  templateUrl: './duration-report.component.html',
  styleUrls: ['./duration-report.component.css']
})
export class DurationReportComponent implements OnInit {
  //@ViewChild(DataTableDirective)
  @ViewChild(DxDataGridComponent, {static: false})
  dataGrid!: DxDataGridComponent
  dtElement!: DataTableDirective
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject()
  pdfTable!: ElementRef
  reportForm: FormGroup
  report: duration[] = []
  dataSource: any
  now = new Date()

  verTodosLosParqueosReport = environment.verTodosLosParqueosReport

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
    this.dtOptions = DataTableOptions.getSpanishOptions(10)
    this.authService.user$.subscribe(({parkingId}) => {
      this.reportForm.get('parkingId')?.setValue(parkingId)
      this.getReport()
    })
  }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }

  getReport() {
    const {startDate, endDate, parkingId} = this.reportForm.value
    let _startDate =
      new Date(startDate).toISOString().split('T')[0] + 'T00:00:00'
    let _endDate = new Date(endDate).toISOString().split('T')[0] + 'T23:59:59'
    if (endDate < startDate) {
      this.message.error(
        '',
        'La fecha de inicio debe ser mayor a la fecha fin'
      )
      return
    }
    this.message.showLoading()
    return this.reportService
      .getDurationRpt(_startDate, _endDate, parkingId)
      .toPromise()
      .then((data) => {
        if (data.success) {
          this.report = data.data
          this.dataSource = data.data
          this.rerender()
        } else {
          this.message.error('', data.message)
        }
      })
      .finally(() => {
        this.message.hideLoading()
      })
  }

  onExporting(e: any) {
    if (this.report.length == 0) {
      this.message.infoTimeOut('No hay información para exportar')
      return
    }
    const {startDate, endDate, parkingId} = this.reportForm.value
    let _startDate =
      new Date(startDate).toISOString().split('T')[0] + 'T00:00:00'
    let _endDate = new Date(endDate).toISOString().split('T')[0] + 'T23:59:59'
    const header = [
      '',
      'Duración',
      'No. vehículos',
      'Porcentaje (%)',
      'Aplicaron descuento',
      'Descuento (Q)',
      'Total sin descuento (Q)'
    ]
    //Create workbook and worksheet
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Duración en parqueo')
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
    worksheet.mergeCells('D2:G3')
    const addressRow = worksheet.addRow(['', '', '', this.authService.getParking().name])
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
    worksheet.mergeCells('D4:G5')
    const titleRow = worksheet.addRow([
      '',
      '',
      '',
      'Reporte - Duración en parqueo'
    ])
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
    worksheet.mergeCells('B10:G11')
    worksheet.addRow([])
    const header1 = worksheet.addRow([
      '',
      'Fecha Inicio: ' + new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)).toLocaleDateString(),
      '',
      '',
      'Fecha Fin: ' + new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)).toLocaleDateString()
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
    worksheet.mergeCells('E13:G14')
    const header2 = worksheet.addRow([
      '',
      'Total de vehiculos que ingresaron: ' + this.dataSource.length,
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
    worksheet.mergeCells('E15:G16')
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
        d.duracion,
        d.vehicles,
        Number(d.porcentaje) * 100,
        d.apply_disc_vehic,
        d.disc,
        d.total_no_disc
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

    worksheet.getColumn(2).width = 25
    worksheet.getColumn(3).width = 20
    worksheet.getColumn(4).width = 20
    worksheet.getColumn(5).width = 20
    worksheet.getColumn(6).width = 20
    worksheet.getColumn(7).width = 20
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      saveAs(
        blob,
        `Report de Duración - Generado - ${this.now.toLocaleString()}.xlsx`
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
      doc.save('Duracion.pdf')
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
