import { Component } from '@angular/core'
import { AuthService } from '../../shared/services/auth.service'
import { PermissionsService } from '../../shared/services/permissions.service'
import { environment } from '../../../environments/environment'
import {ParkingService} from "./services/parking.service";

@Component({
  selector: 'app-parking-menu',
  templateUrl: './parking-menu.component.html',
  styleUrls: ['./parking-menu.component.css']
})
export class ParkingMenuComponent {
  listParking = environment.listParking
  createParking = environment.createParking
  listAntennas = environment.listAntennas
  listMonthlyParking = environment.listMonthlyParking
  listParkedParking = environment.listParkedParking
  createMonthlyParking = environment.createMonthlyParking
  private actions: string[] = this.permissionService.actionsOfPermissions

  constructor(
    private authService: AuthService,
    private permissionService: PermissionsService,
    private parkingService: ParkingService
  ) {}

  get parkingId() {
    return this.authService.getParking().id
  }

  ifHaveAction(action: string) {
    return !!this.actions.find((x) => x == action)
  }
}
