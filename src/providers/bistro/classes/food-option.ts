import { FirebaseObject } from "../../firebase/classes/firebase-object";


export class FoodOption extends FirebaseObject{
    id: string;
    name: string;
    description: string;
    state: number;
    type: number;
    price: number;
}