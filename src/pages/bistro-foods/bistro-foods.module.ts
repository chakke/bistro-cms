import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BistroFoodsPage } from './bistro-foods';

@NgModule({
  declarations: [
    BistroFoodsPage,
  ],
  imports: [
    IonicPageModule.forChild(BistroFoodsPage),
  ],
})
export class BistroFoodsPageModule {}
