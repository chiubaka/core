import { IUser } from "./../types/index";
export class UserUtil {
  public static displayValue(user: IUser, includeLastName= false) {
    if (!user) {
      return null;
    }

    let displayValue = user.email;

    if (includeLastName && user.firstName && user.lastName) {
      displayValue = `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      displayValue = user.firstName;
    } else if (user.username) {
      displayValue = user.username;
    }

    return displayValue;
  }

  public static initials(user: IUser) {
    if (!user) {
      return null;
    }

    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    } else if (user.firstName) {
      return user.firstName.charAt(0);
    } else if (user.lastName) {
      return user.lastName.charAt(0);
    }

    return null;
  }
}
