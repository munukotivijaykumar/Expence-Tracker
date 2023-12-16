import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user-models';
import { SubscriptionService } from './subscription.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private subscriptionService: SubscriptionService
  ) {}

  isLoggedIn?: boolean = false;
  formData!: User;

  readonly APIUrl = 'http://localhost:5000/api/auth';

  // set user Details to User Subscription Data
  setUserDetails() {
    const authToken = localStorage.getItem('authToken');
    console.log(' authtocken ' + localStorage.getItem('authToken'));
    if (authToken) {
      const userDetails = new User();
      const decodeUserDetails: any = JSON.parse(atob(authToken.split('.')[1]));
      console.log(decodeUserDetails.data);
      console.log(decodeUserDetails);
      userDetails.userId = decodeUserDetails.data.id;
      userDetails.userName = decodeUserDetails.data.username;
      userDetails.isLoggedIn = true;

      this.subscriptionService.userData.next(userDetails);
    }
  }
  // reset User Sunscription Data
  resetSubscription() {
    this.subscriptionService.userData.next(new User());
  }

  // Register User By Sending Http Post Request to Backend 
  register(reg: User) {
    console.log(reg);
    return this.http.post<any>(this.APIUrl + '/register', reg).pipe(
      map((res) => {
        if (res && res.token) {
          localStorage.setItem('authToken', res.authtoken);
          this.setUserDetails();
        }
        console.log(res);
        return res;
      })
    );
  }

  private _listeners = new Subject<any>();

  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

  // Login User By Sending Http Post Request to Backend 
  login(login: User) {
    console.log(login);
    return this.http.post<any>(this.APIUrl + '/login', login).pipe(
      map((response) => {
        console.log(response);
        if (response) {
          console.log(response.authtoken);
          localStorage.setItem('authToken', response.authtoken);
          localStorage.setItem('transactionstoken', response.transactionstoken);
          this.setUserDetails();
          // localStorage.setItem('UserId', response.userId);
        }
        return response;
      })
    );
  }

  // Logout User By Sending Http Delete Request to Backend 
  logout() {
    var authHeader = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    });

    return this.http
      .delete<any>(this.APIUrl + '/logout', { headers: authHeader })
      .pipe(
        map((response) => {
          console.log('in auth services');
          console.log(response);
          localStorage.clear();
          this.isLoggedIn = false;
          this.resetSubscription();
          return 'logout';
        })
      );
  }
}
