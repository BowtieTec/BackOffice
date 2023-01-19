import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'

@Component({
  selector: 'app-tariff-ranks',
  templateUrl: './tariff-ranks.component.html',
  styleUrls: ['./tariff-ranks.component.css']
})
export class TariffRanksComponent implements OnInit {
  @Input() timeRange!: number
  @Output() setNewTimeRange = new EventEmitter<number>()

  constructor() {
  }

  ngOnInit(): void {
  }

  emitNewTimeRange(timeRange: number) {
    this.setNewTimeRange.emit(timeRange)
  }
}
