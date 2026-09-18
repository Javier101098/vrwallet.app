import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "@env/environment";
import {Stats} from "../interfaces/stat.interface";
import {Observable} from "rxjs";

@Injectable()
export class FinancialService {
  private http = inject(HttpClient);
  
  private readonly baseUrl : string = environment.baseUrl;
  
  getStats(startDate: string): Observable<Stats> {
    const params = new HttpParams().set('startDate', startDate);
    return this.http.get<Stats>(`${this.baseUrl}/dashboard/stats`,{params});
  }
}
