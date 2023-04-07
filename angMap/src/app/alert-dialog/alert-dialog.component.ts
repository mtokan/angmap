import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent,boolean>,
    @Inject(MAT_DIALOG_DATA) public data: string){}

    cancel(){
      this.dialogRef.close(false);
    }

    accept(){
      this.dialogRef.close(true);
    }
}
