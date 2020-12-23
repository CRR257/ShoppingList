import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth-service';
import { Router } from "@angular/router";
import { ShoppingListService } from 'src/app/shared/services/shoppinglist/shoppinglist.service';
import { ShoppingList, NewItem } from 'src/app/shared/models/user.interface';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map, toArray, mergeMap } from 'rxjs/operators';
import * as groupBy from "lodash/groupBy";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userId: string = '';
  loading: boolean = false;
  //grouppedApps: ShoppingList[] = []
  //shoppingListUser: ShoppingList[];
  // shoppingListBonPreu: any
  // shoppingListBonArea: any;
  // shoppingListAltres: any
  shoppingListBonPreu: ShoppingList[] = [];
  shoppingListBonArea: ShoppingList[] = [];
  shoppingListAltres: ShoppingList[] = [];
  newItemForm = new FormGroup ({
    nameItem: new FormControl('', Validators.required),
    placeToBuyIt: new FormControl('', Validators.required)
  });

  constructor(public authService: AuthService,
    public shoppingListService: ShoppingListService,
    public router: Router,
    public ngZone: NgZone) { this.getData();}

  public shoppingLists$: Observable<ShoppingList[]>;
  public shoppingListUser$: Observable<ShoppingList[]>
  

  ngOnInit(): void {
    
  
    // function compare( a, b ) {
    //   if ( a.placeToBuyIt < b.placeToBuyIt ){
    //     return -1;
    //   }
    //   if ( a.placeToBuyIt > b.placeToBuyIt ){
    //     return 1;
    //   }
    //   return 0;
    // }
    
    // this.shoppingListUser.sort( compare );
    //console.log(this.shoppingListUser)
    
    // console.log(this.shoppingListUser$)
    // this.shoppingListUser$.pipe(map(results => console.log(results)))
    // this.shoppingListUser$
  }

  getData() {
    this.loading = true;
    //this.shoppingLists$ = this.shoppingListService.getShoppingList();
    let user = JSON.parse(localStorage.getItem('user'));
    console.log(user)
    this.userId = user.uid;
    //let collectionsName = 'shoppingList-' + `${this.userId}`
    let userShoppingList = 'shoppingList-' + `${this.userId}`
    this.shoppingListUser$ = this.shoppingListService.getShoppingUser(userShoppingList);
    this.shoppingListService.getShoppingUser(userShoppingList).subscribe(apps => {
      let grouppedApps = groupBy(apps,"placeToBuyIt");
      console.log(grouppedApps)
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
      // You can do whatever you want now
    } );
    //  function compare( a, b ) {
    //   if ( a.placeToBuyIt < b.placeToBuyIt ){
    //     return -1;
    //   }
    //   if ( a.placeToBuyIt > b.placeToBuyIt ){
    //     return 1;
    //   }
    //   return 0;
    // }
    
    // this.shoppingListUser.sort( compare );
    // console.log(this.shoppingListUser)
    
    // console.log(this.shoppingListUser$)
    // this.shoppingListService.getShoppingUser(userShoppingList).subscribe( shoppingList => {
    //   this.shoppingListUser = shoppingList;
    //   this.getShoppingList(this.shoppingListUser)
    // })
   
  }

  // getShoppingList(shoppingList) {
  //   for(let i=0; i < shoppingList.length; i++) {
  //     if( shoppingList[i].placeToBuyIt === 'bonArea') {
  //       this.shoppingListBonArea.push(shoppingList[i]);
  //     } else if (shoppingList[i].placeToBuyIt === 'bonPreu') {
  //       this.shoppingListBonPreu.push(shoppingList[i]);
  //     } else {
  //       this.shoppingListAltres.push(shoppingList[i]);
  //     }
  //   }
    
  //   console.log("bon area => ", this.shoppingListBonArea)
  //   console.log("bon preu => ", this.shoppingListBonPreu)
  // }

  deleteItem(item) {
    console.log(item)
  }

  editeItem(item) {
    console.log(item)
  }

  createItem(form: NewItem) {
    console.log(form)
    this.shoppingListService.newItem(form);
    this.getData();

  }
}


