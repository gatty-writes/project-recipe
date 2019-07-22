import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    if(this.isLoginMode) {
      // do something
    } else {
      this.authService.signup(email, password).subscribe(resData => {
        console.log('sign up reponse is ' + resData);
        this.isLoading = false;
      }, err => {
        console.log('sign up failure reponse is ' + err);
        this.isLoading = false;
      });
    }
    form.reset();
  }

}
