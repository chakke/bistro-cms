import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodSalePage } from './food-sale';

@NgModule({
  declarations: [
    FoodSalePage,
  ],
  imports: [
    IonicPageModule.forChild(FoodSalePage),
  ],
})
export class FoodSalePageModule {}
