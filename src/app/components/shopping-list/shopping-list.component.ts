import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/shared/services/auth/auth-service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ShoppingListService} from 'src/app/shared/services/shoppinglist/shoppinglist.service';
import {UtilsMathService} from '../../shared/services/utils/utils-math.service';
import {ProfileService} from '../../shared/services/profile/profile.service';
import {DialogService} from '../../shared/services/dialog/dialog-service';
import {NewShoppingItem} from '../../shared/models/shoppingList.interface';
import {Supermarket} from '../../shared/models/supermarket.interface';
import {NotificationComponent} from '../notification/notification.component';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
    userId = '';
    loading = false;
    userSupermarket: Supermarket[];
    groupedSupermarket: [];
    accordionExpanded = true;
    supermarketLastSelected = '';

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

    setAccordion(accordionOpen) {
        this.accordionExpanded = accordionOpen;
    }

    ngOnInit(): void {
        this.getUserLogged();
        this.getUserSupermarkets();
        this.getShoppingList();
    }

    getUserLogged() {
        this.userId = this.authService.getUserLogged().id;
    }

    getUserSupermarkets() {
        this.loading = true;
        const userSupermarkets = 'supermarketsUserList-' + `${this.userId}`;
        this.profileService.getUserSuperMarkets(userSupermarkets).subscribe(supermarket => {
            if (Object.keys(supermarket).length > 0) {
                this.userSupermarket = Object.values(supermarket[0]);
                this.userSupermarket = this.userSupermarket.filter(s => s.checked);
            } else {
                this.profileService.getSupermarkets().subscribe(supermarketDefault => {
                    this.userSupermarket = supermarketDefault.filter(s => s.checked);
                });
            }
        });
    }

    getShoppingList() {
        const userShoppingList = 'shoppingList-' + `${this.userId}`;
        this.shoppingListService.getShoppingUser(userShoppingList).subscribe(item => {
            const result = item.reduce(function (r, a) {
                r[a.placeToBuyIt] = r[a.placeToBuyIt] || [];
                r[a.placeToBuyIt].push(a);
                return r;
            }, Object.create(null));

            const supermarkets = Object.entries(result);
            this.groupedSupermarket = this.utilsMathService.sort(supermarkets);

            for (let i = 0; i < this.groupedSupermarket.length; i++) {
                this.utilsMathService.sortItemsByNameBoughtProperty(this.groupedSupermarket[i]);
            }
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

    editItem(item) {
        const data = {
            title: 'Edit item',
            inputPlaceholder: 'Name item',
            nameItem: item.name,
            errorMessage: 'Name can\'t be empty'
        };
        this.dialogService.openEditItem(data);
        this.dialogService.confirmed().subscribe(itemCreated => {
            if (itemCreated) {
                const itemEdited: NewShoppingItem = {
                    name: itemCreated.name,
                    placeToBuyIt: item.placeToBuyIt,
                    isBought: false
                };
                this.shoppingListService.editItem(item.idShoppingList, itemEdited).then((result) => {
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

    fastAddingItems() {
        const data = {
            title: 'Add items fast',
            inputPlaceholder: 'Name item',
            shoppingItems: [],
            errorMessage: 'Name can\'t be empty'
        };
        this.dialogService.openFastAddItems(data);
    }

}

