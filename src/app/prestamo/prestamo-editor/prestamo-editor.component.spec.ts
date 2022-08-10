import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamoEditorComponent } from './prestamo-editor.component';

describe('PrestamoEditorComponent', () => {
  let component: PrestamoEditorComponent;
  let fixture: ComponentFixture<PrestamoEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrestamoEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestamoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
