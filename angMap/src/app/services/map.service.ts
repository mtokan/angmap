import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }

  getFeatures() {
    // return this.http.get('https://geowebservices.stanford.edu/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=druid:nh891yz3147&outputFormat=application/json&srsName=epsg:3857');
    // return this.http.get('https://geowebservices.stanford.edu/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=druid:nz271ny2119&outputFormat=application/json&srsName=epsg:3857');
    // return this.http.get('assets/firstLevel.json');

    return forkJoin([this.http.get('assets/firstLevel.json'),this.http.get('assets/secondLevel.json')]);
  }
}
