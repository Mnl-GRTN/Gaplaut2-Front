import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeBoardComponent } from './welcome-board.component';

describe('WelcomeBoardComponent', () => {
  let component: WelcomeBoardComponent;
  let fixture: ComponentFixture<WelcomeBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
