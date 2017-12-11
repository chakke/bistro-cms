import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodOptionsPage } from './food-options';

@NgModule({
  declarations: [
    FoodOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(FoodOptionsPage),
  ],
})
export class FoodOptionsPageModule {}
