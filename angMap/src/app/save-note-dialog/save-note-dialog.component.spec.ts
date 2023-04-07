import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveNoteDialogComponent } from './save-note-dialog.component';

describe('SaveNoteDialogComponent', () => {
  let component: SaveNoteDialogComponent;
  let fixture: ComponentFixture<SaveNoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveNoteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
