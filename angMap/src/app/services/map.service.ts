import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Point } from '../models/point';
import { SaveResponse } from '../models/saveResponse';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private authUrl = environment.authenticationServer
  
  constructor(private http: HttpClient) { }

  getFeatures() {
    return forkJoin([this.http.get('assets/firstLevel.json'),this.http.get('assets/secondLevel.json')]);
  }

  saveNote(json: object){
    let postHeaders = new HttpHeaders();
    postHeaders = postHeaders.set('Content-Type','application/json')
    return this.http.post(`${this.authUrl}/api/Note`, json, {headers:postHeaders});
  }

  getNotes():Observable<Array<any>>{
    return this.http.get<Array<any>>(`${this.authUrl}/api/Note/all`);
  }

  deleteNote(id: string){
    let postHeaders = new HttpHeaders();
    let queryParameters = new HttpParams();
    queryParameters = queryParameters.set('id', id);
    postHeaders = postHeaders.set('Content-Type','application/json');
    return this.http.request('delete',`${this.authUrl}/api/Note`,{params:queryParameters,headers:postHeaders});
  }
}
