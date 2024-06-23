import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  public getUsers(): Observable<any> {
    return this.http.get(`http://localhost:3000/data`);
  }
  public addMealData(intakeObj: any): Observable<any> {
    return this.http.put(`http://localhost:3000/data`, intakeObj);
  }
}
