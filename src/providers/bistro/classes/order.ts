import { Food } from "./food";
import { FirebaseObject } from "../../firebase/classes/firebase-object";

export enum DeliveryState {
    /**Mặc định khi order food thì món ăn ở trạng thái đợi */
    WAITING = 0,
    /**Sau khi đầu bếp xem xét các món đang đợi, lựa chọn món để chế biến, đưa nó vào trạng thái Cooking */
    COOKING = 1,
    /**Nếu hết nguyên liệu, hoặc không thể chế biến tại thời điểm hiện tại thì thông báo */
    COOKING_UNAVAILABLE = 2,
    /**Khi chế biến xong, chuyển nó về trạng thái sẵn sàng để giao, chạy bàn tiếp nhận thông tin và chuyển đến bàn theo yêu cầu */
    DELIVERABLE = 3,
    /**Khi phục vụ giao xong món ăn */
    DELIVERED = 4,
    /**Trong quá trình giao, khách không nhận hoặc hủy món */
    RETURNED = 5
}


export class OrderPayment extends FirebaseObject {
    id: string;
    state: number;
}

export class FoodOrder extends FirebaseObject {
    id: string;
    order_id: string;
    state: number;
    amount_order: number;
    amount_done: number;
    amount_return: number;
    food: Food;
    /**Tổng tiền toàn bộ của món ăn = amout * food-saled-price */
    price: number;
    /**Tổng toàn bộ chiết khấu trên món ăn đó */
    sale: number;
    options: string;
}

export class Order extends FirebaseObject {
    /**ID của Order */
    id: string;    
    /**Mô tả của order */
    descrition: string;
    /**Trạng thái order */
    state: number;
    /**Loại order */
    type: number;
    /**Thời gian tạo order */
    time_create: Date;

    /**ID Bàn của order */
    table_id: string;
    /**Name bàn của order */
    table_name: string;


    area_id: string;
    area_name: string;

    staff_id: string;
    staff_name: string;
    staff_avatar: string;

}

export class OrderManager {

}