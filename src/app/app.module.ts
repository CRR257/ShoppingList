import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from './shared/environments/environment';
import { AuthService } from './shared/services/auth/auth-service';
import { UtilsMathService } from './shared/services/utils/utils-math.service';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileModule } from './components/profile/profile.module';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { DocumentComponent } from './components/document/document.component';
import { DialogComponent } from './components/dialog/dialog.component';

// Module
import { AppRoutingModule } from './app-routing.module';
import { ShoppingListModule } from './components/shopping-list/shopping-list.module';
import { MaterialModule } from './shared/material-module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    HeaderComponent,
    DocumentComponent,
    DialogComponent,
    NotificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    ProfileModule,
    ShoppingListModule,
    EditorModule,
    MatMenuModule,
    MatSnackBarModule,
  ],
  providers: [AuthService, UtilsMathService],
  bootstrap: [AppComponent],
})
export class AppModule {}
