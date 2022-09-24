import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';

import {MaterialModule} from 'src/app/shared/material-module';
import {DialogService} from 'src/app/shared/services/dialog/dialog-service';
import {ShoppingListComponent} from './shopping-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule
    ],
    declarations: [
        ShoppingListComponent
    ],
    exports: [
        ShoppingListComponent
    ],
    providers: [
        DialogService
    ]
})
export class ShoppingListModule {}
