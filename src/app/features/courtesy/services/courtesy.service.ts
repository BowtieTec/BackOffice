import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {environment} from '../../../../environments/environment'
import {ResponseModel} from '../../../shared/model/Request.model'
import {CourtesyModel} from '../models/Courtesy.model'
import {SelectModel} from '../../../shared/model/CommonModels'
import {map} from 'rxjs/operators'
import {Observable} from 'rxjs'
import {MessageService} from '../../../shared/services/message.service'
import {ParkingModel} from '../../parking/models/Parking.model'
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";


@Injectable({
  providedIn: 'root'
})
export class CourtesyService {
  private apiUrl = environment.serverAPI

  constructor(
    private http: HttpClient,
    private message: MessageService
  ) {
  }

  get TypeOfConditions(): SelectModel[] {
    return environment.TypeOfCondition
  }

  get DiscountOnWhatOptions(): SelectModel[] {
    return environment.DiscountOnWhat
  }

  getTypes() {
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/cortesy/typeCortesies`
    ).toPromise()
      .then((data) => {
        if (data.success) {
          return data.data.type.filter((x: any) => x.id != 3)
        } else {
          this.message.errorTimeOut(
            '',
            'No se pudo cargar la información inicial. Intente mas tarde.'
          )
        }
      })
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
    ).toPromise()
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
        `${this.apiUrl}backoffice/cortesy/cortesiesDetailsStationary/${id}`
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
        {listParking}
      )
      .toPromise()
      .then((data) => data)
  }

  getPDF(id: string) {
    return this.http.get(
      `${this.apiUrl}backoffice/cortesy/cortesiespdf/${id}`,
      {responseType: 'blob'}
    )
  }

  getStationaryCourtesies(parkingId: string) {
    return this.http.get(
      `${this.apiUrl}backoffice/station_cortesy/${parkingId}/station`,
      {responseType: 'blob'}
    )
  }

  async assignCourtesy(parkedId: string, courtesyDetailId: string | undefined) {
    if (!courtesyDetailId || !parkedId) {
      this.message.error('', 'Datos inválidos o faltantes')
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
            this.message.OkTimeOut()
          } else {
            this.message.error(data.message)
          }
        })
      )
      .toPromise()
  }

  createCourtesyFormGroup(parkingId: string): FormGroup {
    const formBuilder = new FormBuilder()
    return formBuilder.group({
      name: ['', [Validators.required]],
      type: [null, [Validators.required]],
      value: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      valueTimeMinutes: [0, [Validators.max(60), Validators.min(0), Validators.max(59)]],
      parkingId: [parkingId],
      companyId: ['', [Validators.required]],
      condition: [null, [Validators.required]],
      cantHours: [0, [Validators.max(24), Validators.min(0)]]
    })
  }
  getCourtesyFormValue(form: FormGroup, parkingId: string){
    const type = form.controls['type'].value
    const minutes: number =
      form.getRawValue().valueTimeMinutes > 0 ? form.getRawValue().valueTimeMinutes / 60 : 0
    const value: number =
      Number(form.getRawValue().value) + Number(minutes)
    return {
        parkingId: parkingId,
        name: form.controls['name'].value,
        type,
        value,
        valueTimeMinutes: form.controls['valueTimeMinutes'].value > 0 ? form.controls['valueTimeMinutes'].value / 60 : 0,
        quantity: form.controls['quantity'].value,
        companyId: form.controls['companyId'].value,
        condition: form.controls['condition'].value,
        cantHours: form.controls['cantHours'].value
    }
  }
  InputValueFromNewCourtesy(type: number) {
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
}
