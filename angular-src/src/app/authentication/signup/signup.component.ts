import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  file: File;
  @ViewChild('signupForm') signupForm: NgForm;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }

  onSubmit(signupForm: NgForm) {
    this.authenticationService.signup(signupForm, this.file).subscribe(response => {
      console.log(response);
      this.router.navigate(['/', 'authenticate', 'login']);
    }, errorMessage => {
      console.log(errorMessage);
    });
  }

  onClear() {
    this.signupForm.reset();
  }
}
