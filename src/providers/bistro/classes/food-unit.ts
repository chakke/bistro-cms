import { FirebaseObject } from "../../firebase/classes/firebase-object";

export class FoodUnit extends FirebaseObject {
    id: string;
    code: number;
    name: string;
    price: number;
    currency: string;
}