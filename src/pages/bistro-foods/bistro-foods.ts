import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';

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
  selector: 'page-bistro-foods',
  templateUrl: 'bistro-foods.html',
})
export class BistroFoodsPage {
  foodsRef: AngularFirestoreCollection<Food>;
  foods: Observable<Food[]>;
  mFoodDatas: Array<Food> = [];
  mFoods: Array<Food> = [];
  mSearchStr: string = "";
  mPageNumber: number = 1;
  constructor(public mAngularHttpClient: HttpClient, public mAngularFirestore: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this._ConnectToFirebase();
    // this._UploadFoodsData();
  }

  onClickFood(food: Food) {
    this.navCtrl.push("FoodDetailPage", {
      food: food
    });
  }

  onClickBack() {
    this._GoHome();
  }

  _GoHome() {
    if (this.navCtrl.getViews().length > 1) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot("HomePage");
    }
  }


  _ConnectToFirebase() {
    this.foodsRef = this.mAngularFirestore.collection("products/bistro/foods");
    this.foods = this.foodsRef.valueChanges();

    this.foodsRef.snapshotChanges().subscribe(
      snapshot => {
        this.mFoodDatas = [];
        snapshot.forEach(item => {
          let foodData = item.payload.doc.data();
          this.mFoodDatas.push(this.getFoodFromFirebaseData(foodData));
        });
        this._DoSearch();
      }
    );
  }
  getFoodFromData(foodData: any): Food {
    let food: Food = {
      id: "",
      album_id: "",
      category: -1,
      currency: "",
      description: "",
      en_name: "",
      image: "",
      name: "",
      options: [],
      paper: "",
      price: 0,
      sales: [],
      size: "",
      state: -1,
      type: -1,
      unit: "",
    };


    if (foodData) {
      food.id = foodData.id;
      food.category = foodData.category;
      food.image = foodData.img;
      food.name = foodData.vie;
      food.en_name = foodData.en;
      food.price = foodData.price;
      food.currency = foodData.currency;
      if (food.category == 0) food.type = 0;
      else if (food.category == 18) food.type = 2;
      else food.type = 1;
    }

    return food;
  }
  getFoodFromFirebaseData(foodData: any): Food {
    let food: Food = {
      id: foodData.id,
      album_id: foodData.album_id,
      category: foodData.category,
      currency: foodData.currency,
      description: foodData.description,
      en_name: foodData.en_name,
      image: foodData.image,
      name: foodData.name,
      options: foodData.options,
      paper: foodData.paper,
      price: foodData.price,
      sales: foodData.sales,
      size: foodData.size,
      state: foodData.state,
      type: foodData.type,
      unit: foodData.unit
    };

    return food;
  }
  _UploadFoodsData() {

    this.mAngularHttpClient.get('./assets/data/foods.json').subscribe(data => {
      let foodsRef = this.mAngularFirestore.collection("products/bistro/foods");
      let foods = data["foods"];
      for (var foodDataKey in foods) {
        let foodData = foods[foodDataKey];
        let food = this.getFoodFromData(foodData);
        if (food.image.length > 0) {
          firebase.storage().ref('uploads/images/foods/' + foodData['img']).getDownloadURL().then(
            url => {
              food.image = url;
              console.log(url);
              foodsRef.doc("" + food.id).set(food);
            }
          );
        } else {
          console.log(food);
        }
      }
    });

  }


  onSearchInput(event) {
    this._DoSearch();
  }
  _SeachMatch(food: Food, search: string) {
    let strToSearch = food.name + "  #" + food.id + "  " + food.en_name;
    strToSearch = strToSearch.toLowerCase();
    strToSearch = this._BodauTiengViet(strToSearch);
    return strToSearch.indexOf(search) != -1;

  }
  _BodauTiengViet(str: string): string {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    return str;
  }
  _DoSearch() {
    let strSearch: string = this.mSearchStr.trim().toLowerCase();
    strSearch = this._BodauTiengViet(strSearch);
    this.mFoods = this.mFoodDatas.filter(item => {
      return this._SeachMatch(item, strSearch);
    });    
  }

  onClickAddFood() {
    this.navCtrl.push("AddFoodPage");
  }
}
