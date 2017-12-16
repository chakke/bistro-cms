import { FirebaseObject } from "../../firebase/classes/firebase-object";

export enum TableState {
    /**Bàn trống */
    NO_ORDER = 0,
    /**Bàn trống nhưng có người đặt trước */
    BOOKED = 1,
    /**Đang phục vụ */
    HAS_ORDER = 2,
    /**Bàn đặt trước được phục vụ */
    BOOKED_HAS_ORDER = 3
}

export enum TableType {
    /**Bàn thông thường */
    NORMAL = 0,
    /**Bàn VIP */
    VIP = 1
}

export class Table extends FirebaseObject {
    /**ID của table */
    id: string;
    /**ID của area */
    area_id: string;
    /**Tên khu vực */
    area_name: string;
    /**Tên bàn */
    name: string;
    /**Loại bàn : thường, vip */
    type: number;
    /**Trạng thái bàn */
    state: number;
    /**Sức chứa */
    capacity: number;
}