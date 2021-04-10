import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../authentication-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginForm') loginForm: NgForm;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {}

  onLogin(loginForm: NgForm) {
    this.authenticationService.login(loginForm).subscribe(response => {
      console.log(response);
    }, errorMessage => {
      console.log(errorMessage);
    });
  }
}
