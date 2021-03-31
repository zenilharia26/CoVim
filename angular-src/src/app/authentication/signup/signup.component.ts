import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isHospital: boolean = true;
  registeringEntity: string = 'hospital';

  constructor() { }

  ngOnInit(): void {
  }

  toggle(clickedEntity: string) {
    this.isHospital = clickedEntity === 'hospital';
  }

  setRegisteringEntity(entity: string) {
    this.registeringEntity = entity;
  }
}
