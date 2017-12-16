import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { Food } from '../../providers/bistro/classes/food';


@IonicPage()
@Component({
  selector: 'page-add-food',
  templateUrl: 'add-food.html',
})
export class AddFoodPage {
  food: Food ;

  images = [];
  constructor(public mModalController: ModalController, public navCtrl: NavController, public navParams: NavParams) {
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

  onClickPickImage() {
    let modal = this.mModalController.create("FirebaseImagePickerPage", {
      mutiple_files: false
    });
    modal.present();
    modal.onDidDismiss(data => {
      console.log("Select Image Done : ", data);
      if (data && data.image) {
        this.food.image = data.image.url;
      }
    });
  }
  onClickPickImages() {
    let modal = this.mModalController.create("FirebaseImagePickerPage", {
      mutiple_files: true,
      images: this.images
    });
    modal.present();
    modal.onDidDismiss(data => {
      console.log("Select Image Done : ", data);
      if (data && data.images) {
        this.images = data.images;
      }
    });
  }

  onClickRemoveImage(image) {
    let idx = this.images.indexOf(image);
    if (idx != -1) {
      this.images.splice(idx, 1);
    }
  }
}
