import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirebaseImagePickerPage } from './firebase-imagepicker';

@NgModule({
  declarations: [
    FirebaseImagePickerPage,
  ],
  imports: [
    IonicPageModule.forChild(FirebaseImagePickerPage),
  ],
})
export class FirebaseImagePickerPageModule { }
