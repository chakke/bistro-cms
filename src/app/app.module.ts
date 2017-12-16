import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { HttpClientModule } from '@angular/common/http';
import { BistroProvider } from '../providers/bistro/bistro';

// var firebaseConfig = {
//   apiKey: "AIzaSyDMEZoEtmor-T166lP9bGCR9FxqQP4eGik",
//   authDomain: "bistrodancerapp.firebaseapp.com",
//   databaseURL: "https://bistrodancerapp.firebaseio.com",
//   projectId: "bistrodancerapp",
//   storageBucket: "bistrodancerapp.appspot.com",
//   messagingSenderId: "773087969883"
// };

var firebaseConfig = {
  apiKey: "AIzaSyDG_pauTdXELEjd-kB2FuEji4PJUURVQ78",
  authDomain: "bistro-dancer.firebaseapp.com",
  databaseURL: "https://bistro-dancer.firebaseio.com",
  projectId: "bistro-dancer",
  storageBucket: "bistro-dancer.appspot.com",
  messagingSenderId: "796575514827"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      mode : "md"
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BistroProvider
  ]
})
export class AppModule { }
