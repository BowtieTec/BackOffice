import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import {CompaniesModel} from "../../features/management/components/users/models/companies.model";
import {CompaniesService} from "../../features/management/components/users/services/companies.service";
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-courtesy-chart',
  templateUrl: './courtesy-chart.component.html',
  styleUrls: ['./courtesy-chart.component.css'],
})
export class CourtesyChartComponent implements OnInit  {

  @Input() titulo = '';
  @Input() tituloVerde = '';
  @Input() textoGrande = '';
  @Input() valorMostrar = '';
  @Input() fecha = '';
  @Input() parking = '';
  @Input() periodo = 'dia';
  @Input() company = '0';
  allCompanies: CompaniesModel[] = [];

  datosUsuarioLogeado = this.auth.getParking();

  constructor(
    private auth: AuthService,
    private dashboardService: DashboardService,
    private companyService: CompaniesService){
  }

  options = {
    series: [],
    chart: {
      height: 250,
      width: '100%',
      type: 'pie',
      toolbar:{
        show: true,
        tools:{
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        }
      },
    },
    colors:['#415ba2','#04ccae','#ccac04','#4804cc','#cc0424','#CC4D18'],
  labels: [],
  responsive: [{
    options: {
      legend: {
        position: 'bottom'
      }
    }
  }],
  legend: {
    show: true,
    floating: false,
    position: 'right',
    horizontalAlign: 'center',
  },
  title: {
    text: 'Cortesías por local',
    align: 'left',
  },
  };

  chartCortesiasLocal: any;
  chartCortesiasTipo: any;
  chartCortesiasEstado: any;
  chartCortesiasTipoValor: any;
  
  ngOnChanges(): void{
    //if(this.parking!='0'){
    this.companyService.getCompanies(this.datosUsuarioLogeado.id).toPromise().then(x => this.allCompanies = x);
    //}
    let fecha = this.fecha;
    let partesFecha = fecha.split('-');
    let mes = partesFecha[1];
    let anio = partesFecha[0];
    let startDate = this.fecha;
    let endDate = this.fecha;
    if(this.periodo == 'mes'){
      startDate = new Date(+anio,+mes-1,1).toISOString().split('T')[0];
      endDate = new Date(+anio,+mes,0).toISOString().split('T')[0];
    }
    if(this.periodo == 'anio'){
      startDate = new Date(+anio,0,1).toISOString().split('T')[0];
      endDate = new Date(+anio,11,31).toISOString().split('T')[0];
    }
    this.getCompanyCourtesiesData(this.parking, startDate, endDate);
    this.getCompanyCourtesiesTypePerDate(this.parking, this.company, startDate, endDate);
    this.getCompanyCourtesiesStatusPerDate(this.parking, this.company, startDate, endDate);
    this.getCompanyCourtesiesTypeValuePerDate(this.parking, this.company, startDate, endDate);
  }
  
  ngOnInit(): void {
      if(this.parking!='0'){
        this.companyService.getCompanies(this.datosUsuarioLogeado.id).toPromise().then(x => this.allCompanies = x);
      }
      this.chartCortesiasLocal = new ApexCharts(document.querySelector('.Cortesias #'+this.periodo+' #graficaCortesiasLocal'), this.options);
      this.chartCortesiasLocal.render();
      this.chartCortesiasLocal.updateOptions({
        title:{
          text: 'Cortesias por local'
        }
      });

      this.chartCortesiasTipo = new ApexCharts(document.querySelector('.Cortesias #'+this.periodo+' #graficaCortesiasTipo'), this.options);
      this.chartCortesiasTipo.render();
      this.chartCortesiasTipo.updateOptions({
        title:{
          text: 'Cortesias por tipo'
        }
      });

      this.chartCortesiasEstado = new ApexCharts(document.querySelector('.Cortesias #'+this.periodo+' #graficaCortesiasEstado'), this.options);
      this.chartCortesiasEstado.render();
      this.chartCortesiasEstado.updateOptions({
        title:{
          text: 'Cortesias por estado'
        }
      });

      this.chartCortesiasTipoValor = new ApexCharts(document.querySelector('.Cortesias #'+this.periodo+' #graficaCortesiasTipoValor'), this.options);
      this.chartCortesiasTipoValor.render();
      this.chartCortesiasTipoValor.updateOptions({
        title:{
          text: 'Cortesias por tipo y valor'
        }
      });      
  }

  getCompanyCourtesiesData(parkingId: string, startDate: string, endDate: string){
    return this.dashboardService.getCompanyCourtesiesPerDate(parkingId, startDate, endDate)
    .toPromise()
    .then((data) => {
      if (data) {
        let seriesData: any[] = [];
        let labelsData: any[] = [];
        data.forEach((element:any) => {
          let cantidadTmp = +element.totalCourtesies;
          seriesData.push(cantidadTmp);
          labelsData.push(element.com_name);
        });
        this.chartCortesiasLocal.updateOptions({
          labels:labelsData,
          series:seriesData
        });
      } 
    });  
  }

