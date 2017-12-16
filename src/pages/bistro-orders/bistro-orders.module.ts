import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BistroOrdersPage } from './bistro-orders';

@NgModule({
  declarations: [
    BistroOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(BistroOrdersPage),
  ],
})
export class BistroOrdersPageModule {}
