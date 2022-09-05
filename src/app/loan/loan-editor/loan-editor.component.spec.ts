import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanEditorComponent } from './loan-editor.component';

describe('LoanEditorComponent', () => {
  let component: LoanEditorComponent;
  let fixture: ComponentFixture<LoanEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
