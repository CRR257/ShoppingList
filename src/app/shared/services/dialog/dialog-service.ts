import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DialogComponent } from '../../../components/dialog/dialog.component';

@Injectable()
export class DialogService {
  constructor(private dialog: MatDialog) {}

  dialogRef: MatDialogRef<DialogComponent>;

  public openEditItem(data: any, width: string) {
    this.dialogRef = this.dialog.open(DialogComponent, {
      width,
      data: {
        title: data.title,
        inputPlaceholder: data.inputPlaceholder,
        nameItem: data.nameItem,
        errorMessage: data.errorMessage,
      },
    });
  }

  public confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(
      take(1),
      map((res) => {
        return res;
      })
    );
  }
}
