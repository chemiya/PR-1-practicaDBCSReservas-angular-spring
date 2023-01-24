import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  //son como las cookies. como en javascript localstorage. 
  //guardo los datos del usurio

  signOut(): void {//limpio el storage
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);//limpio el anterior y pongo el nuevo
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {//coges el token
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);//limpio el anterior y pongo el nuevo
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {//traes del storage el que haya
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}
