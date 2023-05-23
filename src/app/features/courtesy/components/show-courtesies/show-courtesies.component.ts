import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetStationModel, MonthlyUserModel, ProfilesModel, SubscriptionModel } from 'src/app/features/parking/models/MontlyParking.model';
import { ParkingService } from 'src/app/features/parking/services/parking.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { PermissionsService } from 'src/app/shared/services/permissions.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'app-show-courtesies',
  templateUrl: './show-courtesies.component.html',
  styleUrls: ['./show-courtesies.component.css']
})
export class ShowCourtesiesComponent implements OnInit{

  showCourtesyForm: FormGroup = this.createForm()
  parkingId: string = ''
  currentDate: Date = new Date()
  userSelected: MonthlyUserModel = new MonthlyUserModel()
  userSearched: Array<MonthlyUserModel> = []
  profiles: ProfilesModel[] = []
  subscriptions: SubscriptionModel[] = []
  stationsByParking: GetStationModel[] = []

  constructor(
    private formBuilder: FormBuilder,
    private message: MessageService,
    private parkingService: ParkingService,
    private utilitiesService: UtilitiesService,
    private authService: AuthService,
    private permissionService: PermissionsService
  ) {
  }


  createForm() {
    return this.formBuilder.group({
      parkingId: [this.parkingId, [Validators.required]],
      active: [false],
    })
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(({parkingId}) => {
      this.parkingId = parkingId
      this.showCourtesyForm.get('parkingId')?.setValue(parkingId)
      this.showCourtesyForm.get('active')?.setValue(this.authService.getParking().show_courtesies_in_app)
    })
  }

  getInitialData() {
    this.message.showLoading()
  }


  get isUnlimitedValue() {
    return false;
  }

  changeValueIsUnlimited() {
    return true;
  }


}
