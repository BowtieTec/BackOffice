import { Injectable, OnDestroy } from '@angular/core'
import { environment } from '../../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { MessageService } from '../../../shared/services/message.service'
import { ResponseModel } from '../../../shared/model/Request.model'
import {
  AccessModel,
  CreateParkingFileModel,
  CreateParkingStepFiveModel,
  CreateParkingStepFourModel,
  CreateParkingStepOneModel,
  CreateParkingStepTwoModel
} from '../models/CreateParking.model'
import { Router } from '@angular/router'
import { map } from 'rxjs/operators'
import {
  CurrencyOptionModel,
  Day,
  PaymentMethodModel,
  SettingsOptionsModel
} from '../models/SettingsOption.model'
import { BehaviorSubject, Observable, Subscribable } from 'rxjs'
import { CountriesModel } from '../models/Countries.model'
import { CreateTariffModel } from '../models/Tariff.model'
import { CreateProfilesModel } from '../models/MontlyParking.model'
import {
  CreateStation,
  CreateStationaryCourtesy,
  StationsCourtesyModel
} from '../models/StationaryCourtesy.model'
import { ParkedModel, ParkingModel } from '../models/Parking.model'

@Injectable({
  providedIn: 'root'
})
export class ParkingService implements OnDestroy {
  parkingStepOne: CreateParkingStepOneModel = new CreateParkingStepOneModel()
  parkingStepTwo: CreateParkingStepTwoModel = new CreateParkingStepTwoModel()
  parkingStepFour: CreateParkingStepFourModel = new CreateParkingStepFourModel()
  parkingFile: CreateParkingFileModel = new CreateParkingFileModel()
  parkingStepFive: CreateParkingStepFiveModel[] =
    new Array<CreateParkingStepFiveModel>()
  settingsOptions!: SettingsOptionsModel
  countries: CountriesModel[] = new Array<CountriesModel>()
  allParkingLot: ParkingModel[] = []
  private apiUrl = environment.serverAPI
  private parkingLotSubject$: BehaviorSubject<ParkingModel[]> =
    new BehaviorSubject<ParkingModel[]>([])
  public parkingLot$: Observable<ParkingModel[]> =
    this.parkingLotSubject$.asObservable()

  constructor(
    private http: HttpClient,
    private message: MessageService,
    private route: Router
  ) {
    Promise.all([
      this.getCountries()
        .toPromise()
        .then((data) => {
          this.countries = data.data
        }),
      this.getSettingsOptions().toPromise().then(),
      this.getAllParking().then((data) => {
        this.parkingLotSubject$.next(data.data.parkings)
      })
    ]).then()
  }

  getCountries() {
    return this.http.get<ResponseModel>(`${this.apiUrl}utilities/countries`)
  }

  getSettingsOptions(): Observable<SettingsOptionsModel> {
    return this.http
      .get<ResponseModel>(`${this.apiUrl}backoffice/parking/settings-options`)
      .pipe(
        map((data) => {
          if (!data.success) throw data.message
          this.settingsOptions = data.data
          return { ...data.data }
        })
      )
  }

  endTempToken() {
    return this.http.put<ResponseModel>(
      `${this.apiUrl}backoffice/parking/token/close`,
      {}
    )
  }

  getAccesses(): Array<AccessModel> {
    return [
      { id: 0, name: 'Entrada primaria' },
      { id: 1, name: 'Salida primaria' },
      { id: 2, name: 'Entrada secundaria' },
      { id: 3, name: 'Salida secundaria' }
    ]
  }

  setStepOne(): Subscribable<ResponseModel> {
    return this.http
      .post<ResponseModel>(
        `${this.apiUrl}backoffice/parking/create`,
        this.parkingStepOne
      )
      .pipe(
        map((data) => {
          return data
        })
      )
  }

  setStepTwo(): Observable<ResponseModel> {
    return this.http
      .post<ResponseModel>(
        `${this.apiUrl}backoffice/parking/schedule`,
        this.parkingStepTwo
      )
      .pipe(
        map((data) => {
          if (!data.success) throw data.message
          return data
        })
      )
  }

  setStepFour(): Observable<ResponseModel> {
    return this.http
      .post<ResponseModel>(
        `${this.apiUrl}backoffice/parking/payment-invoice`,
        this.parkingStepFour
      )
      .pipe(
        map((data) => {
          if (!data.success) throw data.message
          return data
        })
      )
  }

