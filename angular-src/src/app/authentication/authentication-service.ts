import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthenticationService {

    user = new BehaviorSubject<User>(null);
    loginTime: number = 60*60*1000;
    expiryTimeout: any;

    constructor(private httpClient: HttpClient, private router: Router) {}

    renameFile(name: string, document: string, fileType: string): string {
        const dateTime = new Date().getTime();
        name = name.replace(' ', '_');
        return `${name}_${document}_${dateTime}.${fileType}`;
    }

    signup(form: NgForm, file: File) {
        console.log(form);
        let signupFormData: FormData = new FormData();

        signupFormData.append('name', form.value.name);
        signupFormData.append('phone', form.value.phoneNumber);
        signupFormData.append('email', form.value.email);
        signupFormData.append('password', form.value.password);
        signupFormData.append('address', form.value.address);
        signupFormData.append('hospitalType', form.value.hospitalType);
        signupFormData.append('document', file, this.renameFile(form.value.name, 'License', file.name.split('.')[1]));

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

    logout() {
        this.user.next(null);
        localStorage.removeItem('user');

        if (this.expiryTimeout) {
            clearTimeout(this.expiryTimeout);
        }
        this.expiryTimeout = null;
        this.router.navigate(['/', 'home']);
    }

    automaticLogin() {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            return;
        } else {
            const user = new User(userData.email, userData._token, userData.expiry);

            if (user.token) {
                this.user.next(user);
                this.automaticLogout();
            }
        }
    }

    automaticLogout() {
        this.expiryTimeout = setTimeout(() => {
            this.logout();
        }, this.loginTime);
    }

    authenticateUser(email: string, token: string) {
        const user = new User(
            email,
            token,
            new Date().getTime() + this.loginTime
        );

        this.user.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        this.automaticLogout();
    }
}