import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { AuthService } from './shared/services/auth/auth-service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// Firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AngularFireStorageModule, StorageBucket} from '@angular/fire/storage';
import { AngularFireStorageModule } from '@angular/fire/storage';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule, 
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [AuthService],
  // {provide: StorageBucket, useValue: 'gs://ourshoppinglist-3ba7d.appspot.com'}],
  bootstrap: [AppComponent]
})
export class AppModule { }


// { Realtime Database
//   "rules": {
//     ".read": "auth === null",
//     ".write": "auth === null"
//   }
// }

// https://www.youtube.com/playlist?list=PL_9MDdjVuFjFPCptPjhr3iuzPK0_Nrm0s
// https://www.youtube.com/watch?v=2BxXLU4F34I&list=PL_9MDdjVuFjFPCptPjhr3iuzPK0_Nrm0s&index=16