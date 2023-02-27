import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PanelSubModuleComponent} from './panel-sub-module.component';

describe('PanelSubModuleComponent', () => {
  let component: PanelSubModuleComponent;
  let fixture: ComponentFixture<PanelSubModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelSubModuleComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PanelSubModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
