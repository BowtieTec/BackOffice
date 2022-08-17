import { Component, OnDestroy, OnInit } from '@angular/core'
import { ListCheckboxService } from './service/list-checkbox.service'
import { ListCheckModel } from '../../model/CommonModels'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-list-checkbox-container',
  templateUrl: './list-checkbox-container.component.html',
  styleUrls: ['./list-checkbox-container.component.css']
})
export class ListCheckboxContainerComponent implements OnInit, OnDestroy {
  sub$:Subscription = Subscription.EMPTY
  listChecks:ListCheckModel[] = []
  constructor(private listCheckBoxService: ListCheckboxService) { }

  ngOnInit(): void {
    this.sub$ = this.listCheckBoxService.recivedData().subscribe((data)=> {
      this.listChecks = data
    })

  }
  get getListCheck(){
    return this.listChecks
  }
  unselectAll(){
    this.listChecks.forEach(element =>  element.isChecked = element.disable ? element.isChecked : false)
  }

  selectAll(){
    this.listChecks.forEach(element => element.isChecked = element.disable ? element.isChecked : true)
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe()
  }

}
