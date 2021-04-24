import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";

@Injectable({providedIn: 'root'})
export class VaccineManagementService {

    constructor(private httpClient: HttpClient) {}

    getResources() {
        return this.httpClient.get('http://localhost:3000/resource');
    }

    requestVaccines(covaxinReq: number, covishieldReq: number) {
        return this.httpClient.post(
            'http://localhost:3000/resource', 
            {
                covaxin: covaxinReq, 
                covishield: covishieldReq
            },
            { observe: 'response' }
        );
    }

    utiliseVaccines(covaxinUsed: number, covishieldUsed) {
        return this.httpClient.put(
            'http://localhost:3000/resource', 
            {
                covaxin: covaxinUsed,
                covishield: covishieldUsed
            },
            { observe: 'response' }
        );
    }
}