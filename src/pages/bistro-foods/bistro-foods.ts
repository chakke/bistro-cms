import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';
import { Food } from '../../providers/bistro/classes/food';


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
    console.log("Enter view Bistro Food");

    //this._ConnectToFirebase();
    // this._UploadTypes();
    // this._UploadCategories();
    this._UploadUnits();
    this._UploadSizes();

    //this._UploadFoods();

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
    food.firebase_id = food.id;

    return food;
  }

  _UploadUnits() {
    this.mAngularHttpClient.get('./assets/data/food_units.json').subscribe(data => {
      let unitsRef = this.mAngularFirestore.collection("products/bistro/food_units");
      let units = data["units"];
      for (var dataKey in units) {
        let unit = units[dataKey];
        if (unit) {
          unit.firebase_id = unit.id;
          unitsRef.doc(unit.id).set(unit);
        }
      }
    });
  }
  _UploadSizes() {
    this.mAngularHttpClient.get('./assets/data/food_sizes.json').subscribe(data => {
      let sizesRef = this.mAngularFirestore.collection("products/bistro/food_sizes");
      let sizes = data["sizes"];
      for (var dataKey in sizes) {
        let size = sizes[dataKey];
        if (size) {
          size.firebase_id = size.id;
          sizesRef.doc(size.id).set(size);
        }
      }
    });
  }

  _UploadTypes() {
    this.mAngularHttpClient.get('./assets/data/food_types.json').subscribe(data => {
      let typesRef = this.mAngularFirestore.collection("products/bistro/food_types");
      let types = data["types"];
      for (var dataKey in types) {
        let type = types[dataKey];
        if (type) {
          type.firebase_id = type.id;
          typesRef.doc(type.id).set(type);
        }
      }
    });
  }
  _UploadCategories() {
    this.mAngularHttpClient.get('./assets/data/food_categories.json').subscribe(data => {
      let categoriesRef = this.mAngularFirestore.collection("products/bistro/food_categories");
      let categories = data["categories"];
      for (var dataKey in categories) {
        let category = categories[dataKey];
        if (category) {
          category.firebase_id = category.id;
          categoriesRef.doc(category.id).set(category);
        }
      }
    });
  }

  _UploadFoods() {
    this.mAngularHttpClient.get('./assets/data/bistro_foods.json').subscribe(data => {
      let foodsRef = this.mAngularFirestore.collection("products/bistro/foods");
      let foods = data["foods"];
      for (var foodDataKey in foods) {
        let food = foods[foodDataKey];
        food.firebase_id = food.id;

        if (food.image.length > 0) {
          firebase.storage().ref('uploads/images/foods/' + food.image).getDownloadURL().then(
            url => {
              food.image = url;
              foodsRef.doc(food.id).set(food);
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
