import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "./authentication-service";
import { map, take } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class AuthenticationGuard implements CanActivate {

    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authenticationService.user.pipe(
            take(1),
            map(user => {
                const isAuthenticated = !!user;
                if (isAuthenticated) {
                    return true;
                }
                return this.router.createUrlTree(['/', 'authenticate']);
            })
        );
    }
}