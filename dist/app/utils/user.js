"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserUtil {
    static displayValue(user, includeLastName = false) {
        if (!user) {
            return null;
        }
        let displayValue = user.email;
        if (includeLastName && user.firstName && user.lastName) {
            displayValue = `${user.firstName} ${user.lastName}`;
        }
        else if (user.firstName) {
            displayValue = user.firstName;
        }
        else if (user.username) {
            displayValue = user.username;
        }
        return displayValue;
    }
    static initials(user) {
        if (!user) {
            return null;
        }
        if (user.firstName && user.lastName) {
            return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
        }
        else if (user.firstName) {
            return user.firstName.charAt(0);
        }
        else if (user.lastName) {
            return user.lastName.charAt(0);
        }
        return null;
    }
}
exports.UserUtil = UserUtil;
//# sourceMappingURL=user.js.map