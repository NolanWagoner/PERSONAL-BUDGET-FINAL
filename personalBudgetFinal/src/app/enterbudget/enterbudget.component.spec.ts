import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterbudgetComponent } from './enterbudget.component';

describe('EnterbudgetComponent', () => {
  let component: EnterbudgetComponent;
  let fixture: ComponentFixture<EnterbudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterbudgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterbudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
