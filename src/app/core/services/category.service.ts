import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";
import {map, Observable} from "rxjs";
import {Category} from "@core/Interfaces/category.interface";
import {ApiResponse} from "@core/Interfaces/api-response.interface";

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private readonly endpoint = environment.baseUrl; 
  
  get(): Observable<Category[]>{
    return this.http.get<ApiResponse<Category[]>>(`${this.endpoint}/category`)
      .pipe(
        map((res) => res.data),
      );
  }
  
}
