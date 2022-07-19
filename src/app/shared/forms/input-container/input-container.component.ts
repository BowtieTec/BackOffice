import {Component, Input, OnInit} from '@angular/core'
import {ControlContainer, FormGroupDirective, UntypedFormGroup, Validators} from '@angular/forms'
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
  @Input() formGroup!: UntypedFormGroup
  @Input() type = 'text'
  @Input() textInfo = ''
  @Input() readonly: boolean = false
  @Input() minL = '0'
  @Input() maxL = '80'

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
        Validators.pattern(/^[^$%()=+&|*'\\";>#]*$/)
      ])
    } else if (this.type == 'number') {
      this.formGroup.controls[this.controlName].addValidators([
        Validators.min(0),
        Validators.max(999999.99)
      ])
    }
  }
}
