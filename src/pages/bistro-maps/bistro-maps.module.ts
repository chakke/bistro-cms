import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BistroMapsPage } from './bistro-maps';

@NgModule({
  declarations: [
    BistroMapsPage,
  ],
  imports: [
    IonicPageModule.forChild(BistroMapsPage),
  ],
})
export class BistroMapsPageModule {}
