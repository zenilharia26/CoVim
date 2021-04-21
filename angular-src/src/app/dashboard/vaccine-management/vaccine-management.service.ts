import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";

@Injectable({providedIn: 'root'})
export class VaccineManagementService {

    constructor(private httpClient: HttpClient) {}

    getResources() {
        return this.httpClient.get('http://localhost:3000/resource');
    }

    requestVaccines(orderForm: NgForm) {
        return this.httpClient.post('http://localhost:3000/resource', {covaxin: orderForm.value.covaxin, covishield: orderForm.value.covishield});
    }
}