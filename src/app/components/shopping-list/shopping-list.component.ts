import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';

import {NewShoppingItem} from 'src/app/shared/models/shoppingList.interface';
import {Supermarket} from 'src/app/shared/models/supermarket.interface';
import {AuthService} from 'src/app/shared/services/auth/auth-service';
import {ShoppingListService} from 'src/app/components/shopping-list/shoppinglist.service';
import {UtilsMathService} from 'src/app/shared/services/utils/utils-math.service';
import {ProfileService} from 'src/app/shared/services/profile/profile.service';
import {DialogService} from 'src/app/shared/services/dialog/dialog-service';
import {NotificationComponent} from '../notification/notification.component';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
    userId: string;
    loading = false;
    accordionExpanded = true;
    supermarketLastSelected;
    userSupermarketsChecked: Supermarket[];
    supermarketsResults = [];

    newItemForm = new FormGroup({
        name: new FormControl('', Validators.required),
        placeToBuyIt: new FormControl('', Validators.required),
    });

    constructor(public authService: AuthService,
                public shoppingListService: ShoppingListService,
                public router: Router,
                public utilsMathService: UtilsMathService,
                public profileService: ProfileService,
                private dialog: MatDialog,
                private dialogService: DialogService,
                private snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.getUserLogged();
        this.getUserSupermarkets();
        this.getShoppingList();
    }

    getUserLogged() {
        this.userId = this.authService.getUserLogged().uid;
    }

    async getUserSupermarkets() {
        this.loading = true;
        const userSupermarkets = 'supermarketsUserList-' + `${this.userId}`;
        let userSupermarketsGlobal: Supermarket[];
        await this.profileService.getUserSuperMarkets(userSupermarkets).subscribe(supermarket => {
            if ( supermarket) {
                userSupermarketsGlobal = Object.values(supermarket[0]);
                this.userSupermarketsChecked = userSupermarketsGlobal.filter(s => s.checked);
            } else {
                this.profileService.getSupermarkets().subscribe(supermarketDefault => {
                    userSupermarketsGlobal = supermarketDefault.filter(s => s.checked);
                });
            }
        });
    }

    async getShoppingList() {
        this.loading = true;
        const userShoppingList = 'shoppingList-' + `${this.userId}`;
        await this.shoppingListService.getShoppingUser(userShoppingList).subscribe(item => {
            const shoppingList = item.reduce(function(r, a) {
                if (a.placeToBuyIt) {
                    r[a.placeToBuyIt] = r[a.placeToBuyIt] || [];
                    r[a.id] = r[a.id] || '';
                    r[a.placeToBuyIt].push(a);
                    return r;
                }
            }, Object.create(null));

            for (const key in shoppingList) {
                    if (shoppingList) { //
                        for (let i = 0; i < shoppingList[key].length; i++) {
                            const supermarketSortedItems = this.utilsMathService.sortItemsByNameBoughtProperty(shoppingList[key]);
                            shoppingList[key] = [];
                            shoppingList[key].push(supermarketSortedItems);
                        }
                    }
                }
            this.supermarketsResults = shoppingList;
            this.loading = false;
        });
    }

    deleteItem(item) {
        this.shoppingListService.deleteItem(item).then(result => {
           // this.openSnackBar(result);
        }).catch(error => {
            this.openSnackBar(error);
        });
    }

    async editItem(itemSelected) {
        const data = {
            title: 'Edit item',
            inputPlaceholder: 'Name item',
            nameItem: itemSelected.name,
            errorMessage: 'Name can\'t be empty'
        };
        this.dialogService.openEditItem(data);
        await this.dialogService.confirmed().subscribe(item => {
            if (item) {
                const itemEdited = {
                    name: item.name,
                };
                this.shoppingListService.editItem(itemSelected.idShoppingList, itemEdited).then((result) => {
                    // this.openSnackBar(result);
                    this.getShoppingList();
                }).catch((error) => {
                    this.openSnackBar(error);
                });
            }
        });
    }

    openSnackBar(message: string) {
        this.snackBar.openFromComponent(NotificationComponent, {
            data: message,
            duration: 1500
        });
    }

    checkItem(item) {
        item.isBought = !item.isBought;
        const itemBought: NewShoppingItem = {
            name: item.name,
            placeToBuyIt: item.placeToBuyIt,
            isBought: item.isBought
        };
        this.shoppingListService.editItem(item.idShoppingList, itemBought);
        this.getShoppingList();
    }

    createItem(form: NewShoppingItem) {
        if (form.placeToBuyIt === '') {
            return;
        }
        if (form.name.trim() === '') {
            this.newItemForm.get('name').setErrors({nameError: true});
            return;
        }
        const item: NewShoppingItem = {
            name: form.name.trim(),
            placeToBuyIt: form.placeToBuyIt,
            isBought: false
        };
        this.shoppingListService.newItem(item).then((result) => {
           //  this.openSnackBar(result);
            this.getShoppingList();
            this.newItemForm.reset({name: '', placeToBuyIt: form.placeToBuyIt});
            this.newItemForm.get('name').setErrors(null);
        }).catch((error) => {
            this.openSnackBar(error);
        });
    }
}

