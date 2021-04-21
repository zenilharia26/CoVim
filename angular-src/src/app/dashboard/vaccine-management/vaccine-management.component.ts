import { Component, OnInit } from '@angular/core';
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

  onClick() {
  }

}
