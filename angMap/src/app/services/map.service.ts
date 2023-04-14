import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    // return this.http.get('https://geowebservices.stanford.edu/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=druid:nh891yz3147&outputFormat=application/json&srsName=epsg:3857');
    // return this.http.get('https://geowebservices.stanford.edu/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=druid:nz271ny2119&outputFormat=application/json&srsName=epsg:3857');
    // return this.http.get('assets/firstLevel.json');

    return forkJoin([this.http.get('assets/firstLevel.json'),this.http.get('assets/secondLevel.json')]);
  }

  saveNote(json: object){
    // let str = JSON.stringify(json);
    let postHeaders = new HttpHeaders();
    postHeaders = postHeaders.set('Content-Type','application/json')
    return this.http.post(`${this.authUrl}/api/Note`, json, {headers:postHeaders});
  }

  getNotes():Observable<Array<any>>{
    return this.http.get<Array<any>>(`${this.authUrl}/api/Note/all`);
  }

  deleteNote(id: string){
    debugger
    let postHeaders = new HttpHeaders();
    postHeaders = postHeaders.set('Content-Type','application/json')
    return this.http.request('delete',`${this.authUrl}/api/Note`,{body: {id:id},headers:postHeaders});
  }
}
