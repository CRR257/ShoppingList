export interface UserModel {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  name: string;
  photoURL?: string;
}

export interface UserSingInFormModel {
  email: string;
  password: string;
}

export interface UserSingUpFormModel {
  email: string;
  displayName: string;
  password: string;
}

export enum UserStatus {
  userLogged = 'userLogIn',
  userLogout = 'userLogout',
}
