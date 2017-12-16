import { FirebaseObject } from "../../firebase/classes/firebase-object";

export enum NotifyState {
    UN_READ = 0,
    READ = 1,
    REMOVED = 2
}

export enum NotifyType {
    /**Khi có sự thay đổi về thông tin món ăn : hết hàng, chế biến xong*/
    FOOD_ORDER_STATE = 0
}




/**User sẽ lấy notify của mình dựa theo user_id, sau đó handle việc thay đổi phụ thuộc vào notify id, notfiy id sẽ auto generate từ server để đảm bảo không trùng */
export class Notify extends FirebaseObject{
    /**Notify ID */
    id: string;
    /**Id của User */
    user_id: string;
    /**Tên đăng nhập của user */
    user_name: string;
    /**Tiêu đề của thông báo */
    title: string;
    /**Thông điệp */
    message: string;
    /**Loại thông báo */
    type: number;
    /**Trạng thái của thông báo : chưa đọc, đã đọc, đã xóa */
    state: number;
}


export class FoodNotify extends Notify {
    food_order_id: string;
    food_id: string;
    food_name: string;
    food_amount: number;
    food_amount_done: number;
}

export class OrderNotify extends Notify {
    order_id : string;
}