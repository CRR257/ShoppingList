import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';
import { ProfileService } from '../../shared/services/profile/profile.service';
import {AuthService} from '../../shared/services/auth/auth-service';
import {UtilsMathService} from '../../shared/services/utils/utils-math.service';
import { Supermarket } from '../../shared/models/supermarket.interface';

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
  supermarketsChecked = [];

  constructor( public profileService: ProfileService,
               public router: Router,
               public authService: AuthService,
               public utilsMathService: UtilsMathService ) {}

  ngOnInit(): void {
    this.getUserLogged();
    this.userHasDefinedASupermarketList();
  }

  getUserLogged() {
    this.userId = this.authService.getUserLogged().id;
  }

  userHasDefinedASupermarketList() {
    const userSupermarkets = 'supermarketsUserList-' + `${this.userId}`;
    this.profileService.getUserSuperMarkets(userSupermarkets).subscribe(supermarkets => {
      Object.keys(supermarkets).length === 0 ?  this.supermarketListUserIsEmpty = true :  this.supermarketListUserIsEmpty = false;
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
    this.profileService.getUserSuperMarkets(userSupermarkets).subscribe(supermarket => {
      if (Object.keys(supermarket).length > 0) {
        this.supermarket = this.utilsMathService.sortItemsByName(supermarket);
        this.supermarket = Object.values(this.supermarket[0]);
      }
      for (const item in Object(this.supermarket)) {
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
    this.getSupermarketsChecked();
    if (this.supermarketListUserIsEmpty) {
      this.profileService.createUserSupermarketList(this.supermarketsChecked);
    }
    this.profileService.modifyUserSupermarketList(this.supermarketsChecked);
  }

  getSupermarketsChecked() {
    this.supermarketsChecked = [];
    // tslint:disable-next-line:prefer-for-of
    for (let item = 0; item < this.supermarket.length; item ++) {
      if (this.supermarketsListFormControl.controls.supermarkets.get(this.supermarket[item].name).value.checked) {
        this.supermarketsChecked.push({name: this.supermarket[item].name, checked: true});
      } else {
        this.supermarketsChecked.push({name: this.supermarket[item].name, checked: false});
      }
    }
  }
}
