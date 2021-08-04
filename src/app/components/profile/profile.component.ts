import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../shared/services/profile/profile.service';
import { Supermarket } from '../../shared/models/supermarket.interface';
import {FormGroup, FormControl, AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth/auth-service';
import {UtilsMathService} from '../../shared/services/utils/utils-math.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  userId = '';
  supermarketsListFormControl: FormGroup;
 supermarket: Supermarket[];
  supermarketListUserIsEmpty: boolean;
  supermarketListId: string;

  constructor(public profileService: ProfileService,
              public router: Router, public authService: AuthService, public utilsMathService: UtilsMathService ) {
  }

  ngOnInit(): void {
    this.getUserLogged();
    this.userHasDefinedASupermarketList();
   // this.initFormControls();
  }

  getUserLogged() {
    this.userId = this.authService.getUserLogged().id;
  }

  userHasDefinedASupermarketList() {
    const userSupermarkets = 'supermarketsUserList-' + `${this.userId}`;
    this.profileService.getUserSuperMarkets(userSupermarkets).subscribe(supermarkets => {
      Object.keys(supermarkets).length === 0 ?  this.supermarketListUserIsEmpty = true :  this.supermarketListUserIsEmpty = false;
      // if (Object.keys(supermarkets).length === 0) {
      //   this.supermarketListUserIsEmpty = true;
      //
      // } else {
      //   this.supermarketListUserIsEmpty = false;
      //
      // }
      this.initFormControls(this.supermarketListUserIsEmpty);
    });
  }


  initFormControls(userHasSupermarketList: boolean) {
    this.supermarketsListFormControl = new FormGroup({
      supermarkets: userHasSupermarketList ? this.getSupermarketDefaultList() : this.getSupermarketUserList()
    });
    console.log(this.supermarketsListFormControl);
  }

  getSupermarketDefaultList(): FormGroup {
    const controls: { [p: string]: AbstractControl } = {};
    this.profileService.getSupermarkets().subscribe(supermarket => {
      this.supermarket = this.utilsMathService.sortItemsByName(supermarket);
      console.log( this.supermarket );
      this.supermarket.forEach(s => {
        controls[s.name] = new FormControl({checked: s.checked});
      });
    });
    return new FormGroup(controls);
  }

  getSupermarketUserList(): FormGroup {
    const controls: { [p: string]: AbstractControl } = {};
    const userSupermarkets = 'supermarketsUserList-' + `${this.userId}`;
    console.log('userSupermarkets', userSupermarkets);
    this.profileService.getUserSuperMarkets(userSupermarkets).subscribe(supermarket => {
      if (Object.keys(supermarket).length > 0) {
        this.supermarket = this.utilsMathService.sortItemsByName(supermarket);
        this.supermarket = Object.values(this.supermarket[0]);
      }
      const supermarketUserList = Object(this.supermarket[0]);
      for (const item in Object(this.supermarket)) {
        // console.log(Object.values(this.supermarket[item]).name)
        console.log(Object(this.supermarket[item]));
        controls[Object(this.supermarket[item]).name] = new FormControl({checked: Object(this.supermarket[item]).checked});
      }
    });
    return new FormGroup(controls);
  }

  onChangeChecked(supermarketName) {
    console.log(supermarketName);
    console.log(this.supermarketsListFormControl);
    const currentCheckedValue = this.supermarketsListFormControl.controls.supermarkets.get(supermarketName).value.checked;
    this.supermarketsListFormControl.controls.supermarkets.get(supermarketName).patchValue({ checked : !currentCheckedValue});
  }

  onSubmit() {
  console.log('submit');
  const supermarketsChecked = [];
    // tslint:disable-next-line:prefer-for-of
  for (let item = 0; item < this.supermarket.length; item ++) {
      if (this.supermarketsListFormControl.controls.supermarkets.get(this.supermarket[item].name).value.checked) {
        supermarketsChecked.push({name: this.supermarket[item].name, checked: true});
      } else {
        supermarketsChecked.push({name: this.supermarket[item].name, checked: false});
      }
    }
  console.log('supermarketsChecked', supermarketsChecked);
  if (this.supermarketListUserIsEmpty) {
    this.profileService.createUserSupermarketList(supermarketsChecked);
  }
  this.profileService.modifyUserSupermarketList(supermarketsChecked);


   }

}
