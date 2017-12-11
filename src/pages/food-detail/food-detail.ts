import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


interface FoodSale {
  id: string;
  name: string;
  percent: number;
  state: number;
}

interface FoodOption {
  id: string;
  name: string;
  description: string;
  state: number;
  type: number;
  price: number;
}

interface Food {
  id: string;
  /**Tiền tệ */
  currency: string;
  /**Tên tiếng việt */
  name: string;
  /**Tên tiếng anh */
  en_name: string;
  /**Mô tả */
  description: string;
  /**Hình ảnh minh họa */
  image: string;
  /**Giá sản phẩm */
  price: number;
  /**Những option bổ sung cho sản phẩm này */
  options: Array<FoodOption>;
  /**Những chương trình sale áp dụng cho sản phẩm này */
  sales: Array<FoodSale>;
  /**Hình ảnh của món ăn - chứa id liên kết đến album đó. */
  album_id: string;
  /** Bài viết về sản phẩm này */
  paper: string;
  /**Kích thước */
  size: string;
  /**Đơn vị sử dụng : Bát, Suất, Đĩa, ... */
  unit: string;
  /**Trạng thái nào : sẵn sàng phục vụ, hết hàng, ngừng kinh doanh */
  state: number;
  /**Nhóm nào : đồ ăn, thức uống, khác ... */
  type: number;
  /**Loại nào : cafe, matcha, trà sữa, ăn sáng , ... */
  category: number;
}



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
