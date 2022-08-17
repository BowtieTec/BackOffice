import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { ListCheckModel, SelectModel } from '../../../model/CommonModels'

@Injectable({
  providedIn: 'root'
})
export class ListCheckboxService {

  private subject = new BehaviorSubject<ListCheckModel[]>([])
  constructor() { }

  sendData(data:ListCheckModel[]){
    this.subject.next(data)
  }
  recivedData(): Observable<ListCheckModel[]>{
    return this.subject.asObservable()
  }
}
