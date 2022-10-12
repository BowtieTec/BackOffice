import {Component} from '@angular/core'
import {Router} from '@angular/router'
import {MessageService} from '../services/message.service'

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  constructor(private router: Router, private messageService: MessageService) {
  }

  get loading() {
    return this.messageService.loading
  }
}
