import {Component, Input, OnInit} from '@angular/core'
import {DashboardService} from '../services/dashboard.service'
import {AuthService} from '../../shared/services/auth.service'
import {CompaniesModel} from '../../features/management/components/users/models/companies.model'
import {CompaniesService} from '../../features/management/components/users/services/companies.service'

@Component({
  selector: 'app-card-kpi',
  templateUrl: './card-kpi.component.html',
  styleUrls: ['./card-kpi.component.css']
})
export class CardKpiComponent implements OnInit {
  @Input() titulo = ''
  @Input() tituloVerde = ''
  @Input() textoGrande = ''
  @Input() valorMostrar = ''
  @Input() fecha = ''
  @Input() periodo = 'dia'
  @Input() parking = '0'
  allCompanies: CompaniesModel[] = []
  datosUsuarioLogeado = this.auth.getParking()

  constructor(
    private auth: AuthService,
    private dashboardService: DashboardService,
    private companyService: CompaniesService
  ) {
  }

  ngOnInit(): void {
    //if(this.parking!='0'){
    this.companyService
      .getCompanies(this.datosUsuarioLogeado.id)
      .toPromise()
      .then((x) => (this.allCompanies = x))
    //}
  }

  ngOnChanges(): void {
    this.companyService
      .getCompanies(this.datosUsuarioLogeado.id)
      .toPromise()
      .then((x) => (this.allCompanies = x))
    const fecha = this.fecha
    const partesFecha = fecha.split('-')
    const mes = partesFecha[1]
    const anio = partesFecha[0]
    if (this.periodo == 'dia') {
      if (this.valorMostrar == 'TotalCortesias') {
        this.getDatosCortesiasDiarios(this.datosUsuarioLogeado.id, fecha, fecha)
      }
      if (this.valorMostrar == 'TotalLocales') {
        this.tituloVerde =
          this.allCompanies.length.toString() + ' locales en parqueo'
        this.getCompanyDailyCourtesiesData(
          this.datosUsuarioLogeado.id,
          fecha,
          fecha
        )
      }
      if (this.valorMostrar == 'LocalMasCortesias') {
        this.getMaxCompanyDailyCourtesiesData(
          this.datosUsuarioLogeado.id,
          fecha,
          fecha
        )
      }
      if (this.valorMostrar == 'TotalCortesiasEstacionarias') {
        this.getDatosCortesiasEstacionariasDiarios(
          this.datosUsuarioLogeado.id,
          fecha,
          fecha
        )
      }
      if (this.valorMostrar == 'TotalEstacionariasLocales') {
        this.tituloVerde =
          this.allCompanies.length.toString() + ' locales en parqueo'
        this.getCompanyDailyCourtesiesStationData(
          this.datosUsuarioLogeado.id,
          fecha,
          fecha
        )
      }
      if (this.valorMostrar == 'LocalMasCortesiasEstacionarias') {
        this.getMaxCompanyDailyCourtesiesStationData(
          this.datosUsuarioLogeado.id,
          fecha,
          fecha
        )
      }
    }
    if (this.periodo == 'mes') {
      const startDate = new Date(+anio, +mes - 1, 1).toISOString().split('T')[0]
      const endDate = new Date(+anio, +mes, 0).toISOString().split('T')[0]
      if (this.valorMostrar == 'TotalCortesias') {
        this.getDatosCortesiasDiarios(
          this.datosUsuarioLogeado.id,
          startDate,
          endDate
        )
      }
      if (this.valorMostrar == 'TotalLocales') {
        this.tituloVerde =
          this.allCompanies.length.toString() + ' locales en parqueo'
        this.getCompanyDailyCourtesiesData(
          this.datosUsuarioLogeado.id,
          startDate,
          endDate
        )
      }
      if (this.valorMostrar == 'LocalMasCortesias') {
        this.getMaxCompanyDailyCourtesiesData(
          this.datosUsuarioLogeado.id,
          startDate,
          endDate
        )
      }
      if (this.valorMostrar == 'TotalCortesiasEstacionarias') {
        this.getDatosCortesiasEstacionariasDiarios(
          this.datosUsuarioLogeado.id,
          startDate,
          endDate
        )
      }
      if (this.valorMostrar == 'TotalEstacionariasLocales') {
        this.tituloVerde =
          this.allCompanies.length.toString() + ' locales en parqueo'
        this.getCompanyDailyCourtesiesStationData(
          this.datosUsuarioLogeado.id,
          startDate,
          endDate
        )
      }
      if (this.valorMostrar == 'LocalMasCortesiasEstacionarias') {
        this.getMaxCompanyDailyCourtesiesStationData(
          this.datosUsuarioLogeado.id,
          startDate,
          endDate
        )
      }
    }
    if (this.periodo == 'anio') {
      const startDate = new Date(+anio, 0, 1).toISOString().split('T')[0]
      const endDate = new Date(+anio, 11, 31).toISOString().split('T')[0]
      if (this.valorMostrar == 'TotalCortesias') {
        this.getDatosCortesiasDiarios(
          this.datosUsuarioLogeado.id,
          startDate,
          endDate
        )
      }
      if (this.valorMostrar == 'TotalLocales') {
        this.tituloVerde =
          this.allCompanies.length.toString() + ' locales en parqueo'
        this.getCompanyDailyCourtesiesData(
          this.datosUsuarioLogeado.id,
          startDate,
          endDate
        )
      }
      if (this.valorMostrar == 'LocalMasCortesias') {
        this.getMaxCompanyDailyCourtesiesData(
          this.datosUsuarioLogeado.id,
          startDate,
          endDate
        )
      }
      if (this.valorMostrar == 'TotalCortesiasEstacionarias') {
        this.getDatosCortesiasEstacionariasDiarios(
          this.datosUsuarioLogeado.id,
          startDate,
          endDate
        )
      }
      if (this.valorMostrar == 'TotalEstacionariasLocales') {
        this.tituloVerde =
          this.allCompanies.length.toString() + ' locales en parqueo'
        this.getCompanyDailyCourtesiesStationData(
          this.datosUsuarioLogeado.id,
          startDate,
          endDate
        )
      }
      if (this.valorMostrar == 'LocalMasCortesiasEstacionarias') {
        this.getMaxCompanyDailyCourtesiesStationData(
          this.datosUsuarioLogeado.id,
          startDate,
          endDate
        )
      }
    }
  }

