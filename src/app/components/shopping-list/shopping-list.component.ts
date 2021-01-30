import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { Router } from "@angular/router";
import { ShoppingListService } from 'src/app/shared/services/shoppinglist/shoppinglist.service';
import { ShoppingList, NewItem, User } from 'src/app/shared/models/user.interface';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map, toArray, mergeMap } from 'rxjs/operators';
import * as groupBy from "lodash/groupBy";

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
  shoppingListAltres: ShoppingList[] = [];
  itemToCheck: string;

  newItemForm = new FormGroup ({
    nameItem: new FormControl('', Validators.required),
    placeToBuyIt: new FormControl('', Validators.required),
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
   this.getUserLogged();
   this.getShoppingList();
  }

  getUserLogged() {
    let userLogged = JSON.parse(localStorage.getItem('userLogged'));
    this.userId = userLogged[0].id;
  }

  getShoppingList() {
    let userShoppingList = 'shoppingList-' + `${this.userId}`
    //this.shoppingListUser$ = this.shoppingListService.getShoppingUser(userShoppingList);
    this.shoppingListService.getShoppingUser(userShoppingList).subscribe(apps => {
    let grouppedApps = {}
    grouppedApps = groupBy(apps,"placeToBuyIt");
      console.log(grouppedApps)
      console.log(typeof(grouppedApps))
      for (let i in grouppedApps) {
        if (i === 'bonArea') {
          this.shoppingListBonArea = grouppedApps[i];
        } else if (i === 'bonPreu') {
          this.shoppingListBonPreu = grouppedApps[i];
        } else {
          this.shoppingListAltres = grouppedApps[i];
        }
      }

      console.log("bon area => ", this.shoppingListBonArea)
      console.log("bon preu => ", this.shoppingListBonPreu)
      this.loading = false;
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
    this.shoppingListAltres = [];
  }

  // editeItem(id, item) {
  //   console.log(item)
  //   this.shoppingListService.editItem(id, item)
  // }

  checkItem(item) {
    item.isBuyed = !item.isBuyed;
    let itemBuyed = {
      nameItem: item.nameItem,
      placeToBuyIt: item.placeToBuyIt,
      isBuyed: item.isBuyed
    }
    this.shoppingListService.editItem(item.id, itemBuyed)
  }

  createItem(form: NewItem) {
    console.log(form)
    let item = {
      nameItem: form.nameItem,
      placeToBuyIt: form.placeToBuyIt,
      isBuyed: false
    }
    this.shoppingListService.newItem(item);
    this.getShoppingList()
  }
}

// getUserLogged() {
  //   (async () => {
  //     this.loading = true;
  //       await timeout(2 * 1000);
  //       let user = JSON.parse(localStorage.getItem('userLogged'));
  //       if (typeof user === "object" && !Array.isArray(user)) {
  //         this.userId = user.uid;
  //       } else {
  //         this.userId = user[0].uid;
  //       }
  //       console.log(user)
  //       this.getShoppingList();
  //   })();

  //   function timeout(ms) {
  //       return new Promise(resolve => setTimeout(resolve, ms));
  //   }
  // }

