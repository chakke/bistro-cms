import { FirebaseObject } from "../../firebase/classes/firebase-object";
import * as firebase from 'firebase';

export enum RestaurantState {
    OPEN = 0,
    CLOSED
}

export class Restaurant extends FirebaseObject {
    id: string;
    name: string;
    logo: string;
    vendor_name: string;
    vendor_id: string;
    vendor_logo: string;
    address: string;
    geopoint: firebase.firestore.GeoPoint;
    hotline: string;
    state: number;
    time_open: string;
    time_close: string;

}