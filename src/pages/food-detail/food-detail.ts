import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-food-detail',
  templateUrl: 'food-detail.html',
})
export class FoodDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  onClickSave() {
    this._GoHome();
  }
  onClickBack() {
    this._GoHome();
  }

  _GoHome() {
    if (this.navCtrl.getViews().length > 1) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot("BistroFoodsPage");
    }
  }


}
