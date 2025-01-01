export type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
};

export type SignIntoClientRequestBody = {
    userInfo: UserInfo
}