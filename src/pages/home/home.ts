import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

interface ItemPage {
  name: string;
  page: string;
}


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  items: Array<ItemPage> = [
    { name: "Firebase Storage", page: "FirebaseStoragePage" },
    { name: "Update Viet Nam Province", page: "VietnamProvincePage" },
    { name: "Bistro Foods", page: "BistroFoodsPage" },
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  onClickItem(itemPage: ItemPage) {
    if (itemPage.page.length > 0) {
      this.navCtrl.push(itemPage.page);
    }
  }

}
