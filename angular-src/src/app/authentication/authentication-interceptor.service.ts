import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { exhaustMap, take } from "rxjs/operators";
import { AuthenticationService } from "./authentication-service";

@Injectable()
export class AuthenticationInterceptorService implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authenticationService
        .user
        .pipe(
            take(1),
            exhaustMap(user => {
                if (!user) {
                    return next.handle(req);
                }
                const newRequest = req.clone({params: req.params.set('token', user.token)});
                console.log('New request' + newRequest.body);
                return next.handle(newRequest);
            })
        );
    }

}