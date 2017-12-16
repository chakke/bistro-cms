import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Staff } from '../../providers/bistro/classes/staff';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { BistroProvider } from '../../providers/bistro/bistro';
@IonicPage()
@Component({
  selector: 'page-bistro-staffs',
  templateUrl: 'bistro-staffs.html',
})
export class BistroStaffsPage {
  mDataPath: string = './assets/data/bistro_staffs.json';
  mCollectionPath: string = "restaurants/%s/staffs";
  mStaffsCollectionRef: AngularFirestoreCollection<Staff>;
  mStaffs: Observable<Staff[]>;

  constructor(
    public mBistroProvider: BistroProvider,
    public mHttpClient: HttpClient,
    public mAngularFirestore: AngularFirestore,
    public navCtrl: NavController,
    public navParams: NavParams) {

  }

  ionViewDidEnter() {
    this._CheckSelectedRestaurant();
    this._UploadStaffs();
    this._ConnectToFirebase();
  }

  _CheckSelectedRestaurant() {
    this.mCollectionPath = this.mCollectionPath.replace('%s', this.mBistroProvider.getCurrentRestaurantID());
    console.log(this.mCollectionPath);
    
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
    this.mStaffsCollectionRef = this.mAngularFirestore.collection(this.mCollectionPath);
    this.mStaffs = this.mStaffsCollectionRef.valueChanges();
  }

  _UploadStaffs() {
    console.log("Preparing to upload Data ...");
    let collectionRef = firebase.firestore().collection(this.mCollectionPath);
    collectionRef.get().then(data => {
      if (data && data.docs.length == 0) {
        this.mHttpClient.get(this.mDataPath).subscribe(rawData => {
          let items = rawData['staffs'];
          items.forEach(itemData => {
            let item: Staff = {
              firebase_id : itemData.id,
              id: itemData.id,
              username: itemData.username,
              password: itemData.password,
              name: itemData.name,
              avatar: itemData.avatar,
              account_state: itemData.account_state,
              birthday: itemData.birthday,
              identify: itemData.identify,
              phone: itemData.phone,
              email: itemData.email,
              staff_type: itemData.staff_type,
              staff_role: itemData.staff_role
            }
            collectionRef.doc(item.firebase_id).set(item);
          });
          console.log('Upload data has done');
        });

      } else {
        console.log("Already has data");
      }
    }).catch(error => {
      console.log("error ", error);
    });
  }
}
