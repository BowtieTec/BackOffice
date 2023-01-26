import {Component, HostBinding, Input, OnInit} from '@angular/core'
import {ControlContainer, FormGroup, FormGroupDirective, Validators} from '@angular/forms'
import {UtilitiesService} from '../../services/utilities.service'

@Component({
  selector: 'app-input-container',
  templateUrl: './input-container.component.html',
  styleUrls: ['./input-container.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class InputContainerComponent implements OnInit {
  @Input() name!: string
  @Input() controlName!: string
  @Input() formGroup!: FormGroup
  @Input() type = 'text'
  @Input() textInfo = ''
  @Input() readonly: boolean = false
  @Input() minL = '0'
  @Input() maxL = '80'
  @Input() value: any
  @Input() columns: number = 6
  @HostBinding('class') class = `col-sm-${this.columns}`

  constructor(private utilitiesService: UtilitiesService) {
  }

  controlInvalid(control: string): boolean {
    return this.utilitiesService.controlInvalid(this.formGroup, control)
  }

  ngOnInit(): void {
    if (this.type == 'text') {
      this.formGroup.controls[this.controlName].addValidators([
        Validators.minLength(1),
        Validators.maxLength(parseInt(this.maxL)),
        Validators.pattern(/^[^$%()=&|*'\\";>#]*$/)
      ])
    } else if (this.type == 'number') {
      this.formGroup.controls[this.controlName].addValidators([
        Validators.min(0),
        Validators.max(99999999999999),
        Validators.maxLength(parseInt(this.maxL != '80' ? this.maxL : '20')),
        Validators.minLength(parseInt(this.minL != '80' ? this.minL : '20'))
      ])
    }
    this.formGroup.controls[this.controlName].setValue(this.value)
  }
}
