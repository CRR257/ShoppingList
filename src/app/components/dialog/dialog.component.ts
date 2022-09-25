import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogEditItemModel } from 'src/app/shared/models/dialog.interface';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  editItemForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      inputPlaceholder: string;
      nameItem: string;
      errorMessage: string;
    }
  ) {}

  editItem(form: DialogEditItemModel) {
    if (form.name.trim() === '') {
      return;
    }
    this.dialogRef.close(form);
  }
}
