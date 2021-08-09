import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { Router } from '@angular/router';
import { ShoppingListService } from 'src/app/shared/services/shoppinglist/shoppinglist.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as groupBy from 'lodash/groupBy';
import { ShoppingList, NewShoppingItem } from '../../shared/models/shoppingList.interface';
import {UtilsMathService} from '../../shared/services/utils/utils-math.service';
import {ProfileService} from '../../shared/services/profile/profile.service';
import {Supermarket} from '../../shared/models/supermarket.interface';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  userId =  '';
  loading = false;
  userSupermarket: Supermarket[];
  groupedSupermarket: any;
  accordionExpanded = true;
  cardDialog = false;
  supermarketLastSelected = '';


  newItemForm = new FormGroup ({
    name: new FormControl('', Validators.required),
    placeToBuyIt: new FormControl('BonPreu', Validators.required),
    checked: new FormControl('')
  });

  constructor(public authService: AuthService,
              public shoppingListService: ShoppingListService,
              public router: Router,
              public utilsMathService: UtilsMathService,
              public profileService: ProfileService) {
  }

  // public shoppingLists$: Observable<ShoppingList[]>;
  // public shoppingListUser$: Observable<ShoppingList[]>;

  setAccordion(accordionOpen) {
    this.accordionExpanded = accordionOpen;
  }

  ngOnInit(): void {
    this.loading = true;
    this.getUserLogged();
    this.getUserSupermarkets();
    this.getShoppingList();
  }

  getUserLogged() {
    this.userId = this.authService.getUserLogged().id;
  }

  getUserSupermarkets() {
    const userSupermarkets = 'supermarketsUserList-' + `${this.userId}`;
    this.profileService.getUserSuperMarkets(userSupermarkets).subscribe(supermarket => {
      if (Object.keys(supermarket).length > 0) {
        this.userSupermarket = Object.values(supermarket[0]);
        this.userSupermarket = this.userSupermarket.filter( s => s.checked);
      }
      console.log('this.userSupermarket', this.userSupermarket);
    });
  }

  getShoppingList() {
    const userShoppingList = 'shoppingList-' + `${this.userId}`;
    this.shoppingListService.getShoppingUser(userShoppingList).subscribe(item => {
      const itemsSortedByName =  this.utilsMathService.sortItemsByName(item);
      const itemsSortedByNameAndState = this.utilsMathService.sortItemsByBoughtProperty(itemsSortedByName);
      console.log('itemsSortedByNameAndState', itemsSortedByNameAndState);
      const groupedSupermarket = groupBy(itemsSortedByNameAndState, 'placeToBuyIt');
      this.groupedSupermarket = Object.values(groupedSupermarket);
      console.log(typeof(this.groupedSupermarket));
      console.log(this.groupedSupermarket);
      // for (const i in groupedSupermarket) {
      //   if (i === 'bonArea') {
      //     this.shoppingListBonArea = groupedSupermarket[i];
      //   } else if (i === 'bonPreu') {
      //     this.shoppingListBonPreu = groupedSupermarket[i];
      //   } else {
      //     this.shoppingListOthers = groupedSupermarket[i];
      //   }
      // }
      this.loading = false;
    }, error => {
      console.log(error);
    } );
  }

  deleteItem(item) {
    this.accordionExpanded = true;
    this.shoppingListService.deleteItem(item);
    // this.resetLists();
    this.getShoppingList();
  }

  checkItem(item) {
    // $event.stopPropagation();
    // this.accordionExpanded = true;
    item.isBought = !item.isBought;
    const itemBuyed = {
      name: item.name,
      placeToBuyIt: item.placeToBuyIt,
      isBought: item.isBought
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
      isBought: false
    };
    this.supermarketLastSelected = form.placeToBuyIt;
    this.shoppingListService.newItem(item);
    this.getShoppingList();
    this.newItemForm.controls.name.reset();
  }

  toggleAccordion() {
    this.accordionExpanded = !this.accordionExpanded;
  }

  closeDialog() {
    this.cardDialog = false;
  }
}

