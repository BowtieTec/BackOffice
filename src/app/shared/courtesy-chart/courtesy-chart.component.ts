import {Component, Input, OnInit} from '@angular/core'
import {DashboardService} from '../services/dashboard.service'
import {CompaniesModel} from '../../features/management/components/users/models/companies.model'
import {CompaniesService} from '../../features/management/components/users/services/companies.service'
import {AuthService} from '../../shared/services/auth.service'
import {MessageService} from '../../shared/services/message.service'
import {ParkingAuthModel} from "../model/UserResponse.model";

@Component({
  selector: 'app-courtesy-chart',
  templateUrl: './courtesy-chart.component.html',
  styleUrls: ['./courtesy-chart.component.css']
})
export class CourtesyChartComponent implements OnInit {
  @Input() titulo = ''
  @Input() tituloVerde = ''
  @Input() textoGrande = ''
  @Input() valorMostrar = ''
  @Input() fecha = ''
  @Input() parking = ''
  @Input() periodo = 'dia'
  @Input() company = '0'
  @Input() tipo = ''
  allCompanies: CompaniesModel[] = []

  datosUsuarioLogeado: ParkingAuthModel = new ParkingAuthModel()
  options = {
    series: [],
    chart: {
      height: 250,
      width: '100%',
      type: 'pie',
      toolbar: {
        show: true,
        tools: {
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      }
    },
    colors: ['#415ba2', '#04ccae', '#ccac04', '#4804cc', '#cc0424', '#CC4D18'],
    labels: [],
    responsive: [
      {
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    legend: {
      show: true,
      floating: false,
      position: 'right',
      horizontalAlign: 'center'
    },
    title: {
      text: 'Cortesías por local',
      align: 'left'
    }
  }
  chartCortesiasLocal: any
  chartCortesiasTipo: any
  chartCortesiasEstado: any
  chartCortesiasTipoValor: any

  constructor(
    private auth: AuthService,
    private dashboardService: DashboardService,
    private companyService: CompaniesService,
    private message: MessageService
  ) {
  }

  ngOnChanges(): void {
    try {
      //if(this.parking!='0'){
      this.companyService
        .getCompanies(this.datosUsuarioLogeado.id)
        .toPromise()
        .then((x) => (this.allCompanies = x))
      //}
      const fecha = this.fecha
      const partesFecha = fecha.split('-')
      const mes = partesFecha[1]
      const anio = partesFecha[0]
      let startDate = this.fecha
      let endDate = this.fecha
      if (this.periodo == 'mes') {
        startDate = new Date(+anio, +mes - 1, 1).toISOString().split('T')[0]
        endDate = new Date(+anio, +mes, 0).toISOString().split('T')[0]
      }
      if (this.periodo == 'anio') {
        startDate = new Date(+anio, 0, 1).toISOString().split('T')[0]
        endDate = new Date(+anio, 11, 31).toISOString().split('T')[0]
      }
      if (this.tipo === 'Cortesias') {
        this.getCompanyCourtesiesData(this.parking, startDate, endDate)
        this.getCompanyCourtesiesTypePerDate(
          this.parking,
          this.company,
          startDate,
          endDate
        )
        this.getCompanyCourtesiesStatusPerDate(
          this.parking,
          this.company,
          startDate,
          endDate
        )
        this.getCompanyCourtesiesTypeValuePerDate(
          this.parking,
          this.company,
          startDate,
          endDate
        )
      }
      if (this.tipo === 'CortesiasEstacionarias') {
        this.getCompanyCourtesiesStationData(this.parking, startDate, endDate)
        this.getCompanyCourtesiesStationTypePerDate(
          this.parking,
          this.company,
          startDate,
          endDate
        )
        this.getCompanyCourtesiesStationStatusPerDate(
          this.parking,
          this.company,
          startDate,
          endDate
        )
        this.getCompanyCourtesiesStationTypeValuePerDate(
          this.parking,
          this.company,
          startDate,
          endDate
        )
      }
    } catch (err: any) {
      this.message.error('', err.message)
    }
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.datosUsuarioLogeado = user.user.parking
    })
    try {
      if (this.parking != '0') {
        this.companyService
          .getCompanies(this.datosUsuarioLogeado.id)
          .toPromise()
          .then((x) => (this.allCompanies = x))
      }
      this.chartCortesiasLocal = new ApexCharts(
        document.querySelector(
          '.' + this.tipo + ' #' + this.periodo + ' #graficaCortesiasLocal'
        ),
        this.options
      )
      this.chartCortesiasLocal.render()
      this.chartCortesiasLocal.updateOptions({
        title: {
          text: 'Cortesias por local'
        }
      })

      this.chartCortesiasTipo = new ApexCharts(
        document.querySelector(
          '.' + this.tipo + ' #' + this.periodo + ' #graficaCortesiasTipo'
        ),
        this.options
      )
      this.chartCortesiasTipo.render()
      this.chartCortesiasTipo.updateOptions({
        title: {
          text: 'Cortesias por tipo'
        }
      })

      this.chartCortesiasEstado = new ApexCharts(
        document.querySelector(
          '.' + this.tipo + ' #' + this.periodo + ' #graficaCortesiasEstado'
        ),
        this.options
      )
      this.chartCortesiasEstado.render()
      this.chartCortesiasEstado.updateOptions({
        title: {
          text: 'Cortesias por estado'
        }
      })

      this.chartCortesiasTipoValor = new ApexCharts(
        document.querySelector(
          '.' + this.tipo + ' #' + this.periodo + ' #graficaCortesiasTipoValor'
        ),
        this.options
      )
      this.chartCortesiasTipoValor.render()
      this.chartCortesiasTipoValor.updateOptions({
        title: {
          text: 'Cortesias por tipo y valor'
        }
      })
    } catch (err: any) {
      this.message.error('', err.message)
    }
  }

  getCompanyCourtesiesData(
    parkingId: string,
    startDate: string,
    endDate: string
  ) {
    return this.dashboardService
      .getCompanyCourtesiesPerDate(parkingId, startDate, endDate)
      .toPromise()
      .then((data) => {
        if (data) {
          const seriesData: any[] = []
          const labelsData: any[] = []
          data.forEach((element: any) => {
            const cantidadTmp = +element.totalCourtesies
            seriesData.push(cantidadTmp)
            labelsData.push(element.com_name)
          })
          this.chartCortesiasLocal.updateOptions({
            labels: labelsData,
            series: seriesData
          })
        }
      })
  }

  getCompanyCourtesiesTypePerDate(
    parkingId: string,
    companyId: string,
    startDate: string,
    endDate: string
  ) {
    return this.dashboardService
      .getCompanyCourtesiesTypePerDate(parkingId, companyId, startDate, endDate)
      .toPromise()
      .then((data) => {
        if (data) {
          const seriesData: any[] = []
          const labelsData: any[] = []
          data.forEach((element: any) => {
            const cantidadTmp = +element.totalCourtesies
            seriesData.push(cantidadTmp)
            labelsData.push(element.cd_type)
          })
          this.chartCortesiasTipo.updateOptions({
            labels: labelsData,
            series: seriesData
          })
        }
      })
  }

  getCompanyCourtesiesStatusPerDate(
    parkingId: string,
    companyId: string,
    startDate: string,
    endDate: string
  ) {
    return this.dashboardService
      .getCompanyCourtesiesStatusPerDate(
        parkingId,
        companyId,
        startDate,
        endDate
      )
      .toPromise()
      .then((data) => {
        if (data) {
          const seriesData: any[] = []
          const labelsData: any[] = []
          data.forEach((element: any) => {
            const transaccionesTmp = +element.transacciones
            seriesData.push(transaccionesTmp)
            labelsData.push('Transacciones')
            const disponiblesTmp = +element.disponibles
            seriesData.push(disponiblesTmp)
            labelsData.push('Disponibles')
          })
          this.chartCortesiasEstado.updateOptions({
            labels: labelsData,
            series: seriesData
          })
        }
      })
  }

  getCompanyCourtesiesTypeValuePerDate(
    parkingId: string,
    companyId: string,
    startDate: string,
    endDate: string
  ) {
    return this.dashboardService
      .getCompanyCourtesiesTypeValuePerDate(
        parkingId,
        companyId,
        startDate,
        endDate
      )
      .toPromise()
      .then((data) => {
        if (data) {
          const seriesData: any[] = []
          const labelsData: any[] = []
          data.forEach((element: any) => {
            const cantidadTmp = +element.totalCourtesies
            seriesData.push(cantidadTmp)
            labelsData.push(element.cd_type)
          })
          this.chartCortesiasTipoValor.updateOptions({
            labels: labelsData,
            series: seriesData
          })
        }
      })
  }

  getCompanyCourtesiesStationData(
    parkingId: string,
    startDate: string,
    endDate: string
  ) {
    return this.dashboardService
      .getCompanyCourtesiesStationPerDate(parkingId, startDate, endDate)
      .toPromise()
      .then((data) => {
        if (data) {
          const seriesData: any[] = []
          const labelsData: any[] = []
          data.forEach((element: any) => {
            const cantidadTmp = +element.totalCourtesies
            seriesData.push(cantidadTmp)
            labelsData.push(element.com_name)
          })
          this.chartCortesiasLocal.updateOptions({
            labels: labelsData,
            series: seriesData
          })
        }
      })
  }

  getCompanyCourtesiesStationTypePerDate(
    parkingId: string,
    companyId: string,
    startDate: string,
    endDate: string
  ) {
    return this.dashboardService
      .getCompanyCourtesiesStationTypePerDate(
        parkingId,
        companyId,
        startDate,
        endDate
      )
      .toPromise()
      .then((data) => {
        if (data) {
          const seriesData: any[] = []
          const labelsData: any[] = []
          data.forEach((element: any) => {
            const cantidadTmp = +element.totalCourtesies
            seriesData.push(cantidadTmp)
            labelsData.push(element.cd_type)
          })
          this.chartCortesiasTipo.updateOptions({
            labels: labelsData,
            series: seriesData
          })
        }
      })
  }

  getCompanyCourtesiesStationStatusPerDate(
    parkingId: string,
    companyId: string,
    startDate: string,
    endDate: string
  ) {
    return this.dashboardService
      .getCompanyCourtesiesStationStatusPerDate(
        parkingId,
        companyId,
        startDate,
        endDate
      )
      .toPromise()
      .then((data) => {
        if (data) {
          const seriesData: any[] = []
          const labelsData: any[] = []
          data.forEach((element: any) => {
            const transaccionesTmp = +element.transacciones
            seriesData.push(transaccionesTmp)
            labelsData.push('Transacciones')
            const disponiblesTmp = +element.disponibles
            seriesData.push(disponiblesTmp)
            labelsData.push('Disponibles')
          })
          this.chartCortesiasEstado.updateOptions({
            labels: labelsData,
            series: seriesData
          })
        }
      })
  }

  getCompanyCourtesiesStationTypeValuePerDate(
    parkingId: string,
    companyId: string,
    startDate: string,
    endDate: string
  ) {
    return this.dashboardService
      .getCompanyCourtesiesStationTypeValuePerDate(
        parkingId,
        companyId,
        startDate,
        endDate
      )
      .toPromise()
      .then((data) => {
        if (data) {
          const seriesData: any[] = []
          const labelsData: any[] = []
          data.forEach((element: any) => {
            const cantidadTmp = +element.totalCourtesies
            seriesData.push(cantidadTmp)
            labelsData.push(element.cd_type)
          })
          this.chartCortesiasTipoValor.updateOptions({
            labels: labelsData,
            series: seriesData
          })
        }
      })
  }

  onChangeType(selecteValue: any) {
    const fecha = this.fecha
    const partesFecha = fecha.split('-')
    const mes = partesFecha[1]
    const anio = partesFecha[0]
    let startDate = this.fecha
    let endDate = this.fecha
    if (this.periodo == 'mes') {
      startDate = new Date(+anio, +mes - 1, 1).toISOString().split('T')[0]
      endDate = new Date(+anio, +mes, 0).toISOString().split('T')[0]
    }
    if (this.periodo == 'anio') {
      startDate = new Date(+anio, 0, 1).toISOString().split('T')[0]
      endDate = new Date(+anio, 11, 31).toISOString().split('T')[0]
    }
    if (this.tipo === 'Cortesias') {
      this.getCompanyCourtesiesTypePerDate(
        this.parking,
        selecteValue,
        startDate,
        endDate
      )
    }
    if (this.tipo === 'CortesiasEstacionarias') {
      this.getCompanyCourtesiesStationTypePerDate(
        this.parking,
        selecteValue,
        startDate,
        endDate
      )
    }
  }

  onChangeStatus(selecteValue: any) {
    const fecha = this.fecha
    const partesFecha = fecha.split('-')
    const mes = partesFecha[1]
    const anio = partesFecha[0]
    let startDate = this.fecha
    let endDate = this.fecha
    if (this.periodo == 'mes') {
      startDate = new Date(+anio, +mes - 1, 1).toISOString().split('T')[0]
      endDate = new Date(+anio, +mes, 0).toISOString().split('T')[0]
    }
    if (this.periodo == 'anio') {
      startDate = new Date(+anio, 0, 1).toISOString().split('T')[0]
      endDate = new Date(+anio, 11, 31).toISOString().split('T')[0]
    }
    if (this.tipo === 'Cortesias') {
      this.getCompanyCourtesiesStatusPerDate(
        this.parking,
        selecteValue,
        startDate,
        endDate
      )
    }
    if (this.tipo === 'CortesiasEstacionarias') {
      this.getCompanyCourtesiesStationStatusPerDate(
        this.parking,
        selecteValue,
        startDate,
        endDate
      )
    }
  }

  onChangeTypeValue(selecteValue: any) {
    const fecha = this.fecha
    const partesFecha = fecha.split('-')
    const mes = partesFecha[1]
    const anio = partesFecha[0]
    let startDate = this.fecha
    let endDate = this.fecha
    if (this.periodo == 'mes') {
      startDate = new Date(+anio, +mes - 1, 1).toISOString().split('T')[0]
      endDate = new Date(+anio, +mes, 0).toISOString().split('T')[0]
    }
    if (this.periodo == 'anio') {
      startDate = new Date(+anio, 0, 1).toISOString().split('T')[0]
      endDate = new Date(+anio, 11, 31).toISOString().split('T')[0]
    }
    if (this.tipo === 'Cortesias') {
      this.getCompanyCourtesiesTypeValuePerDate(
        this.parking,
        selecteValue,
        startDate,
        endDate
      )
    }
    if (this.tipo === 'CortesiasEstacionarias') {
      this.getCompanyCourtesiesStationTypeValuePerDate(
        this.parking,
        selecteValue,
        startDate,
        endDate
      )
    }
  }
}
