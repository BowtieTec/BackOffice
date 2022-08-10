import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PermissionsService } from 'src/app/shared/services/permissions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-support',
  templateUrl: './support-menu.component.html',
  styleUrls: ['./support-menu.component.css']
})
export class SupportMenuComponent {

  newTicket = environment.newTicket
  verBitacora = environment.verBitacora
  constructor(
    private authService: AuthService,
    private permissionService: PermissionsService
  ) { }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }

}