  getCompanyCourtesiesTypePerDate(parkingId: string, companyId: string, startDate: string, endDate: string){
    return this.dashboardService.getCompanyCourtesiesTypePerDate(parkingId, companyId, startDate, endDate)
    .toPromise()
    .then((data) => {
      if (data) {
        let seriesData: any[] = [];
        let labelsData: any[] = [];
        data.forEach((element:any) => {
          let cantidadTmp = +element.totalCourtesies;
          seriesData.push(cantidadTmp);
          labelsData.push(element.cd_type);
        });
        this.chartCortesiasTipo.updateOptions({
          labels:labelsData,
          series:seriesData
        });
      } 
    });  
  }

  getCompanyCourtesiesStatusPerDate(parkingId: string, companyId: string, startDate: string, endDate: string){
    return this.dashboardService.  getCompanyCourtesiesStatusPerDate(parkingId, companyId, startDate, endDate)
    .toPromise()
    .then((data) => {
      if (data) {
        let seriesData: any[] = [];
        let labelsData: any[] = [];
        data.forEach((element:any) => {
          let transaccionesTmp = +element.transacciones;
          seriesData.push(transaccionesTmp);
          labelsData.push('Transacciones');
          let disponiblesTmp = +element.disponibles;
          seriesData.push(disponiblesTmp);
          labelsData.push('Disponibles');
        });
        this.chartCortesiasEstado.updateOptions({
          labels:labelsData,
          series:seriesData
        });
      } 
    });  
  }

  getCompanyCourtesiesTypeValuePerDate(parkingId: string, companyId: string, startDate: string, endDate: string){
    return this.dashboardService.getCompanyCourtesiesTypeValuePerDate(parkingId, companyId, startDate, endDate)
    .toPromise()
    .then((data) => {
      if (data) {
        let seriesData: any[] = [];
        let labelsData: any[] = [];
        data.forEach((element:any) => {
          let cantidadTmp = +element.totalCourtesies;
          seriesData.push(cantidadTmp);
          labelsData.push(element.cd_type);
        });
        this.chartCortesiasTipoValor.updateOptions({
          labels:labelsData,
          series:seriesData
        });
      } 
    });  
  }

  onChangeType(selecteValue: any){
    let fecha = this.fecha;
    let partesFecha = fecha.split('-');
    let mes = partesFecha[1];
    let anio = partesFecha[0];
    let startDate = this.fecha;
    let endDate = this.fecha;
    if(this.periodo == 'mes'){
      startDate = new Date(+anio,+mes-1,1).toISOString().split('T')[0];
      endDate = new Date(+anio,+mes,0).toISOString().split('T')[0];
    }
    if(this.periodo == 'anio'){
      startDate = new Date(+anio,0,1).toISOString().split('T')[0];
      endDate = new Date(+anio,11,31).toISOString().split('T')[0];
    }
    this.getCompanyCourtesiesTypePerDate(this.parking, selecteValue, startDate, endDate);
  }

  onChangeStatus(selecteValue: any){
    let fecha = this.fecha;
    let partesFecha = fecha.split('-');
    let mes = partesFecha[1];
    let anio = partesFecha[0];
    let startDate = this.fecha;
    let endDate = this.fecha;
    if(this.periodo == 'mes'){
      startDate = new Date(+anio,+mes-1,1).toISOString().split('T')[0];
      endDate = new Date(+anio,+mes,0).toISOString().split('T')[0];
    }
    if(this.periodo == 'anio'){
      startDate = new Date(+anio,0,1).toISOString().split('T')[0];
      endDate = new Date(+anio,11,31).toISOString().split('T')[0];
    }
    this.getCompanyCourtesiesStatusPerDate(this.parking, selecteValue, startDate, endDate);
  }

  onChangeTypeValue(selecteValue: any){
    let fecha = this.fecha;
    let partesFecha = fecha.split('-');
    let mes = partesFecha[1];
    let anio = partesFecha[0];
    let startDate = this.fecha;
    let endDate = this.fecha;
    if(this.periodo == 'mes'){
      startDate = new Date(+anio,+mes-1,1).toISOString().split('T')[0];
      endDate = new Date(+anio,+mes,0).toISOString().split('T')[0];
    }
    if(this.periodo == 'anio'){
      startDate = new Date(+anio,0,1).toISOString().split('T')[0];
      endDate = new Date(+anio,11,31).toISOString().split('T')[0];
    }
    this.getCompanyCourtesiesTypeValuePerDate(this.parking, selecteValue, startDate, endDate);
  }
}
