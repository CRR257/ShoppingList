import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { Router } from '@angular/router';
import { ShoppingListService } from 'src/app/shared/services/shoppinglist/shoppinglist.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as groupBy from 'lodash/groupBy';
import { ShoppingList, NewShoppingItem } from '../../shared/models/shoppingList.interface';
import {UtilsMathService} from '../../shared/services/utils/utils-math.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  userId =  '';
  loading = false;
  shoppingListBonPreu: ShoppingList[] = [];
  shoppingListBonArea: ShoppingList[] = [];
  shoppingListOthers: ShoppingList[] = [];
  itemToCheck: string;

  newItemForm = new FormGroup ({
    name: new FormControl('', Validators.required),
    placeToBuyIt: new FormControl('bonPreu', Validators.required),
    checked: new FormControl('')
  });

  constructor(public authService: AuthService,
              public shoppingListService: ShoppingListService,
              public router: Router,
              public utilsMathService: UtilsMathService,
              public ngZone: NgZone) {
  }

  public shoppingLists$: Observable<ShoppingList[]>;
  public shoppingListUser$: Observable<ShoppingList[]>;

  ngOnInit(): void {
    this.loading = true;
    this.getUserLogged();
    this.getShoppingList();
  }

  getUserLogged() {
    this.userId = this.authService.getUserLogged().id;
  }

  getShoppingList() {
    const userShoppingList = 'shoppingList-' + `${this.userId}`;
    this.shoppingListService.getShoppingUser(userShoppingList).subscribe(item => {
      const itemsSortedByName =  this.utilsMathService.sortItemsByName(item);
      const itemsSortedByNameAndState = this.utilsMathService.sortItemsByBoughtProperty(itemsSortedByName);
      const grouppedApps = groupBy(itemsSortedByNameAndState, 'placeToBuyIt');
      console.log(grouppedApps);
      for (const i in grouppedApps) {
        if (i === 'bonArea') {
          this.shoppingListBonArea = grouppedApps[i];
        } else if (i === 'bonPreu') {
          this.shoppingListBonPreu = grouppedApps[i];
        } else {
          this.shoppingListOthers = grouppedApps[i];
        }
      }
      this.loading = false;
    }, error => {
      console.log(error);
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
    const itemBuyed = {
      name: item.name,
      placeToBuyIt: item.placeToBuyIt,
      isBuyed: item.isBuyed
    };
    this.shoppingListService.editItem(item.id, itemBuyed);
    this.getShoppingList();
  }

  createItem(form: NewShoppingItem) {
    if (form.name === '') {
      return;
    }
    const item = {
      name: form.name,
      placeToBuyIt: form.placeToBuyIt,
      isBuyed: false
    };
    this.shoppingListService.newItem(item);
    this.getShoppingList();
    this.newItemForm.controls.name.reset();
    this.newItemForm.controls.placeToBuyIt.setValue('bonPreu');
  }
}

