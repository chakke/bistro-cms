import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BistroRestaurantsPage } from './bistro-restaurants';

@NgModule({
  declarations: [
    BistroRestaurantsPage,
  ],
  imports: [
    IonicPageModule.forChild(BistroRestaurantsPage),
  ],
})
export class BistroRestaurantsPageModule {}
