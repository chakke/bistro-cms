import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Restaurant } from '../../providers/bistro/classes/restaurant';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { BistroProvider } from '../../providers/bistro/bistro';

@IonicPage()
@Component({
  selector: 'page-bistro-restaurants',
  templateUrl: 'bistro-restaurants.html',
})
export class BistroRestaurantsPage {
  mDataPath: string = "./assets/data/bistro_restaurants.json";
  mCollectionPath: string = "restaurants";
  mRestaurantsCollectionRef: AngularFirestoreCollection<Restaurant>;
  mRestaurants: Observable<Restaurant[]>;

  constructor(
    public mBistroProvider: BistroProvider,
    public mHttpClient: HttpClient,
    public mAngularFirestore: AngularFirestore,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidEnter() {
    console.log("Enter view Bistro Restaurants");
    this._ConnectToFirebase();
    this._UploadData();
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
    this.mRestaurantsCollectionRef = this.mAngularFirestore.collection(this.mCollectionPath);
    this.mRestaurants = this.mRestaurantsCollectionRef.valueChanges();
    this.mRestaurants.subscribe(data => {
      console.log(data);
    });

  }


  _UploadData() {
    console.log("Preparing to upload Data ...");
    let collectionRef = firebase.firestore().collection(this.mCollectionPath);
    collectionRef.get().then(data => {
      if (data && data.docs.length == 0) {
        this.mHttpClient.get(this.mDataPath).subscribe(rawData => {
          let items = rawData['restaurants'];
          items.forEach(itemData => {
            let item: Restaurant = {
              firebase_id: itemData.id,
              id: itemData.id,
              name: itemData.name,
              logo: itemData.logo,
              vendor_name: itemData.vendor_name,
              vendor_id: itemData.vendor_id,
              vendor_logo: itemData.vendor_logo,
              address: itemData.address,
              geopoint: new firebase.firestore.GeoPoint(itemData.geopoint.latitude, itemData.geopoint.longitude),
              hotline: itemData.hotline,
              state: itemData.state,
              time_open: itemData.time_open,
              time_close: itemData.time_close,
            }
            collectionRef.doc(item.id).set(item);
          });
          console.log('Upload Data has done');
        });

      } else {
        console.log("Already has data");
      }
    }).catch(error => {
      console.log("error ", error);
    });

  }


}
