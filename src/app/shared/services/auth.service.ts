import {Injectable, OnDestroy} from '@angular/core'
import {UserRequestModel} from '../model/UserRequest.model'
import {HttpClient} from '@angular/common/http'
import {AuthModel, AuthParkingModel, ParkingAuthModel, UserResponseModel} from '../model/UserResponse.model'
import {environment} from '../../../environments/environment'
import {MessageService} from './message.service'
import {EncryptionService} from './encryption.service'
import {Router} from '@angular/router'
import {BehaviorSubject, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  isSudo: boolean = false
  private apiUrl = environment.serverAPI
  private userSubject$: BehaviorSubject<AuthParkingModel> = new BehaviorSubject<AuthParkingModel>({
    user: this.getUser().user,
    parkingId: this.getUser().user?.parking?.id
  })
  user$ = this.userSubject$ as Observable<AuthParkingModel>

  constructor(
    private http: HttpClient,
    private message: MessageService,
    private crypto: EncryptionService,
    private route: Router,
  ) {
    this.isSudo = this.getUser().user?.role?.isSudo || false
  }

  saveUser(user: AuthModel) {
    sessionStorage.setItem(
      this.crypto.encryptKey('User'),
      this.crypto.encrypt(JSON.stringify(user).replace('/n', ''))
    )
    this.userSubject$.next({user: user.user, parkingId: user.user.parking.id})
  }

  getUser(): AuthModel {
    const sentence = sessionStorage.getItem(this.crypto.encryptKey('User'))
    return {
      ...JSON.parse(this.crypto.decrypt(sentence!))
    }
  }

  cleanUser() {
    sessionStorage.clear()
    localStorage.clear()
  }

  getParking() {
    return this.getUser().user.parking
  }

  login(login: UserRequestModel) {
    this.message.showLoading()
    this.http
      .post<UserResponseModel>(`${this.apiUrl}backoffice/admin/signin`, login)
      .toPromise()
      .then((data) => {
        if (data.success) {
          this.saveUser(data.data)
          this.message.OkTimeOut('!Listo!')
          this.route.navigate(['/home/parking']).catch()
        } else {
          this.cleanUser()
          this.message.error('', data.message)
          this.route.navigate(['/']).catch()
        }
      })
      .catch((data) => {
        if (!data.error.success) {
          this.message.error(data.error.message);
          return
        }
        this.route.navigate(['/']).catch()
        throw new Error(data.message)
      })
  }

  async saveNewParking(parking: ParkingAuthModel) {
    let newUser = this.getUser()
    newUser.user.parking = parking
    await this.saveUser(newUser)
  }

  ngOnDestroy(): void {
    this.userSubject$.unsubscribe()
  }

}
