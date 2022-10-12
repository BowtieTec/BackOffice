import {AfterViewInit, Component, Input, OnInit} from '@angular/core'
import DataSource from 'devextreme/data/data_source'
import ArrayStore from 'devextreme/data/array_store'
import {ReportService} from '../../service/report.service'
import {Workbook} from 'exceljs'
import {saveAs} from 'file-saver'
import * as logoFile from '../../logoEbi'
import {ParkingModel} from '../../../../parking/models/Parking.model'
import {ParkingService} from '../../../../parking/services/parking.service'

@Component({
  selector: 'detail-grid',
  templateUrl: './detail-grid.component.html'
})
export class DetailGridComponent implements AfterViewInit, OnInit {
  @Input() key!: string
  @Input() parqueo = '0'

  tasksDataSource!: DataSource
  dataSource: any
  parqueDetalle: any

  allParking: ParkingModel[] = Array<ParkingModel>()
  task!: Task[]

  constructor(
    private reportService: ReportService,
    private parkingService: ParkingService
  ) {
  }

  ngAfterViewInit(): void {
    this.reportService
      .getTicketsDateRpt(this.key, this.parqueo)
      .toPromise()
      .then((data) => {
        if (data.success) {
          this.task = data.data
          this.dataSource = data.data
          this.parqueDetalle = this.parqueo
        }
      })
      .then(() => {
        this.tasksDataSource = new DataSource({
          store: new ArrayStore({
            data: this.task,
            key: 'fecha'
          })
        })
      })
  }

  onExporting(e: any) {
    const header = [
      '',
      'Fecha',
      'Codigo de cliente',
      'Total',
      'Descuento',
      'Pagado'
    ]
    //Create workbook and worksheet
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Detalle ebiGO Ticket')
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
    if (this.parqueDetalle != '0') {
      const parqueoEncontrado = this.allParking.find(
        (parqueos) => parqueos.id == this.parqueDetalle
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
    const titleRow = worksheet.addRow([
      '',
      '',
      '',
      'Reporte - Detalle ebiGO Ticket'
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
      'Fecha Inicio: ' + this.key,
      '',
      '',
      'Fecha Fin: ' + this.key
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
      new Date().toISOString().slice(0, 10) +
      ' ' +
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
        d.fecha ? new Date(d.fecha).toLocaleDateString() : ' ',
        d.phone_key,
        d.total,
        d.descuento,
        d.pagado
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

    worksheet.getColumn(2).width = 20
    worksheet.getColumn(3).width = 20
    worksheet.getColumn(4).width = 20
    worksheet.getColumn(5).width = 20
    worksheet.getColumn(6).width = 20

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      saveAs(blob, 'ReporteDetalleEbiGoTicket.xlsx')
    })
    e.cancel = true
  }

  ngOnInit(): void {
    this.parkingService.parkingLot$.subscribe((parkingLot) => {
      this.allParking = parkingLot
    })
  }
}
