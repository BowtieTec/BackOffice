import { Component, OnInit } from "@angular/core";
import {PermissionsService} from '../../shared/services/permissions.service'
import {environment} from '../../../environments/environment'
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-report',
  templateUrl: './report-menu.component.html',
  styleUrls: ['./report-menu.component.css']
})
export class ReportMenuComponent implements OnInit{
  verMenuPayment = environment.verMenuPayment
  verCourtesiesReport = environment.verCourtesiesReport
  verDurationReport = environment.verDurationReport
  verDailyParkingReport = environment.verDailyParkingReport
  verMonthlyParkingReport = environment.verMonthlyParkingReport
  verDailyParkingReportTicket = environment.verDailyParkingReportTicket
  verCourtesiesStationReport = environment.verCourtesiesStationReport
  verBillingReport = environment.verBillingReport
  verHistoryOfCourtesy = environment.verHistoryOfCourtesyReport
  transitDetailReport = environment.transitDetailReport
  blacklistRpt = environment.blacklistReport
  private actions: string[] = this.permissionService.actionsOfPermissions
  private parkingId: string = this.authService.getParking().id

  constructor(private permissionService: PermissionsService, private authService: AuthService,) {
  }

  ifHaveAction(action: string) {
    return !!this.actions.find((x) => x == action)
    //return this.permissionService.ifHaveAction(action);
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(({parkingId}) => {
      this.parkingId = parkingId;
    })
  }

  isBiltmore():boolean{
    return this.parkingId == '19b5f7a2-e165-4942-9fd6-1330f4f06654'? true:false;
  }
}
