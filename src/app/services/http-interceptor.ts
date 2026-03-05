// Angular imports
import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';

// RxJS imports
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';

// App imports
import { AuthorizeService } from './authorize.service';
import { SpinnerService } from './spinner.service';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);

    constructor(
        private spinnerService: SpinnerService,
        private authorizeService: AuthorizeService,
        private router: Router
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.spinnerService.show();
        const authReq = this.addAuthHeader(req);

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 && !this.isAuthEndpoint(req.url)) {
                    return this.handle401Error(authReq, next);
                }
                return throwError(() => error);
            }),
            finalize(() => this.spinnerService.hide())
        );
    }

    private addAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
        const accessToken = this.authorizeService.getAccessToken();
        if (!accessToken || this.isAuthEndpoint(req.url)) {
            return req;
        }
        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authorizeService.refreshToken().pipe(
                switchMap((newAccessToken: string) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(newAccessToken);
                    return next.handle(this.withToken(req, newAccessToken));
                }),
                catchError((error) => {
                    this.isRefreshing = false;
                    this.authorizeService.logOut();
                    this.router.navigate(['/login']);
                    return throwError(() => error);
                })
            );
        }

        return this.refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => next.handle(this.withToken(req, token as string)))
        );
    }

    private withToken(req: HttpRequest<any>, accessToken: string): HttpRequest<any> {
        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }

    private isAuthEndpoint(url: string): boolean {
        return url.includes('/login') || url.includes('/register') || url.includes('/refresh-token');
    }
}