import { IUser } from "./../types/index";
export declare class UserUtil {
    static displayValue(user: IUser, includeLastName?: boolean): string;
    static initials(user: IUser): string;
}
