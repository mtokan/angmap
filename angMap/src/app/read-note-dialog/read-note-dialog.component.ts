import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  date: string;
  note: string;
}

@Component({
  selector: 'app-read-note-dialog',
  templateUrl: './read-note-dialog.component.html',
  styleUrls: ['./read-note-dialog.component.css']
})
export class ReadNoteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ReadNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData){}

}
