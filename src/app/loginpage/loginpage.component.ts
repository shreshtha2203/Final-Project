import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css'] 
})
export class LoginpageComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string ='';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      password: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]]
    });
  }

  ngOnInit() {}


  onSubmit(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      console.log('Form is valid, attempting to sign in');

      if (this.authService.onSignin(username, password)) {
        console.log('Redirecting to /website');
        this.router.navigateByUrl('/website');
      } else {
        this.errorMessage='Wrong Credentials';
        console.log('Wrong Credentials');
      }
    } else {
      this.errorMessage='Form is invalid';
      console.log('Form is invalid');
    }
  }
}
