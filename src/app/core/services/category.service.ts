import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";
import {Observable} from "rxjs";
import {Category} from "@core/Interfaces/category.interface";

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private readonly endpoint = environment.baseUrl; 
  
  get(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.endpoint}/category`);
  }
}