  setFile(): Observable<ResponseModel> {
    return this.http
      .post<ResponseModel>(
        `${this.apiUrl}backoffice/parking/payment-invoice`,
        this.parkingFile
      )
      .pipe(
        map((data) => {
          if (!data.success) throw data.message
          return data
        })
      )
  }

  setStepFive(antenna: CreateParkingStepFiveModel): Promise<ResponseModel> {
    return this.http
      .post<ResponseModel>(`${this.apiUrl}backoffice/parking/station`, antenna)
      .toPromise()
  }

  getCountryById(id: number): CountriesModel {
    let country = this.countries.find((x) => x.id == id)
    if (country === undefined) {
      this.message.errorTimeOut(
        '',
        'No se encontró el país seleccionado. Verifique la información.'
      )
      country = new CountriesModel()
    }
    return country
  }

  getPayMethodById(id: number) {
    const result = this.settingsOptions.paymentMethods.find((x) => x.id == id)
    return result === undefined ? new PaymentMethodModel() : result
  }

  getCurrencyById(id: number) {
    const result = this.settingsOptions.currencyOptions.find((x) => x.id == id)
    return result === undefined ? new CurrencyOptionModel() : result
  }

  getDayById(id: number) {
    let result = this.settingsOptions.days.find((x) => x.id == id)
    if (result === undefined) {
      result = new Day()
    }
    return result
  }

  getTypeAntennaById(id: number): AccessModel {
    const result = this.getAccesses().find((x: AccessModel) => x.id == id)
    return result === undefined ? new AccessModel() : result
  }

  getAntennas(idParking: string) {
    return this.http.get<ResponseModel>(
      `${this.apiUrl}backoffice/parking/${idParking}/station`
    )
  }

