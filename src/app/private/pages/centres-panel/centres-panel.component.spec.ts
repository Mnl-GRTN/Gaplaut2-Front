import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentresPanelComponent } from './centres-panel.component';

describe('CentresPanelComponent', () => {
  let component: CentresPanelComponent;
  let fixture: ComponentFixture<CentresPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentresPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentresPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
