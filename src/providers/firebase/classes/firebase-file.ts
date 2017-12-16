import { FirebaseObject } from "./firebase-object";

export class FirebaseFile extends FirebaseObject {    
    name: string;
    url: string;
    content_type: string;
    storage_reference?: string;
}
