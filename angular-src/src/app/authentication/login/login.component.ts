import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error: string = null;

  @ViewChild('loginForm') loginForm: NgForm;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {}

  onLogin(loginForm: NgForm) {
    this.authenticationService.login(loginForm).subscribe(response => {
      this.router.navigate(['/', 'dashboard']);
    }, errorObject => {
      this.error = errorObject.error.message;
    });
  }
}
