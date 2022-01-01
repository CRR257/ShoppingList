import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

    editItemForm = new FormGroup ({
        name: new FormControl('', Validators.required),
    });

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            title: string;
            inputPlaceholder: string;
            nameItem: string;
            errorMessage: string;
        }
    ) {}

    ngOnInit() {}

  editItem(form) {
        if (form.name.trim() === '' ) {
            return;
        }
        this.dialogRef.close(form);
    }

}
