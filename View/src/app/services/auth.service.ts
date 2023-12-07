import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user-models';
import { SubscriptionService } from './subscription.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private subscriptionService: SubscriptionService
  ) { }

  isLoggedIn?: boolean = false;
  formData!: User;

  readonly APIUrl = 'http://localhost:5000/api/auth';

  setUserDetails() {
    
    const authToken = localStorage.getItem('authToken')
    console.log(" authtocken "+ localStorage.getItem('authToken'));
    if (authToken) {
      
      const userDetails = new User();
      const decodeUserDetails: any = JSON.parse(
        atob(authToken.split('.')[1])
      );
      console.log(decodeUserDetails);
      userDetails.UserId = decodeUserDetails.data.id;
      userDetails.UserName = decodeUserDetails.data.username;
      userDetails.isLoggedIn = true;

      this.subscriptionService.userData.next(userDetails);

    }

  }
  resetSubscription() {
    this.subscriptionService.userData.next(new User());
  }

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

  login(login: User) {
    console.log(login);
    return this.http.post<any>(this.APIUrl + '/login', login).pipe(
      map((response) => {
        console.log(response);
        if (response) {
          console.log(response.authtoken)
          localStorage.setItem('authToken', response.authtoken);
          this.setUserDetails();
          // localStorage.setItem('UserId', response.userId);
        }
        return response;
      })
    );
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.resetSubscription();
    return 'logout';
  }



}
