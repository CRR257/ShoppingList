import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {map, take} from 'rxjs/operators';
import {DialogComponent} from '../../../components/dialog/dialog.component';

@Injectable()
export class DialogService {

    constructor(private dialog: MatDialog) {
    }

    dialogRef: MatDialogRef<DialogComponent>;

    public open(data) {
        this.dialogRef = this.dialog.open(DialogComponent, {
            data: {
                title: data.title,
                inputPlaceholder: data.inputPlaceholder,
                nameItem: data.nameItem,
                errorMessage: data.errorMessage
            }
        });
    }

    public confirmed(): Observable<any> {
        return this.dialogRef.afterClosed().pipe(take(1), map(res => {
                return res;
            }
        ));
    }
}
