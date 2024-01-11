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
  _id:string
  firstName: string;
  lastName: string;
  userName: string;
  story: string;
  email: string;
  passWord: string;
  uid: string;
  photo: string;
  followers: string[];
  following: string[];
  save: any[];
  token: string;
}

export interface Inspiration{
  _id:string,
  title:string,
  plainTitle:string,
  description:string,
  artworkURL:string,
  heightImg:number,
  widthImg:number,
  isLike:boolean,
  commentPermission:boolean,
  likes:User[],
  postedBy:User,
  comments:[],
  createAt:string,
  updatedAt:string
}

export interface NavMenu {
  tag: string;
  link?: string;
  subMenu?: NavMenu[] | null;
  action?:()=>void
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
