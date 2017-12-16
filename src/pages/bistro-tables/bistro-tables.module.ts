import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BistroTablesPage } from './bistro-tables';

@NgModule({
  declarations: [
    BistroTablesPage,
  ],
  imports: [
    IonicPageModule.forChild(BistroTablesPage),
  ],
})
export class BistroTablesPageModule {}
