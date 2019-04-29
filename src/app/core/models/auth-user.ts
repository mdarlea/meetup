import { JwtHelper } from 'angular2-jwt';

export class AuthUser {
    constructor(user: {token: string; }) {
      if (user) {
        Object.assign(this, user);
      }
    }

    token: string;

    get id(): string {
      const jwtHelper = new JwtHelper();
      const decodedToken = jwtHelper.decodeToken(this.token);
      return decodedToken.id;
    }

    get userName(): string {
      const jwtHelper = new JwtHelper();
      const decodedToken = jwtHelper.decodeToken(this.token);
      return decodedToken.sub;
    }

    isExpired(): boolean {
      const jwtHelper = new JwtHelper();
      const isExpired = jwtHelper.isTokenExpired(this.token);
      return isExpired;
    }
}
