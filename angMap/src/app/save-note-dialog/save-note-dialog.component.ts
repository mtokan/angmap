import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-save-note-dialog',
  templateUrl: './save-note-dialog.component.html',
  styleUrls: ['./save-note-dialog.component.css']
})
export class SaveNoteDialogComponent implements OnInit {
  public hide = true;

  public form: FormGroup = new FormGroup({
    title: new FormControl(''),
    date: new FormControl(''),
    note: new FormControl('')
  });
  public submitted = false;

  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<SaveNoteDialogComponent,FormGroup>){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['',[Validators.required]],
      date: ['',[Validators.required]],
      note: ['',[Validators.required]]
    });
  };

  get f(): {[key:string]: AbstractControl} {
    return this.form.controls;
  }

  onSubmit(): void {
    this.dialogRef.close(this.form);
  }

  close() {
    this.dialogRef.close();
  }
}
