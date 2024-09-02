import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '';

  constructor(private http: HttpClient) { }

  fetchData(question: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // return this.http.post(this.apiUrl, { question }, { headers });
      return new Observable(observer=>{
        this.http.post(this.apiUrl,{question},{headers}).subscribe(
          data=>{
            observer.next(data);
            observer.complete();
          },
          (error:HttpErrorResponse)=>{
            let errorMessage='unknown error';
            if(error.error instanceof ErrorEvent){
              errorMessage=`Error:${error.error.message}`;
            
          }else{
            errorMessage=`error code:${error.status}\nMessage:${error.message}`;
          }
          console.error(errorMessage);
          observer.error(errorMessage);
        }
        );
      });
    
    }
  }