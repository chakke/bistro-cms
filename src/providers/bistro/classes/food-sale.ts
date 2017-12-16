import { FirebaseObject } from "../../firebase/classes/firebase-object";


export class FoodSale extends FirebaseObject{
    id: string;
    name: string;
    percent: number;
    state: number;
}
