import { Area } from "./area";
import { FirebaseObject } from "../../firebase/classes/firebase-object";

export class Map extends FirebaseObject {
    id: string;
    name: string;
    description: string;
    areas: Array<Area>;
}