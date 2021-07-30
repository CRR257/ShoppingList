import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { Router } from "@angular/router";
import { ShoppingListService } from 'src/app/shared/services/shoppinglist/shoppinglist.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as groupBy from "lodash/groupBy";
import { ShoppingList, NewShoppingItem } from '../../shared/models/shoppingList.interface';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  userId: string = '';
  loading: boolean = false;
  shoppingListBonPreu: ShoppingList[] = [];
  shoppingListBonArea: ShoppingList[] = [];
  shoppingListOthers: ShoppingList[] = [];
  itemToCheck: string;

  newItemForm = new FormGroup ({
    nameItem: new FormControl('', Validators.required),
    placeToBuyIt: new FormControl('bonPreu', Validators.required),
    checked: new FormControl('')
  });

  constructor(public authService: AuthService,
    public shoppingListService: ShoppingListService,
    public router: Router,
    public ngZone: NgZone) {
  }

  public shoppingLists$: Observable<ShoppingList[]>;
  public shoppingListUser$: Observable<ShoppingList[]>

  ngOnInit(): void {
    this.loading = true;
   this.getUserLogged();
   this.getShoppingList();
  }

  getUserLogged() {
    let userLogged = JSON.parse(localStorage.getItem('userLogged'));
    this.userId = userLogged[0].id;
  }

  getShoppingList() {
    let userShoppingList = 'shoppingList-' + `${this.userId}`
    this.shoppingListService.getShoppingUser(userShoppingList).subscribe(apps => {
    let itemsSortedByName = apps.sort((a,b) => (a.nameItem < b.nameItem) ? -1 : ((a.nameItem > b.nameItem) ? 1 : 0 ))
    let itemsSortedByNameAndState = itemsSortedByName.sort((a,b) => (a.isBuyed < b.isBuyed) ? -1 : ((a.isBuyed > b.isBuyed) ? 1 : 0 ))
    let grouppedApps = groupBy(itemsSortedByNameAndState,"placeToBuyIt");
      console.log(grouppedApps)
      for (let i in grouppedApps) {
        if (i === 'bonArea') {
          this.shoppingListBonArea = grouppedApps[i];
        } else if (i === 'bonPreu') {
          this.shoppingListBonPreu = grouppedApps[i];
        } else {
          this.shoppingListOthers = grouppedApps[i];
        }
      }
      console.log("bon area => ", this.shoppingListBonArea)
      console.log("bon preu => ", this.shoppingListBonPreu)
      this.loading = false;
    }, error => {
      console.log(error)
    } );
  }

  deleteItem(item) {
    this.shoppingListService.deleteItem(item);
    this.resetLists();
    this.getShoppingList();
  }

  resetLists() {
    this.shoppingListBonPreu = [];
    this.shoppingListBonArea = [];
    this.shoppingListOthers = [];
  }

  checkItem(item) {
    item.isBuyed = !item.isBuyed;
    let itemBuyed = {
      nameItem: item.nameItem,
      placeToBuyIt: item.placeToBuyIt,
      isBuyed: item.isBuyed
    }
    this.shoppingListService.editItem(item.id, itemBuyed);
    this.getShoppingList();
  }

  createItem(form: NewShoppingItem) {
    if (form.nameItem === '') {
      return;
    }
    let item = {
      nameItem: form.nameItem,
      placeToBuyIt: form.placeToBuyIt,
      isBuyed: false
    }
    this.shoppingListService.newItem(item);
    this.getShoppingList();
    this.newItemForm.controls.nameItem.reset();
    this.newItemForm.controls.placeToBuyIt.setValue('bonPreu');
  }
}

