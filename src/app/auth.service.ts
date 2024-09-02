import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  onSignin(username: string, password: string): boolean {
    console.log('Attempting to sign in:', username, password);
    if (username === 'user' && password === 'password') {
      console.log('Credentials are correct');
      localStorage.setItem('currentUser',JSON.stringify({username}));
      return true;
    }
    console.log('Credentials are incorrect'); 
    return false;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }
}
