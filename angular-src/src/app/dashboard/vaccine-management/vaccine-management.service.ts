import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class VaccineManagementService {

    constructor(private httpClient: HttpClient) {}

    getResources() {
        return this.httpClient.get('http://localhost:3000/resource');
    }
}