import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule,FormBuilder} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import{ environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';

import { AppComponent } from './app.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { ChatbotpageComponent } from './chatbotpage/chatbotpage.component';
import { ProtectedComponent } from './protected/protected.component';
import { LogoutComponent } from './logout/logout.component';
import { provideHttpClient, withInterceptorsFromDi,withFetch } from '@angular/common/http';
import { ApiService } from './api.service';
import { SafeUrlPipe } from './safe.pipe';


@NgModule({
  declarations: [
    AppComponent,
    LoginpageComponent,
    ChatbotpageComponent,
    ProtectedComponent,
    LogoutComponent,
     SafeUrlPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
  ],
  exports:[FormsModule],
  providers: [
    provideClientHydration(),ApiService,provideHttpClient(withInterceptorsFromDi()),provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
