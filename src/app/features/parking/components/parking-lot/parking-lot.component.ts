import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ParkingLotService} from "./services/parking-lot.service";
import {IParkingLot, IParkingLotUpdate} from "./models/Parking.model";
import {DataTableOptions} from "../../../../shared/model/DataTableOptions";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ParkingModel} from "../../models/Parking.model";

@Component({
  selector: 'app-parking-lot',
  templateUrl: './parking-lot.component.html',
  styleUrls: ['./parking-lot.component.css']
})
export class ParkingLotComponent implements OnInit, OnDestroy, AfterViewInit {
  parkingLot: IParkingLot[] = [];
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective
  dtOptions: DataTables.Settings = {...DataTableOptions.getSpanishOptions(10), scrollX: true,}
  dtTrigger: Subject<any> = new Subject()
  formGroup: FormGroup

  constructor(private parkingSudo: ParkingLotService, private formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({filter: ['']})
    this.getInitialData();
  }

  ngOnInit(): void {

  }

  getInitialData() {
    this.getParkingLot().then();
  }

  async getParkingLot() {
    return this.parkingSudo.getParkingLots().then((data: IParkingLot[]) => {
      this.parkingLot = data;
      this.dtTrigger.next()
    })
  }

  async updateData(data: IParkingLotUpdate, parkingId: string) {
    return this.parkingSudo.updateParkingInfo(data, parkingId).then((data: IParkingLot[]) => {

    })
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next()
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }

  changeValue(innerHTML: any, parking: ParkingModel, name: string): any {
    // @ts-ignore
    if (innerHTML.innerHTML == parking[name]) return
    const data: any = {
      [name]: innerHTML.innerHTML
    };
    this.updateData(data, parking.id).then();
  }

  private rerender() {
    if (this.dtElement != undefined) {
      return this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy()
        this.dtTrigger.next()
      })
    }
    return
  }
}
