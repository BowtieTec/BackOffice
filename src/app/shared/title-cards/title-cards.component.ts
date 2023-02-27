import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-title-cards',
  template: `
    <div class = "animate__animated animate__fadeInLeft mt-3">
      <div class = "titleCards">
        <span><em class = "{{icon}}"></em></span>{{title}}
      </div>
    </div>
  `
})
export class TitleCardsComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
}
