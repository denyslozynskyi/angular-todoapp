import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take, exhaustMap } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.user
            .pipe(
                take(1),
                exhaustMap(user => {
                    if (!user) {
                      return next.handle(req);
                    }
                    const headers = new HttpHeaders()
                      .set('Authorization', `Bearer ${user.token}`);                 
                    const modifiedReq = req.clone(
                      {headers: headers}
                    );
                    return next.handle(modifiedReq);
                })
            );
    }
}