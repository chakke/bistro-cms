import { Table } from "./table";
import { FirebaseObject } from "../../firebase/classes/firebase-object";

export class Area extends FirebaseObject {
    id: string;
    name: string;
    capacity: number;
    tables: Array<Table>;
}

