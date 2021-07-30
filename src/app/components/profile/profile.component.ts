import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../shared/services/profile/profile.service';
import { Supermarket } from '../../shared/models/supermarket.interface';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  supermarket: Supermarket[];
  form: FormGroup;
    ordersData =  [];

  get ordersFormArray() {
    return this.form.controls.orders as FormArray;
  }

  constructor(public profileService: ProfileService,
    private formBuilder: FormBuilder) {

    // this.form = this.formBuilder.group({
    // orders: new FormArray([])
    // });
  }

  // https://blog.angular-university.io/angular-form-array/

  supermarketForm = this.formBuilder.group({
   supermarketName: new FormControl(''),
  });
    // supermarketsUser: new FormControl('')

  ngOnInit(): void {
    this.getSupermarketsList();
  }

  getSupermarketsList() {
    this.profileService.getSupermarkets().subscribe(s => {
      this.supermarket = s.sort((a,b) => (a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0 ));
    })
    // this.supermarkets = this.profileService.getAllSupermarkets();
  }

 private addCheckBoxes() {
  this.ordersData.forEach(() => this.ordersFormArray.push(new FormControl(false)));
 }
  submit() {
  console.log('submit')
  console.log(this.supermarketForm)
     const selectedOrderIds = this.form.value.orders
       .map((checked, i) => checked ? this.ordersData[i].id : null)
       .filter(v => v !== null);
     console.log(selectedOrderIds);
   }

}
