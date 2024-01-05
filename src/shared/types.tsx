export interface Character {
  id: Number;
  photo: string;
  portrait: string;
  fullName: string;
  career: string;
  backStory: string;
  birth: string;
  interests: string;
  talents: string;
  likes: string;
  role: string;
}
export interface User {
  firstName: String;
  lastName: String;
  userName: String;
  story: String;
  email: String;
  passWord: String;
  uid: String;
  photo: String;
  followers: String[];
  following: String[];
  save: any[];
  token: String;
}

export interface NavMenu {
  tag: String;
  link?: String;
  subMenu: NavMenu[] | null;
}

export interface SignInForm {
  email: string;
  password: string;
}

export interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
