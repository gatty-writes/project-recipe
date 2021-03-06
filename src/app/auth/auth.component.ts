import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService, AuthResponseData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  errorMessage: string = null;
  @ViewChild(PlaceholderDirective, { static: true }) alertHost: PlaceholderDirective;
  private subs = new Subscription();
  constructor(private authService: AuthService, 
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if(this.subs) {
      this,this.subs.unsubscribe();
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }
    let authObs = new Observable<AuthResponseData>();
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    
    if(this.isLoginMode) {
      authObs = this.authService.signIn(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(resData => {
      console.log('sign up reponse is ' + resData);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, err => {
      console.log('sign up failure reponse is ' + err);
      this.errorMessage = err;
      this.showErrorAlert(err);
      this.isLoading = false;
    });
    form.reset();
  }

  closeErrorBox(event: any) {
    this.errorMessage= null;
  }

  private showErrorAlert(errorMessage: string) {
    const alertComFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewRef = this.alertHost.viewContainerRef;
    hostViewRef.clear();
    const componentRef = hostViewRef.createComponent(alertComFactory);
    componentRef.instance.message = errorMessage;
    this.subs = componentRef.instance.closeAlert.subscribe(() => {
      this.subs.unsubscribe();
      hostViewRef.clear();
    });
  }
}
