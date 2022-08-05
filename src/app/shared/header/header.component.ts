import { Component } from '@angular/core'
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router'
import { MessageService } from '../services/message.service'
import { AuthModel, ParkingAuthModel } from '../model/UserResponse.model'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  authData: AuthModel = this.auth.getUser()
  parkingId: string = ''
  defaultParking: string = ''

  constructor(
    private auth: AuthService,
    private route: Router,
    private messageService: MessageService
  ) {
    this.parkingId = this.authData.user.parking.id
    this.defaultParking = this.authData.user.parking.id
  }

  logout() {
    this.auth.cleanUser()
    this.messageService.showLoading()
    this.route.navigate(['/']).then(() => {
      this.messageService.OkTimeOut('Sesión cerrada')
    })
  }

  async setParkedSelected(parking: ParkingAuthModel) {
    this.parkingId = parking.id
    await this.auth.saveNewParking(parking)
  }
}
