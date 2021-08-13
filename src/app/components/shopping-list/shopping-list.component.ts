import {Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { Router } from '@angular/router';
import { ShoppingListService } from 'src/app/shared/services/shoppinglist/shoppinglist.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NewShoppingItem } from '../../shared/models/shoppingList.interface';
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
    placeToBuyIt: new FormControl('', Validators.required),
    checked: new FormControl('')
  });

  constructor(public authService: AuthService,
              public shoppingListService: ShoppingListService,
              public router: Router,
              public utilsMathService: UtilsMathService,
              public profileService: ProfileService) {
  }

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
      const result = item.reduce(function(r, a) {
        r[a.placeToBuyIt] = r[a.placeToBuyIt] || [];
        r[a.placeToBuyIt].push(a);
        return r;
      }, Object.create(null));

      const supermarkets = Object.entries(result);
      this.groupedSupermarket = this.utilsMathService.sort(supermarkets);

      for (let i = 0; i < this.groupedSupermarket.length ; i++) {
        this.utilsMathService.sortItemsByNameBoughtProperty(this.groupedSupermarket[i]);
      }
      this.loading = false;
    });
  }

  deleteItem(item) {
    this.shoppingListService.deleteItem(item);
    this.getShoppingList();
  }

  checkItem(item) {
    item.isBought = !item.isBought;
    const itemBought = {
      name: item.name,
      placeToBuyIt: item.placeToBuyIt,
      isBought: item.isBought
    };
    this.shoppingListService.editItem(item.idShoppingList, itemBought);
    this.getShoppingList();
  }

  createItem(form: NewShoppingItem) {
    if (form.name.trim() === '' || form.placeToBuyIt === '') {
      return;
    }
    const item = {
      name: form.name.trim(),
      placeToBuyIt: form.placeToBuyIt,
      isBought: false
    };
    this.shoppingListService.newItem(item);
    this.getShoppingList();
    this.newItemForm.reset({ name: ' ', placeToBuyIt: form.placeToBuyIt});
  }

  closeDialog() {
    this.cardDialog = false;
  }
}

