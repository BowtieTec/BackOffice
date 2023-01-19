import {Component} from '@angular/core'
import {NewUserModel} from './models/newUserModel'
import {Subject} from 'rxjs'
import {PermissionsService} from '../../../../shared/services/permissions.service'
import {environment} from '../../../../../environments/environment'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  subject = new Subject<NewUserModel>()
  listUser = environment.listUser
  createUser = environment.createUser

  constructor(private permissionService: PermissionsService) {
  }

  ifHaveAction(action: string) {
    return this.permissionService.ifHaveAction(action)
  }
}
