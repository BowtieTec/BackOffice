import {Component, OnInit} from '@angular/core'
import {PermissionsService} from '../services/permissions.service'
import {OptionMenuModel} from '../model/OptionMenu.model'
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.css']
})
export class LeftPanelComponent implements OnInit {
  menu: OptionMenuModel[] = Array<OptionMenuModel>()

  constructor(private permissions: PermissionsService, private authService: AuthService) {
  }

  ifHaveModule(action: string) {
    return this.permissions.ifHaveModule(action)
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.permissions.getMenuOptionsValidated(user.user.id).then((options) => {
        this.menu = options.filter((optionFiltered) => optionFiltered.isShow)
      }).then(x => {
      })
    })
  }
}
