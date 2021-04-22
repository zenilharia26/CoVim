import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
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

  error: boolean;

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
      console.log(response);
      if (response['resources']) {
        this.resources.covaxin = response['resources'].covaxin;
        this.resources.covishield = response['resources'].covishield;
      }
    }, err => {
      console.log(err);
    });
  }

  onRequest() {
    const covaxinReq = this.vaccinesRequestForm.value['covaxin'];
    const covishieldReq = this.vaccinesRequestForm.value['covishield'];
    
    this.vaccineManagementService.requestVaccines(covaxinReq, covishieldReq).subscribe(response => {
      console.log(response);
      if (response['resources']) {
        this.resources.covaxin = response['resources'].covaxin;
        this.resources.covishield = response['resources'].covishield;
      }
    }, err => {
      console.log(err);
    });
  }

  initialiseForms() {
    this.vaccinesUtilisedForm = new FormGroup({
      'covaxin': new FormControl(0, [Validators.required, Validators.min(0), Validators.max(this.resources.covaxin)]),
      'covishield': new FormControl(0, [Validators.min(0), Validators.max(this.resources.covishield)]),
    });

    this.vaccinesRequestForm = new FormGroup({
      'covaxin': new FormControl(0, [Validators.required]),
      'covishield': new FormControl(0, [Validators.required]),
    });
  }
}
