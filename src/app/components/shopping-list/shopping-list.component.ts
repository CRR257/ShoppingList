import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from 'src/app/shared/services/auth/auth-service';
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
    userSupermarketsChecked: Supermarket[];
    accordionExpanded = true;
    supermarketSelected;
    listIdsToDelete = [];
    supermarketsResults;

    newItemForm = new FormGroup({
        name: new FormControl('', Validators.required),
        supermarketId: new FormControl('', Validators.required),
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

    setAccordion(supermarketSelected) {
        // this.profileService.modifyUserSupermarketList(userSupermarketSelected).then(result => {
        //    console.log('result', result)
        // }).catch(error => {
        //     console.log('error', error)
        // });
        // this.supermarketsResults.item.showItems = !this.supermarketsResults.item.showItems;
        // I'm adding the showItems to false for each supermarket. call the profile component and change the sheoItems for true for ex.
    }

    ngOnInit(): void {
        this.getUserLogged();
        this.getUserSupermarkets();
        this.getShoppingList();
    }

    getUserLogged() {
        this.userId = this.authService.getUserLogged().uid;
    }

    getUserSupermarkets() {
        this.loading = true;
        let userSupermarketsGlobal: Supermarket[];
        const userSupermarkets = 'supermarketsUserList-' + `${this.userId}`;
        this.profileService.getUserSuperMarkets(userSupermarkets).subscribe(supermarket => {
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

    getShoppingList() {
        const userShoppingList = 'shoppingList-' + `${this.userId}`;
        this.shoppingListService.getShoppingUser(userShoppingList).subscribe(item => {
            const result = item.reduce(function(r, a) {
                if (a.placeToBuyIt) {
                    r[a.placeToBuyIt] = r[a.placeToBuyIt] || [];
                    r[a.id] = r[a.id] || '';
                    r[a.placeToBuyIt].push(a);
                    return r;
                }
            }, Object.create(null));

            // const supermarketSorted =  this.utilsMathService.sortItemsByName(result);
            // this.supermarketsResults = supermarketSorted;
            this.supermarketsResults = result;
            // for (const key in result) {
            //     for (let i = 0; i < result[key].length; i++) {
            //         this.supermarketsResults = this.utilsMathService.sortItemsByNameBoughtProperty(result[key][i]);
            //     }
            // }
            this.loading = false;
        });
    }

    deleteItem(item) {
        this.shoppingListService.deleteItem(item).then(result => {
            // this.openSnackBar(result);
        }).catch(error => {
            //  this.openSnackBar(error);
        });
    }

    // deleteAllItemsSupermarket() {
    //     const item = '';
    //     const listOfIds = [];
    //     // this.shoppingListService.deleteAllItemsCollection(item, listOfIds).then(result => {
    //     //     // this.openSnackBar(result);
    //     // }).catch(error => {
    //     //     this.openSnackBar(error);
    //     // });
    // }

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
                    supermarketId: item.supermarketId,
                    placeToBuyIt: this.supermarketSelected,
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
            supermarketId: item.supermarketId,
            isBought: item.isBought
        };
        this.shoppingListService.editItem(item.idShoppingList, itemBought);
        this.getShoppingList();
    }

    createItem(form: NewShoppingItem) {
        if (!form.supermarketId) {
            return;
        }
        if (form.name.trim() === '') {
            this.newItemForm.get('name').setErrors({nameError: true});
            return;
        }
        const item: NewShoppingItem = {
            name: form.name.trim(),
            placeToBuyIt: this.supermarketSelected,
            supermarketId: form.supermarketId,
            isBought: false

        };
        this.shoppingListService.newItem(item).then((result) => {
            //  this.openSnackBar(result);
            this.getShoppingList();
            this.newItemForm.reset({name: '', supermarketId: form.supermarketId});
            this.newItemForm.get('name').setErrors(null);
        }).catch((error) => {
            this.openSnackBar(error);
        });
    }

    getNameSupermarketSelected(supermarketName) {
        this.supermarketSelected = supermarketName;
    }
}

