import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { BASE_URL } from '../../constants/app.constants';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

   
  get httpHeaders(){

    return {
      headers:new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    }
  }

  postMultipart(payload:any): Observable<any> {
    return this.http.post(`${BASE_URL}inventorySubmit`,payload);
  }

}


