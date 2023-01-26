import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-panel-sub-module',
  template: `
    <div class = "row justify-content-center">
      <div class = "col-lg-12 col-md-12 col-sm-12 col-xs-12 animate__animated animate__fadeInLeft ">
        <div class = "panels">
          <app-title-cards [icon] = "icon"
                           [title] = "title"></app-title-cards>
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})

export class PanelSubModuleComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
}
