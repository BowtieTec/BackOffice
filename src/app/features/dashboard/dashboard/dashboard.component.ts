import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { environment } from '../../../../environments/environment'
import { PermissionsService } from '../../../shared/services/permissions.service'
import { ParkingService } from '../../parking/services/parking.service'
import { ParkingModel } from '../../parking/models/Parking.model'
import { AuthService } from '../../../shared/services/auth.service'
import { MessageService } from '../../../shared/services/message.service'
import { ParkingAuthModel } from '../../../shared/model/UserResponse.model'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  nowDateTime = new Date()
  ingresos = 'Ingresos'
  flujo = 'Flujo'
  cortesias = 'Cortesias'
  cortesiasEstacionarias = 'CortesiasEstacionarias'

  graficosIngresoVehiculos = environment.graficosIngresoVehiculos
  graficosFlujoDinero = environment.graficosFlujoDinero
  graficosCortesias = environment.graficosCortesias
  graficosCortesiasEstacionarias = environment.graficosCortesiasEstacionarias
  verTodosLosParqueosDashboard = environment.verTodosLosParqueosDashboard
  allParking: ParkingModel[] = Array<ParkingModel>()

  //Parametros componente gráfica
  //Por día
  periodoDia = 'dia'
  fechaIngresosDia = new Date().toISOString().split('T')[0]
  fechaFlujoDia = new Date().toISOString().split('T')[0]
  fechaCortesiasDia = new Date().toISOString().split('T')[0]
  fechaCortesiasEstacionariasDia = new Date().toISOString().split('T')[0]

  parqueoIngresosDia = '0'
  parqueoFlujoDia = '0'
  parqueoCortesiasDia = '0'
  parqueoCortesiasEstacionariasDia = '0'

  @ViewChild('inputParkingIngresoDia') inputParkingIngresoDia!: ElementRef
  @ViewChild('inputParkingFlujoDia') inputParkingFlujoDia!: ElementRef
  @ViewChild('inputFechaIngresoDia') inputFechaIngresoDia!: ElementRef
  @ViewChild('inputFechaFlujoDia') inputFechaFlujoDia!: ElementRef
  @ViewChild('inputFechaCortesiasDia') inputFechaCortesiasDia!: ElementRef
  @ViewChild('inputFechaCortesiasEstacionariasDia')
  inputFechaCortesiasEstacionariasDia!: ElementRef

  //Por mes
  periodoMes = 'mes'
  fechaIngresosMes = new Date().toISOString().split('T')[0]
  fechaFlujoMes = new Date().toISOString().split('T')[0]
  fechaCortesiasMes = new Date().toISOString().split('T')[0]
  fechaCortesiasEstacionariasMes = new Date().toISOString().split('T')[0]

  parqueoIngresosMes = '0'
  parqueoFlujoMes = '0'
  parqueoCortesiasMes = '0'
  parqueoCortesiasEstacionariasMes = '0'

  @ViewChild('inputParkingIngresoMes') inputParkingIngresoMes!: ElementRef
  @ViewChild('inputParkingFlujoMes') inputParkingFlujoMes!: ElementRef

  @ViewChild('inputIngresoMesAnio') inputIngresoMesAnio!: ElementRef
  @ViewChild('inputIngresoMes') inputIngresoMes!: ElementRef
  @ViewChild('inputFlujoMesAnio') inputFlujoMesAnio!: ElementRef
  @ViewChild('inputFlujoMes') inputFlujoMes!: ElementRef
  @ViewChild('inputCortesiasMesAnio') inputCortesiasMesAnio!: ElementRef
  @ViewChild('inputCortesiasEstacionariasMesAnio')
  inputCortesiasEstacionariasMesAnio!: ElementRef
  @ViewChild('inputCortesiasMes') inputCortesiasMes!: ElementRef
  @ViewChild('inputCortesiasEstacionariasMes')
  inputCortesiasEstacionariasMes!: ElementRef

  //Por año
  periodoAnio = 'anio'
  fechaIngresosAnio = new Date().toISOString().split('T')[0]
  fechaFlujoAnio = new Date().toISOString().split('T')[0]
  fechaCortesiasAnio = new Date().toISOString().split('T')[0]
  fechaCortesiasEstacionariasAnio = new Date().toISOString().split('T')[0]

  parqueoIngresosAnio = '0'
  parqueoFlujoAnio = '0'
  parqueoCortesiasAnio = '0'
  parqueoCortesiasEstacionariasAnio = '0'

  @ViewChild('inputParkingIngresoAnio') inputParkingIngresoAnio!: ElementRef
  @ViewChild('inputParkingFlujoAnio') inputParkingFlujoAnio!: ElementRef

  @ViewChild('inputIngresoAnio') inputIngresoAnio!: ElementRef
  @ViewChild('inputFlujoAnio') inputFlujoAnio!: ElementRef
  @ViewChild('inputCortesiasAnio') inputCortesiasAnio!: ElementRef
  @ViewChild('inputCortesiasEstacionariasAnio')
  inputCortesiasEstacionariasAnio!: ElementRef

  MesActual = new Date().toISOString().split('T')[0].split('-')[1]
  AnioActual: any = +new Date().toISOString().split('T')[0].split('-')[0]
  monthFiltered: any[] = []
  allMonths = [
    { key: '01', valor: 'Enero' },
    { key: '02', valor: 'Febrero' },
    { key: '03', valor: 'Marzo' },
    { key: '04', valor: 'Abril' },
    { key: '05', valor: 'Mayo' },
    { key: '06', valor: 'Junio' },
    { key: '07', valor: 'Julio' },
    { key: '08', valor: 'Agosto' },
    { key: '09', valor: 'Septiembre' },
    { key: '10', valor: 'Octubre' },
    { key: '11', valor: 'Noviembre' },
    { key: '12', valor: 'Diciembre' }
  ]
  AniosSelect: any[] = []

  idTabActiva = 'ingresos'
  tipoIngresos = 'bar'
  tipoFlujo = 'line'
  tipoCortesias = 'bar'
  tipoCortesiasEstacionarias = 'bar'

  datosUsuarioLogeado: ParkingAuthModel = new ParkingAuthModel()

  constructor(
    private auth: AuthService,
    private permissionService: PermissionsService,
    private parkingService: ParkingService,
    private messageService: MessageService
  ) {
    if (this.ifHaveAction('graficosIngresoVehiculos')) {
      this.idTabActiva = 'ingresos'
    } else if (this.ifHaveAction('graficosFlujoDinero')) {
      this.idTabActiva = 'flujo'
    } else if (this.ifHaveAction('graficosCortesias')) {
      this.idTabActiva = 'cortesias'
    } else if (this.ifHaveAction('graficosCortesiasEstacionarias')) {
      this.idTabActiva = 'cortesiasEstacionarias'
    }
    for (let iAnio = this.AnioActual - 5; iAnio <= this.AnioActual; iAnio++) {
      this.AniosSelect.push({
        key: iAnio,
        valor: iAnio
      })
    }
    this.monthFiltered = this.allMonths.filter(
      (x) => Number(x.key) <= new Date().getMonth() + 1
    )
  }

  ngOnInit(): void {
    this.messageService.showLoading()
    this.parkingService.parkingLot$.subscribe((parkingLot) => {
      this.allParking= parkingLot
    })
    /*this.auth.user$.subscribe(({ user, parkingId }) => {

      if(this.inputParkingIngresoDia.nativeElement && this.inputParkingFlujoDia.nativeElement && this.inputParkingFlujoMes.nativeElement){
        this.inputParkingFlujoAnio.nativeElement.value = parkingId
        this.inputParkingFlujoDia.nativeElement.value = parkingId
        this.inputParkingFlujoMes.nativeElement.value = parkingId
        this.inputParkingIngresoAnio.nativeElement.value = parkingId
        this.inputParkingIngresoMes.nativeElement.value = parkingId
        this.inputParkingIngresoDia.nativeElement.value = parkingId
      }
      this.datosUsuarioLogeado = user.parking
      if (this.idTabActiva == 'Ingresos') {
        this.searchMes(this.ingresos)
        this.searchAnio(this.ingresos)
        this.searchMes(this.ingresos)
      } else if (this.idTabActiva == 'Flujo') {
        this.searchDia(this.flujo)
        this.searchMes(this.flujo)
        this.searchAnio(this.flujo)
      } else if (this.idTabActiva == 'Cortesias') {
        this.searchDia(this.cortesias)
        this.searchMes(this.cortesias)
        this.searchAnio(this.cortesias)
      } else if (this.idTabActiva == 'CortesiasEstacionarias') {
        this.searchDia(this.cortesiasEstacionarias)
        this.searchMes(this.cortesiasEstacionarias)
        this.searchAnio(this.cortesiasEstacionarias)
      }
      this.messageService.hideLoading()
    })*/

  }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }

  searchDia(tipo: any) {
    if (tipo == this.ingresos) {
      this.fechaIngresosDia = this.inputFechaIngresoDia.nativeElement.value
      if (this.ifHaveAction('verTodosLosParqueosDashboard')) {
        this.parqueoIngresosDia =
          this.inputParkingIngresoDia.nativeElement.value
      } else {
        this.parqueoIngresosDia = this.datosUsuarioLogeado.id
      }
    }
    if (tipo == this.flujo) {
      this.fechaFlujoDia = this.inputFechaFlujoDia.nativeElement.value
      if (this.ifHaveAction('verTodosLosParqueosDashboard')) {
        this.parqueoFlujoDia = this.inputParkingFlujoDia.nativeElement.value
      } else {
        this.parqueoFlujoDia = this.datosUsuarioLogeado.id
      }
    }
    if (tipo == this.cortesias) {
      this.fechaCortesiasDia = this.inputFechaCortesiasDia.nativeElement.value
      this.parqueoCortesiasDia = this.datosUsuarioLogeado.id
    }
    if (tipo == this.cortesiasEstacionarias) {
      this.fechaCortesiasEstacionariasDia =
        this.inputFechaCortesiasEstacionariasDia.nativeElement.value
      this.parqueoCortesiasEstacionariasDia = this.datosUsuarioLogeado.id
    }
    return true
  }

  searchMes(tipo: any) {
    if (tipo == this.ingresos) {
      const anio = this.inputIngresoMesAnio.nativeElement.value
      const mes = this.inputIngresoMes.nativeElement.value
      const fecha = new Date(anio, mes - 1, 1).toISOString().split('T')[0]
      this.fechaIngresosMes = fecha
      if (this.ifHaveAction('verTodosLosParqueosDashboard')) {
        this.parqueoIngresosMes =
          this.inputParkingIngresoMes.nativeElement.value
      } else {
        this.parqueoIngresosMes = this.datosUsuarioLogeado.id
      }
    }
    if (tipo == this.flujo) {
      const anio = this.inputFlujoMesAnio.nativeElement.value
      const mes = this.inputFlujoMes.nativeElement.value
      const fecha = new Date(anio, mes - 1, 1).toISOString().split('T')[0]
      this.fechaFlujoMes = fecha
      if (this.ifHaveAction('verTodosLosParqueosDashboard')) {
        this.parqueoFlujoMes = this.inputParkingFlujoMes.nativeElement.value
      } else {
        this.parqueoFlujoMes = this.datosUsuarioLogeado.id
      }
    }
    if (tipo == this.cortesias) {
      const anio = this.inputCortesiasMesAnio.nativeElement.value
      const mes = this.inputCortesiasMes.nativeElement.value
      const fecha = new Date(anio, mes - 1, 1).toISOString().split('T')[0]
      this.fechaCortesiasMes = fecha
      this.parqueoCortesiasMes = this.datosUsuarioLogeado.id
    }
    if (tipo == this.cortesiasEstacionarias) {
      const anio = this.inputCortesiasEstacionariasMesAnio.nativeElement.value
      const mes = this.inputCortesiasEstacionariasMes.nativeElement.value
      const fecha = new Date(anio, mes - 1, 1).toISOString().split('T')[0]
      this.fechaCortesiasEstacionariasMes = fecha
      this.parqueoCortesiasEstacionariasMes = this.datosUsuarioLogeado.id
    }
    return true
  }

  searchAnio(tipo: any) {
    if (tipo == this.ingresos) {
      const anio = this.inputIngresoAnio.nativeElement.value
      const fecha = new Date(anio, 0, 1).toISOString().split('T')[0]
      this.fechaIngresosAnio = fecha
      if (this.ifHaveAction('verTodosLosParqueosDashboard')) {
        this.parqueoIngresosAnio =
          this.inputParkingIngresoAnio.nativeElement.value
      } else {
        this.parqueoIngresosAnio = this.datosUsuarioLogeado.id
      }
    }
    if (tipo == this.flujo) {
      const anio = this.inputFlujoAnio.nativeElement.value
      const fecha = new Date(anio, 0, 1).toISOString().split('T')[0]
      this.fechaFlujoAnio = fecha
      if (this.ifHaveAction('verTodosLosParqueosDashboard')) {
        this.parqueoFlujoAnio = this.inputParkingFlujoAnio.nativeElement.value
      } else {
        this.parqueoFlujoAnio = this.datosUsuarioLogeado.id
      }
    }
    if (tipo == this.cortesias) {
      const anio = this.inputCortesiasAnio.nativeElement.value
      const fecha = new Date(anio, 0, 1).toISOString().split('T')[0]
      this.fechaCortesiasAnio = fecha
      this.parqueoCortesiasAnio = this.datosUsuarioLogeado.id
    }
    if (tipo == this.cortesiasEstacionarias) {
      const anio = this.inputCortesiasEstacionariasAnio.nativeElement.value
      const fecha = new Date(anio, 0, 1).toISOString().split('T')[0]
      this.fechaCortesiasEstacionariasAnio = fecha
      this.parqueoCortesiasEstacionariasAnio = this.datosUsuarioLogeado.id
    }
    return true
  }

  tabChanges(ids: string) {
    this.idTabActiva = ids
  }

  filterMonth() {
    const yearSelected = this.inputIngresoMesAnio.nativeElement.value
    if (yearSelected == new Date().getFullYear()) {
      this.monthFiltered = this.allMonths.filter(
        (x) => Number(x.key) <= Number(new Date().getMonth()) + 1
      )
    } else {
      this.monthFiltered = this.allMonths
    }
  }
}
