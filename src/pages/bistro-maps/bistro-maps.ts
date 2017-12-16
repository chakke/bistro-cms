import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Map } from '../../providers/bistro/classes/map';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-bistro-maps',
  templateUrl: 'bistro-maps.html',
})
export class BistroMapsPage {
  mMapsCollectionRef: AngularFirestoreCollection<Map>;
  mMaps: Observable<Map[]>;
  mSelectedMapID: string = "";
  constructor(
    public mAngularFirestore: AngularFirestore,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this._ConnectToFirebase();
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
    let restaurantID = "bistro";
    this.mMapsCollectionRef = this.mAngularFirestore.collection("restaurants/" + restaurantID + "/maps");
  }
}
