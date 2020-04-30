import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap'

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor{

    constructor(private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        if(localStorage.getItem('token') !== null) {
            const cloneReq = req.clone({
              headers: req.headers.set('Authorization',`Bearer ${localStorage.getItem('token')}`)
            });
            return next.handle(cloneReq).pipe(
                tap(
                    success => {},
                    err => {
                        if (err.status === 401) {
                            this.router.navigateByUrl('user/login');
                        }
                    }
                )
            );
          } else {
            this.router.navigate(['/user/login']);
            return next.handle(req.clone());
          }
      
    }
}