  getQR(stationID: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}backoffice/parking/station/${stationID}/downloadqr`,
      { responseType: 'blob' }
    )
  }

  editStepFive(antennaToEdit: CreateParkingStepFiveModel) {
    return this.http.put<ResponseModel>(
      `${this.apiUrl}backoffice/parking/station/${antennaToEdit.id}`,
      antennaToEdit
    )
  }

  deleteAntenna(id: string) {
    return this.http.delete<ResponseModel>(
      `${this.apiUrl}backoffice/parking/station/${id}`
    )
  }

  setRule(rule: CreateTariffModel) {
    return this.http
      .post<ResponseModel>(`${this.apiUrl}backoffice/tariff`, rule)
      .toPromise()
  }

  getTariffsSaved(parkingId: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/tariff/parking/${parkingId}`
      )
      .toPromise()
  }

  deleteTariff(id: string) {
    return this.http
      .delete<ResponseModel>(`${this.apiUrl}backoffice/tariff/rule/${id}`)
      .toPromise()
  }

  getUsersByTelephone(telephone: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/user/search?number=${telephone}`
      )
      .toPromise()
  }

  createMonthlySubscription(subscription: any) {
    return this.http
      .post<ResponseModel>(
        `${this.apiUrl}backoffice/monthly-subscription/create`,
        subscription
      )
      .toPromise()
  }

  getProfilesOfMonthlySubscription(parkingId: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/monthly-subscription/profiles/${parkingId}`
      )
      .toPromise()
  }

  getMonthlySubscription(parkingId: string) {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/monthly-subscription/all/${parkingId}`
      )
      .toPromise()
  }

  disableSubscription(idSubscription: string) {
    return this.http
      .put<ResponseModel>(
        `${this.apiUrl}backoffice/monthly-subscription/disable/${idSubscription}`,
        idSubscription
      )
      .toPromise()
  }

  cancelSubscription(idSubscription: string) {
    return this.http
      .put<ResponseModel>(
        `${this.apiUrl}backoffice/monthly-subscription/cancel/${idSubscription}`,
        idSubscription
      )
      .toPromise()
  }

  deleteSubscription(idSubscription: string) {
    return this.http
      .delete<ResponseModel>(
        `${this.apiUrl}backoffice/monthly-subscription/${idSubscription}`
      )
      .toPromise()
  }

  createAccessProfile(profile: CreateProfilesModel) {
    return this.http
      .post<ResponseModel>(
        `${this.apiUrl}backoffice/monthly-subscription/profiles/`,
        profile
      )
      .toPromise()
  }

  getParked(
    parkedFormValues: { parkingId: string; status: string },
    page = 1,
    pageSize = 10
  ) {
    return this.http
      .post<ResponseModel>(
        `${this.apiUrl}backoffice/parking/parked?page=${page}&per_page=${pageSize}`,
        parkedFormValues
      )
      .pipe(
        map((res) => {
          return {
            data: res.data.parked.map((x: any): ParkedModel => {
              return {
                id: x?.id,
                status: x?.status,
                type: x?.type,
                entry_date: x?.entry_date,
                exit_date: x?.exit_date,
                user_name: x?.user?.name,
                last_name: x?.user?.last_name,
                phone_number: x?.user?.phone_number,
                parking: x?.parking?.name,
                parkingId: x?.parking.id
              }
            }),
            recordsTotal: res.data.recordsFiltered,
            recordsFiltered: res.data.recordsFiltered
          }
        })
      )
  }

  getOutParked(
    parkedId: string,
    payment_method: number,
    dateOutToGetOut: Date
  ) {
    return this.http
      .post<ResponseModel>(`${this.apiUrl}backoffice/parking/getOut`, {
        parkedId,
        payment_method,
        dateOutToGetOut
      })
      .toPromise()
  }

  async searchAntennasByParking(parking: string) {
    return this.getAntennas(parking)
      .toPromise()
      .then((data: ResponseModel) => {
        if (data.success) {
          return data.data.stations
        } else {
          this.message.error(data.message)
        }
      })
  }

  getAntennasWithStationaryCourtesy(
    parkingId: string
  ): Promise<Array<StationsCourtesyModel>> {
    return this.http
      .get<ResponseModel>(
        `${this.apiUrl}backoffice/station_cortesy/${parkingId}/station`
      )
      .toPromise()
      .then((data) => {
        if (data.success) {
          return data.data.stations
        }
        return new Array<StationsCourtesyModel>()
      })
      .catch((err) => {
        return new Array<StationsCourtesyModel>()
      })
  }

  createStationWithCourtesy(newStation: CreateStation) {
    return this.http.post<ResponseModel>(
      `${this.apiUrl}backoffice/station_cortesy/station`,
      newStation
    )
  }

  editStationWithCourtesy(editStation: CreateStation) {
    return this.http.put<ResponseModel>(
      `${this.apiUrl}backoffice/station_cortesy/station/${editStation.id}`,
      editStation
    )
  }

  deleteAntennaWithCourtesy(id: string) {
    return this.http.delete<ResponseModel>(
      `${this.apiUrl}backoffice/station_cortesy/station/${id}`
    )
  }

  createStationaryCourtesy(newCourtesy: CreateStationaryCourtesy) {
    return this.http
      .post<ResponseModel>(
        `${this.apiUrl}backoffice/station_cortesy/courtesy`,
        newCourtesy
      )
      .toPromise()
      .then((data) => data)
  }

  editStationaryCourtesy(editStationCourtesy: CreateStationaryCourtesy) {
    return this.http.put<ResponseModel>(
      `${this.apiUrl}backoffice/station_cortesy/courtesy/${editStationCourtesy.id}`,
      editStationCourtesy
    )
  }

  getParkingInfo(parkingId: string) {
    return this.http
      .get<ResponseModel>(`${this.apiUrl}backoffice/parking/info/${parkingId}`)
      .pipe(
        map((res) => {
          if (res.success) {
            return res.data
          } else {
            this.message.error('', res.message)
          }
        })
      )
  }

  clearObjects() {
    this.route.navigate(['home']).then(() => {
      this.parkingStepOne = new CreateParkingStepOneModel()
      this.parkingStepTwo = new CreateParkingStepTwoModel()
      this.parkingStepFour = new CreateParkingStepFourModel()
      this.parkingFile = new CreateParkingFileModel()
      this.parkingStepFive = []
    })
  }

  tariffStatusUpdate(parkingId: string, newStatus: boolean) {
    return this.http
      .put<ResponseModel>(
        `${this.apiUrl}backoffice/tariff/rule/active/${parkingId}`,
        { isActive: newStatus }
      )
      .toPromise()
  }

  ngOnDestroy(): void {
    this.parkingLotSubject$.unsubscribe()
  }

  private getAllParking() {
    return this.http
      .get<ResponseModel>(`${this.apiUrl}backoffice/parking/enables`)
      .toPromise()
  }
}
