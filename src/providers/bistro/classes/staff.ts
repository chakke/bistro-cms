import { FirebaseObject } from "../../firebase/classes/firebase-object";


export enum StaffRole {
    CHEF = 0,
    BAR = 1,
    WAITER = 2,
    ORDER = 3,
    RECEPTIONIST = 4,
    MANAGER = 5,
    SUPERVISOR = 6,
    SECURITY = 7
}
export enum StaffState {
    ACTIVE = 0,
    UNACTIVE = 1,
    BLOCKED = 2
}
export enum StaffType {
    PARTIME = 0,
    FULLTIME = 1,
    ONETIME = 2
}

export class User extends FirebaseObject {
    /**Mã ID */
    id: string;
    /**Tên đăng nhập */
    username: string;
    /**Mật khẩu */
    password: string;
    /**Họ tên */
    name: string;
    /**Ảnh đại diện */
    avatar: string;
    /**Trạng thái : Active, Not_Active, Blocked */
    account_state: number;
}

export class Staff extends User {

    birthday: string;
    /**Số CMTND */
    identify: string;
    /**Số điện thoại */
    phone: string;
    /**Email liên hệ */
    email: string;

    /**Loại nhân viên : Partime, Fulltime, OnceTime */
    staff_type: number;
    /**Vai trò :  Bếp, Bar, Lễ tân, Bảo vệ, Manager, Supervisor */
    staff_role: number;
}