import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        const user = this.authenticationService.userValue;
        const isLoggedIn = user?.token;
        const isApiUrl = req.url.startsWith(environment.authenticationServer);
        if(isLoggedIn && isApiUrl) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`
                }
            });
        }

        return next.handle(req);
    }
    
}