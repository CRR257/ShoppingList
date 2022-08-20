import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '../../shared/material-module';
import {ShoppingListComponent} from './shopping-list.component';
import {DialogService} from '../../shared/services/dialog/dialog-service';

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
