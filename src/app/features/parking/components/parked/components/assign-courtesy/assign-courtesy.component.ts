import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ParkedModel} from "../../../../models/Parking.model";
import {CourtesyService} from "../../../../../courtesy/services/courtesy.service";
import {CourtesyModel, CourtesyTypeModel} from "../../../../../courtesy/models/Courtesy.model";
import {Subject} from "rxjs";
import {MessageService} from "../../../../../../shared/services/message.service";

@Component({
  selector: 'app-assign-courtesy',
  templateUrl: './assign-courtesy.component.html',
  styleUrls: ['./assign-courtesy.component.css']
})
export class AssignCourtesyComponent implements OnInit, OnDestroy {
  @Input() parked$: Subject<ParkedModel> = new Subject<ParkedModel>()
  courtesies: CourtesyModel[] = []
  courtesyTypes: CourtesyTypeModel[] = []
  isLoading: Boolean = true
  parkedSelected: ParkedModel = new ParkedModel()
  courtesyClicked: CourtesyModel = new CourtesyModel()
  constructor(private courtesyService: CourtesyService, private messageService: MessageService) {
  }

  getStationaryCourtesies(parked: ParkedModel) {
    this.isLoading = true
    console.log(parked)
    if (!parked.parking) {
      return
    }
    this.courtesyService.getCourtesiesByParking(parked.parkingId).toPromise().then(data => {
      this.courtesies = data.filter(x => x.haveStation)
      console.log(this.courtesies);
    }).then(() => this.isLoading = !this.isLoading)
  }

  ngOnInit(): void {
    this.parked$.subscribe((parked: ParkedModel) => {
      this.getStationaryCourtesies(parked)
      this.parkedSelected = parked
    })
  }


  ngOnDestroy(): void {
    this.parked$.unsubscribe()
  }

  assignCourtesy(courtesy: CourtesyModel) {
    this.isLoading = true
    this.courtesyClicked = courtesy
    this.courtesyService.assignCourtesy(this.parkedSelected.id, courtesy.id).then(() => this.isLoading = !this.courtesyService)
  }
}
