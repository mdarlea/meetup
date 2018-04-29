export class LoginViewModel {
    constructor(
      public userName: string,
      public password: string,
      public rememberMe: boolean,
      public clientId?: string) {}
}
