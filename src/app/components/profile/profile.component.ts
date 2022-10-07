import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { UtilsMathService } from 'src/app/shared/services/utils/utils-math.service';
import { SupermarketModel } from 'src/app/shared/models/supermarket.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  supermarketsListFormControl: FormGroup;
  supermarket: SupermarketModel[];
  supermarketListUserIsEmpty: boolean;
  supermarketsChecked = [];
  messageCardDialog: string;
  cardDialog = false;
  userId: string;
  spinner = false;

  constructor(
    public profileService: ProfileService,
    public router: Router,
    public authService: AuthService,
    public utilsMathService: UtilsMathService
  ) {}

  ngOnInit(): void {
    this.getUserLogged();
    this.userHasDefinedASupermarketList();
  }

  getUserLogged() {
    this.userId = this.authService.getUserLogged().uid;
  }

  userHasDefinedASupermarketList() {
    const userSupermarkets = 'supermarketsUserList-' + `${this.userId}`;
    this.profileService
      .getUserSuperMarkets(userSupermarkets)
      .subscribe((supermarkets) => {
        Object.keys(supermarkets).length === 0
          ? (this.supermarketListUserIsEmpty = true)
          : (this.supermarketListUserIsEmpty = false);
        this.initFormControls(this.supermarketListUserIsEmpty);
      });
  }

  initFormControls(userHasSupermarketList: boolean) {
    this.supermarketsListFormControl = new FormGroup({
      supermarkets: userHasSupermarketList
        ? this.getSupermarketDefaultList()
        : this.getSupermarketUserList(),
    });
  }

  getSupermarketDefaultList(): FormGroup {
    const controls: { [p: string]: AbstractControl } = {};
    this.profileService.getSupermarkets().subscribe((supermarket) => {
      // @ts-ignore
      this.supermarket = this.utilsMathService.sortItemsByName(supermarket);
      this.supermarket.forEach((s) => {
        controls[s.name] = new FormControl({ checked: s.checked });
      });
    });
    return new FormGroup(controls);
  }

  getSupermarketUserList(): FormGroup {
    const controls: { [p: string]: AbstractControl } = {};
    const userSupermarkets = 'supermarketsUserList-' + `${this.userId}`;
    this.profileService
      .getUserSuperMarkets(userSupermarkets)
      .subscribe((supermarket) => {
        if (Object.keys(supermarket).length > 0) {
          // @ts-ignore
          this.supermarket = this.utilsMathService.sortItemsByName(supermarket);
          this.supermarket = Object.values(this.supermarket[0]);
        }
        for (const item in Object(this.supermarket)) {
          if (Object(this.supermarket[item as unknown as number])) {
            controls[Object(this.supermarket[item as unknown as number]).name] =
              new FormControl({
                checked: Object(this.supermarket[item as unknown as number])
                  .checked,
              });
          }
        }
      });
    return new FormGroup(controls);
  }

  onChangeChecked(supermarketName: string) {
    const currentCheckedValue =
      this.supermarketsListFormControl.controls.supermarkets.get(
        supermarketName
      )?.value.checked;
    this.supermarketsListFormControl.controls.supermarkets
      .get(supermarketName)
      ?.patchValue({ checked: !currentCheckedValue });
  }

  onSubmit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.spinner = true;
    this.getSupermarketsChecked();
    if (this.supermarketListUserIsEmpty) {
      this.profileService.createUserSupermarketList(this.supermarketsChecked);
    }
    this.profileService
      .updateUserSupermarketList(this.supermarketsChecked)
      .then((result) => {
        this.spinner = false;
        this.cardDialog = true;
        this.messageCardDialog = result;
      })
      .catch((error) => {
        this.spinner = false;
        this.cardDialog = true;
        this.messageCardDialog = error;
      });
  }

  getSupermarketsChecked() {
    this.supermarketsChecked = [];
    for (let item = 0; item < this.supermarket.length; item++) {
      if (
        this.supermarketsListFormControl.controls.supermarkets.get(
          this.supermarket[item].name
        )?.value.checked
      ) {
        this.supermarketsChecked.push({
          // @ts-ignore
          name: this.supermarket[item].name, // @ts-ignore
          checked: true,
        });
      } else {
        this.supermarketsChecked.push({
          // @ts-ignore
          name: this.supermarket[item].name, // @ts-ignore
          checked: false,
        });
      }
    }
  }

  closeDialog() {
    this.cardDialog = false;
  }
}
