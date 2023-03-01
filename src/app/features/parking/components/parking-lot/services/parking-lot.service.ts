import {Injectable} from '@angular/core';
import {environment} from "../../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ResponseModel} from "../../../../../shared/model/Request.model";
import {MessageService} from "../../../../../shared/services/message.service";
import {IParkingLot, IParkingLotUpdate} from "../models/Parking.model";

@Injectable({
  providedIn: 'root'
})
export class ParkingLotService {
  private apiUrl = environment.serverAPI

  constructor(private http: HttpClient, private message: MessageService) {
  }

  async getParkingLots(): Promise<IParkingLot[]> {
    try {
      const resp = await this.http.get(this.apiUrl + 'backoffice/parking').toPromise() as ResponseModel;
      if (resp.success) {
        return resp.data;
      } else {
        this.message.error(resp.message);
        return resp.data
      }
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
  async updateParkingInfo(data: IParkingLotUpdate, parkingId: string) {
    try {
      const resp = await this.http.put(`${this.apiUrl}backoffice/parking/${parkingId}`, data).toPromise() as ResponseModel;
      if (resp.success) {
        this.message.OkTimeOut('Actualizado correctamente');
        return resp.data;
      } else {
        this.message.error(resp.message);
        return resp.data
      }
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