  getDatosCortesiasDiarios(
    parkingId: string,
    startDate: string,
    endDate: string
  ) {
    return this.dashboardService
      .getTotalCourtesiesPerDate(parkingId, startDate, endDate)
      .toPromise()
      .then((data) => {
        if (data) {
          this.textoGrande = '<h1>' + data[0].totalCourtesies + '</h1>'
        }
      })
  }

  getCompanyDailyCourtesiesData(
    parkingId: string,
    startDate: string,
    endDate: string
  ) {
    return this.dashboardService
      .getCompanyCourtesiesPerDate(parkingId, startDate, endDate)
      .toPromise()
      .then((data) => {
        this.tituloVerde =
          this.allCompanies.length.toString() + ' locales en parqueo'
        if (data) {
          this.textoGrande = '<h1>' + data.length + '</h1>'
        }
      })
  }

  getMaxCompanyDailyCourtesiesData(
    parkingId: string,
    startDate: string,
    endDate: string
  ) {
    return this.dashboardService
      .getCompanyCourtesiesPerDate(parkingId, startDate, endDate)
      .toPromise()
      .then((data) => {
        if (data) {
          let valorMaximo = 0
          let localMaximo = 'N/A'
          data.forEach((element: any) => {
            const cantidadTmp = +element.totalCourtesies
            if (cantidadTmp > valorMaximo) {
              valorMaximo = cantidadTmp
              localMaximo = element.com_name
            }
          })
          this.tituloVerde = 'Cortesias: ' + valorMaximo.toString()
          if (localMaximo.length >= 20) {
            this.textoGrande = '<h4>' + localMaximo + '</h4>'
          }
          if (localMaximo.length >= 15 && localMaximo.length < 20) {
            this.textoGrande = '<h3>' + localMaximo + '</h3>'
          }
          if (localMaximo.length >= 10 && localMaximo.length < 15) {
            this.textoGrande = '<h2>' + localMaximo + '</h2>'
          }
          if (localMaximo.length < 10) {
            this.textoGrande = '<h1>' + localMaximo + '</h1>'
          }
        }
      })
  }

  getDatosCortesiasEstacionariasDiarios(
    parkingId: string,
    startDate: string,
    endDate: string
  ) {
    return this.dashboardService
      .getTotalCourtesiesStationPerDate(parkingId, startDate, endDate)
      .toPromise()
      .then((data) => {
        if (data) {
          this.textoGrande = '<h1>' + data[0].totalCourtesies + '</h1>'
        }
      })
  }

  getCompanyDailyCourtesiesStationData(
    parkingId: string,
    startDate: string,
    endDate: string
  ) {
    return this.dashboardService
      .getCompanyCourtesiesStationPerDate(parkingId, startDate, endDate)
      .toPromise()
      .then((data) => {
        this.tituloVerde =
          this.allCompanies.length.toString() + ' locales en parqueo'
        if (data) {
          this.textoGrande = '<h1>' + data.length + '</h1>'
        }
      })
  }

  getMaxCompanyDailyCourtesiesStationData(
    parkingId: string,
    startDate: string,
    endDate: string
  ) {
    return this.dashboardService
      .getCompanyCourtesiesStationPerDate(parkingId, startDate, endDate)
      .toPromise()
      .then((data) => {
        if (data) {
          let valorMaximo = 0
          let localMaximo = 'N/A'
          data.forEach((element: any) => {
            const cantidadTmp = +element.totalCourtesies
            if (cantidadTmp > valorMaximo) {
              valorMaximo = cantidadTmp
              localMaximo = element.com_name
            }
          })
          this.tituloVerde = 'Cortesias: ' + valorMaximo.toString()
          if (localMaximo.length >= 20) {
            this.textoGrande = '<h4>' + localMaximo + '</h4>'
          }
          if (localMaximo.length >= 15 && localMaximo.length < 20) {
            this.textoGrande = '<h3>' + localMaximo + '</h3>'
          }
          if (localMaximo.length >= 10 && localMaximo.length < 15) {
            this.textoGrande = '<h2>' + localMaximo + '</h2>'
          }
          if (localMaximo.length < 10) {
            this.textoGrande = '<h1>' + localMaximo + '</h1>'
          }
        }
      })
  }
}
