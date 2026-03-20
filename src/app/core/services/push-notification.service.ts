import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private http = inject(HttpClient);
  private readonly endpoint = `${environment.baseUrl}/push-notifications`;

  subscribe(subscription: PushSubscription): Observable<any> {
    return this.http.post(`${this.endpoint}/push-subscription`, subscription);
  }
  
}
