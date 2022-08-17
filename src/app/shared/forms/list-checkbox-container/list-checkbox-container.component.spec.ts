import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCheckboxContainerComponent } from './list-checkbox-container.component';

describe('ListCheckboxContainerComponent', () => {
  let component: ListCheckboxContainerComponent;
  let fixture: ComponentFixture<ListCheckboxContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCheckboxContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCheckboxContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
