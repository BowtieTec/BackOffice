import {Component, HostBinding, Input} from '@angular/core'
import {ControlContainer, FormGroup, FormGroupDirective, UntypedFormGroup} from '@angular/forms'
import {UtilitiesService} from '../../services/utilities.service'

@Component({
  selector: 'app-select-container',
  templateUrl: './select-container.component.html',
  styleUrls: ['./select-container.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class SelectContainerComponent {
  @Input() name!: string
  @Input() controlName!: string
  @Input() formGroup!: UntypedFormGroup | FormGroup
  @Input() data: any = []
  @Input() unselect: boolean = false
  @Input() columns: number = 6
  @HostBinding('class') class = `col-sm-${this.columns}`

  @Input() onChangeFunction: (args: any) => void = () => {
  }

  constructor(private utilitiesService: UtilitiesService) {
  }

  exist0() {
    return this.data.find((d: any) => d.id == 0 || d.id == '0')
  }

  controlInvalid(control: string): boolean {
    return this.utilitiesService.controlInvalid(this.formGroup, control)
  }
}
