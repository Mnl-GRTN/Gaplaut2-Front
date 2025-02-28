import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCentreFormComponent } from './edit-centre-form.component';

describe('EditCentreFormComponent', () => {
  let component: EditCentreFormComponent;
  let fixture: ComponentFixture<EditCentreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCentreFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCentreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
