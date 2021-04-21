import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VaccineManagementService } from './vaccine-management.service';

@Component({
  selector: 'app-vaccine-management',
  templateUrl: './vaccine-management.component.html',
  styleUrls: ['./vaccine-management.component.css']
})
export class VaccineManagementComponent implements OnInit {

  public resources: any;

  constructor(private vaccineManagementService: VaccineManagementService) { }

  ngOnInit(): void {
    this.vaccineManagementService.getResources().subscribe(response => {
      // console.log(response);
      let returnedResources = response['resources'];
      this.resources = {
        covaxin: returnedResources.covaxin,
        covishield: returnedResources.covishield,
        beds: returnedResources.beds,
        oxygenCylinders: returnedResources.oxygenCylinders
      };
      console.log(this.resources);
    }, err => {
      console.log(err);
    });
  }

  onSubmitOrder(orderForm: NgForm) {
    this.vaccineManagementService.requestVaccines(orderForm).subscribe(response => {
      console.log(response);
      if (response['resources']) {
        this.resources.covaxin = response['resources'].covaxin;
        this.resources.covishield = response['resources'].covishield;
      }
    }, err => {
      console.log(err);
    });
  }

}
