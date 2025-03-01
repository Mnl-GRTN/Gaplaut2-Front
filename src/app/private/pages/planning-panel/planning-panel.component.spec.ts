import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningPanelComponent } from './planning-panel.component';

describe('PlanningPanelComponent', () => {
  let component: PlanningPanelComponent;
  let fixture: ComponentFixture<PlanningPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
