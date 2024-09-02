import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-protected',
  template: `
    <div *ngIf="isLoggedIn()">
      Welcome to the protected area!
    </div>
    <div *ngIf="!isLoggedIn()">
      Please login to access this area.
    </div>
  `
})
export class ProtectedComponent {
  constructor(private authService: AuthService, private router: Router) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
