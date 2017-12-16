import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Table } from '../../providers/bistro/classes/table';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import * as firebase from "firebase";
import { BistroProvider } from '../../providers/bistro/bistro';

@IonicPage()
@Component({
  selector: 'page-bistro-tables',
  templateUrl: 'bistro-tables.html',
})
export class BistroTablesPage {
  mCollectionPath: string = "restaurants/%s/tables";
  mDataPath: string = './assets/data/bistro_tables.json';
  mTablesCollectionRef: AngularFirestoreCollection<Table>;
  mTables: Observable<Table[]>;

  constructor(
    public mBistroProvider: BistroProvider,
    public mAngularFirestore: AngularFirestore,
    public mHttpClient: HttpClient,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this._CheckSelectedRestaurant();
    this._ConnectToFirebase();
    this._UploadTables();
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
    this.mTablesCollectionRef = this.mAngularFirestore.collection(this.mCollectionPath);
    this.mTables = this.mTablesCollectionRef.valueChanges();
  }

  _UploadTables() {
    console.log("Preparing to upload tables data");
    let collectionRef = firebase.firestore().collection(this.mCollectionPath);
    collectionRef.get().then(data => {
      if (data && data.docs.length == 0) {
        this.mHttpClient.get(this.mDataPath).subscribe(rawData => {
          let tables = rawData['tables'];
          tables.forEach(tableData => {
            let table: Table = {
              firebase_id: tableData.id,
              id: tableData.id,
              name: tableData.name,
              area_id: tableData.area_id,
              area_name: tableData.area_name,
              type: tableData.type,
              state: tableData.state,
              capacity: tableData.capacity
            }
            collectionRef.doc(table.id).set(table);
          });
          console.log('Update tables done');
        });
      } else {
        console.log("Already has data");
      }
    }).catch(error => {
      console.log("error ", error);

    });
  }

}
