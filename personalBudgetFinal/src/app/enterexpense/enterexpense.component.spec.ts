import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterexpenseComponent } from './enterexpense.component';

describe('EnterexpenseComponent', () => {
  let component: EnterexpenseComponent;
  let fixture: ComponentFixture<EnterexpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterexpenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterexpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
