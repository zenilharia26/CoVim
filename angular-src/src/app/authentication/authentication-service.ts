import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { tap } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class AuthenticationService {

    user = new BehaviorSubject<User>(null);

    constructor(private httpClient: HttpClient) {}

    renameFile(name: string, document: string, fileType: string): string {
        const dateTime = new Date().getTime();
        name = name.replace(' ', '_');
        return `${name}_${document}_${dateTime}.${fileType}`;
    }

    signup(form: NgForm, registeringEntity: string, file: File) {
        console.log(form);
        let signupFormData: FormData = new FormData();

        signupFormData.append('registeringEntity', registeringEntity);
        signupFormData.append('name', form.value.name);
        signupFormData.append('phone', form.value.phoneNumber);
        signupFormData.append('email', form.value.email);
        signupFormData.append('password', form.value.password);
        signupFormData.append('address', form.value.address);

        if (registeringEntity === 'hospital') {
            signupFormData.append('hospitalType', form.value.hospitalType);
            signupFormData.append('document', file, this.renameFile(form.value.name, 'License', file.name.split('.')[1]));
        } else {
            signupFormData.append('gender', form.value.gender);
            signupFormData.append('document', file, this.renameFile(form.value.name, 'Birth_Certificate', file.name.split('.')[1]));
        }

        return this.httpClient.post('http://localhost:3000/auth/signup', signupFormData);
    }

    login(form: NgForm) {
        const formData = {
            email: form.value.email,
            password: form.value.password
        };
        return this.httpClient
        .post<{ message: string, token: string }>('http://localhost:3000/auth/login', formData)
        .pipe(
            tap(response => {
                this.authenticateUser(formData.email, response.token);
            })
        );
    }

    authenticateUser(email: string, token: string) {
        const user = new User(
            email,
            token,
            new Date().getTime() + (60*60*1000)
        );

        this.user.next(user);
        localStorage.setItem('user', JSON.stringify(user));
    }
}