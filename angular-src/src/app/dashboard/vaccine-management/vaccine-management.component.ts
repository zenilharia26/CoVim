import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, NgForm, Validators } from '@angular/forms';
import { VaccineManagementService } from './vaccine-management.service';
import { FormGroup, FormControl } from '@angular/forms'

@Component({
  selector: 'app-vaccine-management',
  templateUrl: './vaccine-management.component.html',
  styleUrls: ['./vaccine-management.component.css']
})
export class VaccineManagementComponent implements OnInit {

  public resources: any;
  vaccinesUtilisedForm: FormGroup;
  vaccinesRequestForm: FormGroup;

  initialState = {'covaxin': 0, 'covishield': 0}

  error: boolean;
  message: string;

  notificationTimeout: any;
  notificationTime: number = 5000;

  constructor(private vaccineManagementService: VaccineManagementService) { }

  ngOnInit(): void {
    this.vaccineManagementService.getResources().subscribe(response => {
      this.error = false;
      let returnedResources = response['resources'];      
      this.resources = {
        covaxin: returnedResources.covaxin,
        covishield: returnedResources.covishield,
        beds: returnedResources.beds,
        oxygenCylinders: returnedResources.oxygenCylinders
      };
      this.initialiseForms();
    }, err => {
      this.error = true;
      console.log(err);
    });

  }

  onSubmit() {
    const covaxinUsed = this.vaccinesUtilisedForm.value['covaxin'];
    const covishieldUsed = this.vaccinesUtilisedForm.value['covishield'];
    
    this.vaccineManagementService.utiliseVaccines(covaxinUsed, covishieldUsed).subscribe(response => {
      this.error = false;
      this.message = response['body']['message'];
      if (response['body']['resources']) {
        this.resources.covaxin = response['body']['resources'].covaxin;
        this.resources.covishield = response['body']['resources'].covishield;
      }
      this.vaccinesUtilisedForm.reset(this.initialState);
      this.resetNotifications();
    }, err => {
      this.error = true;
      this.message = err.error.message;
      this.resetNotifications();
    });
  }

  onRequest() {
    const covaxinReq = this.vaccinesRequestForm.value['covaxin'];
    const covishieldReq = this.vaccinesRequestForm.value['covishield'];
    
    this.vaccineManagementService.requestVaccines(covaxinReq, covishieldReq).subscribe(response => {
      this.error = false;
      this.message = response['body']['message'];
      if (response['body']['resources']) {
        this.resources.covaxin = response['body']['resources'].covaxin;
        this.resources.covishield = response['body']['resources'].covishield;
      }
      this.vaccinesRequestForm.reset(this.initialState);
      this.resetNotifications();
    }, err => {
      this.error = true;
      this.message = err.error.message;
      this.resetNotifications();
    });
  }

  initialiseForms() {
    this.vaccinesUtilisedForm = new FormGroup({
      'covaxin': new FormControl(0, 
        [
          Validators.required, 
          Validators.min(0), 
          (control: AbstractControl) => Validators.max(this.resources.covaxin)(control)
        ]
      ),
      'covishield': new FormControl(0, 
        [
          Validators.required,
          Validators.min(0), 
          (control: AbstractControl) => Validators.max(this.resources.covishield)(control)
        ]
      ),
    });

    this.vaccinesRequestForm = new FormGroup({
      'covaxin': new FormControl(0, [Validators.required, Validators.min(0)]),
      'covishield': new FormControl(0, [Validators.required, Validators.min(0)]),
    });
  }

  resetNotifications() {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
      this.notificationTimeout = null;
    }

    this.notificationTimeout = setTimeout(() => {
      this.error = false;
      this.message = null;
    }, this.notificationTime);
  }
}
