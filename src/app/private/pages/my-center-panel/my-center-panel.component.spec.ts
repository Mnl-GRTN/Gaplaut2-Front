import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCenterPanelComponent } from './my-center-panel.component';

describe('MyCenterPanelComponent', () => {
  let component: MyCenterPanelComponent;
  let fixture: ComponentFixture<MyCenterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCenterPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCenterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
