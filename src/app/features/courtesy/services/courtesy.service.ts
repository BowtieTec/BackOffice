import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'
import { ResponseModel } from '../../../shared/model/Request.model'
import { CourtesyModel } from '../models/Courtesy.model'
import { SelectModel } from '../../../shared/model/CommonModels'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { MessageService } from '../../../shared/services/message.service'
import { ParkingModel } from '../../parking/models/Parking.model'

@Injectable({
  providedIn: 'root'
})
export class CourtesyService {
  private apiUrl = environment.serverAPI

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  get TypeOfConditions(): SelectModel[] {
    return environment.TypeOfCondition
  }

  get DiscountOnWhatOptions(): SelectModel[] {
    return environment.DiscountOnWhat
  }

  getTypes() {
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/cortesy/typeCortesies`
    )
  }

  getParkingForCourtesy(courtesyDetailId: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/cortesy/getParkingForCourtesy/${courtesyDetailId}`
      )
      .pipe(
        map((res) => {
          return res.data.map((item: ParkingModel) => {
            return {
              id: item.id,
              name: item.name
            }
          })
        })
      )
  }

  saveCourtesy(newCourtesy: CourtesyModel) {
    return this.http.post<ResponseModel>(
      `${this.apiUrl}backoffice/cortesy/create`,
      newCourtesy
    )
  }

  getTypeCourtesyDescription(type: number): string {
    return type == 0
      ? 'Valor de tarifa fija'
      : type == 1
      ? 'Porcentaje de descuento'
      : type == 2
      ? 'Valor de descuento'
      : type == 4
      ? 'Cantidad de horas'
      : 'Valor'
  }

  getNewConditions(type: string | number) {
    type = Number(type)
    if (type == 2) {
      return environment.TypeOfCondition.filter((x) => x.id != 3)
    }
    return environment.TypeOfCondition
  }

  getCourtesys(id: string) {
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/cortesy/cortesiesDetails/${id}`
    )
  }

  getCourtesiesByParking(id: string): Observable<CourtesyModel[]> {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/cortesy/cortesiesDetails/${id}`
      )
      .pipe(
        map((data) => {
          if (!data.success) {
            throw new Error('No se pudo obtener las cortesias')
          }

          return data.data
        })
      )
  }

  addParkingToCourtesy(listParking: string[], courtesyDetailId: string) {
    return this.http
      .post<ResponseModel>(
        `${this.apiUrl}backoffice/station_cortesy/addParkingToCourtesy/${courtesyDetailId}`,
        { listParking }
      )
      .toPromise()
      .then((data) => data)
  }

  getPDF(id: string) {
    return this.http.get(
      `${this.apiUrl}backoffice/cortesy/cortesiespdf/${id}`,
      { responseType: 'blob' }
    )
  }

  getStationaryCourtesies(parkingId: string) {
    return this.http.get(
      `${this.apiUrl}backoffice/station_cortesy/${parkingId}/station`,
      { responseType: 'blob' }
    )
  }

  async assignCourtesy(parkedId: string, courtesyDetailId: string | undefined) {
    if (!courtesyDetailId || !parkedId) {
      this.messageService.error('', 'Datos inválidos o faltantes')
      return
    }
    return this.http
      .post<ResponseModel>(`${this.apiUrl}backoffice/cortesy/assignCourtesy`, {
        courtesyDetailId,
        parkedId
      })
      .pipe(
        map((data) => {
          if (data.success) {
            this.messageService.Ok()
          } else {
            this.messageService.error(data.message)
          }
        })
      )
      .toPromise()
  }
}
