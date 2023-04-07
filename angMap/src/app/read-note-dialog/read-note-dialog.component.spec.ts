import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadNoteDialogComponent } from './read-note-dialog.component';

describe('ReadNoteDialogComponent', () => {
  let component: ReadNoteDialogComponent;
  let fixture: ComponentFixture<ReadNoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadNoteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
