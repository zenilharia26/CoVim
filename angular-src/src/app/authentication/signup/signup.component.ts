import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../authentication-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isHospital: boolean = true;
  registeringEntity: string = 'hospital';
  file: File;
  @ViewChild('signupForm') signupForm: NgForm;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  toggle(clickedEntity: string) {
    this.isHospital = clickedEntity === 'hospital';
  }

  setRegisteringEntity(entity: string) {
    this.registeringEntity = entity;
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }

  onSubmit(signupForm: NgForm) {
    this.authenticationService.signup(signupForm, this.registeringEntity, this.file).subscribe(response => {
      console.log(response);
    }, errorMessage => {
      console.log(errorMessage);
    });
  }

  onClear() {
    this.signupForm.reset();
  }
}
