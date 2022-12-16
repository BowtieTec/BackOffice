import {Component, ElementRef, OnInit} from '@angular/core'
import {DxDataGridComponent} from 'devextreme-angular'
import {DataTableDirective} from 'angular-datatables'
import {Subject} from 'rxjs'
import {FormBuilder, FormGroup} from '@angular/forms'
import {AuthService} from '../../../../shared/services/auth.service'
import {ParkingService} from '../../../parking/services/parking.service'
import {PermissionsService} from '../../../../shared/services/permissions.service'
import {MessageService} from '../../../../shared/services/message.service'
import {ReportService} from '../service/report.service'
import {Workbook} from 'exceljs'
import * as logoFile from '../logoEbi'
import {saveAs} from 'file-saver'

@Component({
  selector: 'app-transit-detail-report',
  templateUrl: './transit-detail-report.component.html',
  styleUrls: ['./transit-detail-report.component.css']
})
export class TransitDetailReportComponent implements OnInit {
  dataGrid!: DxDataGridComponent
  dtElement!: DataTableDirective
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject()
  pdfTable!: ElementRef
  reportForm: FormGroup
  formGroup: FormGroup
  dataSource: any
  now: Date = new Date()

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private message: MessageService,
    private parkingService: ParkingService,
    private permissionService: PermissionsService,
    private reportService: ReportService
  ) {
    this.formGroup = formBuilder.group({filter: ['']})
    this.reportForm = this.createReportForm()
  }

  get isSudo() {
    return this.authService.isSudo
  }

  ngOnInit(): void {
    this.getReport()
    this.authService.user$.subscribe(({parkingId}) => {
      this.reportForm.get('parkingId')?.setValue(parkingId)
      this.getReport()
    })
  }

  getReport() {
    this.message.showLoading()
    const {startDate, endDate, parkingId} = this.reportForm.getRawValue()
    if (endDate < startDate) {
      this.message.error(
        '',
        'La fecha de fin debe ser mayor a la fecha de inicio'
      )
      return
    }
    this.reportService
      .getTransitDetailRpt(startDate, endDate, parkingId)
      .toPromise()
      .then((data) => {
        this.dataSource = data
      })
      .then(() => this.message.hideLoading())
  }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }

  onExporting(e: any) {
    const {startDate, endDate, parkingId} = this.reportForm.getRawValue()
    if (this.dataSource.length == 0) {
      this.message.infoTimeOut('No hay información para exportar')
      return
    }
    const header = [
      '',
      'Teléfono',
      'Ingreso',
      'Salida',
      'Tiempo estacionado',
      'Sub monto (Q)',
      'Descuento',
      'Total (Q)',
      'Tipo',
      'Cortesía',
      'Estado',
      'No. Factura',
      'No. Transacción',
      'Método de pago',
      'Estación de entrada',
      'Estación de salida'
    ]
    //Create workbook and worksheet
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Pagos por fecha')
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
    worksheet.mergeCells('D2:O3')
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
    worksheet.mergeCells('D4:O5')
    const titleRow = worksheet.addRow(['', '', '', 'Reporte - Pago de parqueo'])
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
    worksheet.mergeCells('B10:O11')
    worksheet.addRow([])
    const header1 = worksheet.addRow([
      '',
      'Fecha Inicio: ' + new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)).toLocaleDateString(),
      '',
      '',
      '',
      '',
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
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
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
        d.phone_key,
        d.entry_date,
        d.exit_date,
        d.timeIn,
        d.subtotal,
        d.discount,
        d.total,
        d.type,
        d.courtesy,
        d.status,
        d.invoice,
        d.transaction,
        d.typePayment,
        d.entry_station,
        d.exit_station
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
        `Reporte de tránsito - Generado - '${this.now.toLocaleString()}.xlsx`
      )
    })
    e.cancel = true
  }

  private createReportForm() {
    return this.formBuilder.group({
      startDate: [new Date()],
      endDate: [new Date()],
      parkingId: [this.authService.getParking().id]
    })
  }
}
