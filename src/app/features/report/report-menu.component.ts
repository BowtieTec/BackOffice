import { Component } from '@angular/core'
import { AuthService } from '../../shared/services/auth.service'
import { PermissionsService } from '../../shared/services/permissions.service'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-report',
  templateUrl: './report-menu.component.html',
  styleUrls: ['./report-menu.component.css']
})
export class ReportMenuComponent {
  verMenuPayment = environment.verMenuPayment
  verCourtesiesReport = environment.verCourtesiesReport
  verDurationReport = environment.verDurationReport
  verDailyParkingReport = environment.verDailyParkingReport
  verMonthlyParkingReport = environment.verMonthlyParkingReport
  verDailyParkingReportTicket = environment.verDailyParkingReportTicket
  verCourtesiesStationReport = environment.verCourtesiesStationReport
  private actions: string[] = this.permissionService.actionsOfPermissions

  constructor(
    private authService: AuthService,
    private permissionService: PermissionsService
  ) {}

  ifHaveAction(action: string) {
    return !!this.actions.find((x) => x == action)
    //return this.permissionService.ifHaveAction(action);
  }
}
