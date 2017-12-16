import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BistroStaffsPage } from './bistro-staffs';

@NgModule({
  declarations: [
    BistroStaffsPage,
  ],
  imports: [
    IonicPageModule.forChild(BistroStaffsPage),
  ],
})
export class BistroStaffsPageModule {}
