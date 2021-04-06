import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isHospital: boolean = true;
  registeringEntity: string = 'hospital';
  @ViewChild('signupForm') signupForm: NgForm;

  constructor() { }

  ngOnInit(): void {
  }

  toggle(clickedEntity: string) {
    this.isHospital = clickedEntity === 'hospital';
  }

  setRegisteringEntity(entity: string) {
    this.registeringEntity = entity;
  }

  onSubmit(signupForm: NgForm) {
    if (this.registeringEntity === 'hospital') {
      console.log(signupForm.value.name);
      console.log(signupForm.value.phoneNumber);
      console.log(signupForm.value.email);
      console.log(signupForm.value.password);
      console.log(signupForm.value.address);
      console.log(signupForm.value.hospitalType);
      console.log(signupForm.value.hospitalLicense);
    } else {
      console.log(signupForm.value.name);
      console.log(signupForm.value.phoneNumber);
      console.log(signupForm.value.email);
      console.log(signupForm.value.password);
      console.log(signupForm.value.address);
      console.log(signupForm.value.gender);
      console.log(signupForm.value.birthCertificate);
    }
  }

  onClear() {
    this.signupForm.reset();
  }
}
