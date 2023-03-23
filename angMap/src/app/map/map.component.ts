import { Component, OnInit, AfterViewInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { Feature, Map } from 'ol';
import { OSM } from 'ol/source';
import {GeoJSON, WFS} from 'ol/format.js';
import { Circle, Fill ,Stroke, Style, Text} from 'ol/style.js';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View';
import Select from 'ol/interaction/Select.js';
import Draw from 'ol/interaction/Draw.js';
import { MapService } from '../services/map.service';
import { PrimeNGConfig } from 'primeng/api'
import {getCenter, buffer, Extent} from 'ol/extent'
import Interaction from 'ol/interaction/Interaction';
import Layer from 'ol/layer/Layer';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  public map!: Map
  public firstLevelVectorSource!: VectorSource
  public secondLevelVectorSource!: VectorSource
  public pointVectorSource!: VectorSource
  public firstLevelVectorLayer!: VectorLayer<VectorSource>
  public secondLevelVectorLayer!: VectorLayer<VectorSource>
  public pointVectorLayer!: VectorLayer<VectorSource>
  public selectInteraction!: Select
  public drawInteraction!: Draw
  public deleteInteraction!: Select
  public readInteraction!: Select
  public display!: boolean
  public wikiContent!:string
  public landType!:string
  public selectedValue = 1;
  public selectedFeatures!:any
  public drawStatus = [{name: 'write', value: 'w'},{name: 'read', value: 'r'},{name: 'delete', value: 'd'}]
  public selectedDrawStatus!:string
  public modalVisibility = false
  public deleteModalVisibility = false
  public readModalVisibility = false
  public inputText!:string
  public deleteText!:string
  public addedNoteFeature!: Feature
  public deletedFeature!: Feature
  public interactions: Interaction[] = []
  public readText!: string
  public actionSelection!: string
  public actionPanelVisibility = false
  public form = this.formBuilder.group({
    firstLevel: true,
    secondLevel: false,
    points: false,
  })

  constructor(private mapService: MapService,private primengConfig: PrimeNGConfig,private formBuilder: FormBuilder ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.initializeLayers();
    this.initializeMap();
  }

  ngAfterViewInit(): void {

    this.getAdministrativeFeatures();
    this.initializeInteractions();
    this.setInteractionEventHandlers();

    this.changeInteraction(this.readInteraction);
  }

  public changeLayer(){
    this.map.getLayers().getArray().map(x => {
      if (x.getProperties()['layerId'] != 0  ) {
        let a = this.form.get(x.getProperties()['layerId'])?.value as boolean;
        x.setVisible(a);
      }
    });
    if(this.form.controls.points.value){
      this.actionPanelVisibility = true;
    } else {
      this.actionPanelVisibility = false;
    }
  }

  // public changeLayer() {
  //   this.map.getLayers().getArray().map(x => {
  //     if(x.getProperties()['layerId'] == this.selectedValue || x.getProperties()['layerId'] == 0){
  //       x.setVisible(true);
  //     } else {
  //       x.setVisible(false);
  //     }
  //   });
  //   if(this.selectedValue == 99){
  //     this.selectedDrawStatus = 'r';
  //     this.changeInteraction(this.readInteraction);
  //   } else {
  //     this.selectedDrawStatus = '';
  //     this.changeInteraction(this.selectInteraction);
  //   }
  // }

  public changeNoteInteraction(){
    if (this.actionSelection === 'create') {
      this.changeInteraction(this.drawInteraction);
    } else if(this.actionSelection === 'delete'){
      this.changeInteraction(this.deleteInteraction);
    } else if (this.actionSelection === 'select'){
      this.changeInteraction(this.readInteraction);
    }
  }

  public saveNote(){
    this.addedNoteFeature.setProperties({'text': this.inputText});
    this.inputText = '';
    this.modalVisibility = false
    let a = new GeoJSON();
    this.pointVectorSource.getFeatures().forEach(x => {console.log(a.writeFeature(x))});
  }

  public cancelNote(){
    this.pointVectorSource.removeFeature(this.addedNoteFeature);
    this.inputText = '';
    this.modalVisibility = false
  }

  public delete(){
    this.pointVectorSource.removeFeature(this.deletedFeature);
    this.deleteModalVisibility = false;
    this.deleteText = '';
  }

  public cancelDelete(){
    this.deleteText = '';
    this.deleteModalVisibility = false;
    this.deleteInteraction.getFeatures().clear();
  }

  firstLevelStyleFunction(feature:any){
    return new Style({
        stroke: new Stroke({
          color: '#5C6BC0',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(159, 168, 218, 0.5)'
        }),
        text: new Text({
          text: `Name: ${feature.get('name_1')}
Type: ${feature.get('type_1')}`,
          placement: 'point',
          fill: new Fill({
            color:'#303F9F'
          }),
          font: 'Bold 15px / 1 Verdana',
        })
      })
  }

  secondLevelStyleFunction(feature:any){
    return new Style({
        stroke: new Stroke({
          color: '#EC407A',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(244, 143, 177, 0.5)'
        }),
        text: new Text({
          text: `Name: ${feature.get('name_2')}
Type: ${feature.get('type_2')}`,
          placement: 'point',
          fill: new Fill({
            color:'#C2185B'
          }),
          font: 'Bold 15px / 1 Verdana',
        })
      })
  }

  public initializeLayers(){
    this.firstLevelVectorSource = new VectorSource();
    this.secondLevelVectorSource = new VectorSource();
    this.pointVectorSource = new VectorSource();

    this.pointVectorLayer = new VectorLayer({
      properties: {'layerId': 'points'},
      source: this.pointVectorSource,
      visible: true,
      style: new Style({
        image: new Circle({
          radius: 7,
          stroke: new Stroke({
            color:'rgba(0, 0, 255, 1.0)',
            width: 2
          }),
          fill: new Fill({
            color:'rgba(0, 0, 255, 0.2)'
          })
        })
      })
    });
    
    this.firstLevelVectorLayer = new VectorLayer({
      properties: {'layerId': 'firstLevel'},
      source: this.firstLevelVectorSource,
      visible: true,
      style: this.firstLevelStyleFunction
    });

    this.secondLevelVectorLayer = new VectorLayer({
      properties: {'layerId': 'secondLevel'},
      source: this.secondLevelVectorSource,
      visible: false,
      style: this.secondLevelStyleFunction
    });
  }

  public initializeMap(){
    const extent:Extent = [653028, 5986276, 1674447, 7372844];
    this.map = new Map({
      layers: [
        new TileLayer({
          properties: {'layerId': 0},
          source: new OSM(),
          visible: true
        }),
        this.firstLevelVectorLayer,
        this.secondLevelVectorLayer,
        this.pointVectorLayer
      ],
      target: 'map',
      view: new View({
        center: getCenter(extent),
        extent: buffer(extent,100000),
        showFullExtent:true,
        zoom:1
      }),
      controls:[]
    });
  }

  private getAdministrativeFeatures(){
    this.mapService.getFeatures()
    .subscribe(response => {
      const firstLevelFeatures = new GeoJSON().readFeatures(response[0]);
      const secondLevelFeatures = new GeoJSON().readFeatures(response[1]);
      this.firstLevelVectorSource.addFeatures(firstLevelFeatures);
      this.secondLevelVectorSource.addFeatures(secondLevelFeatures);
    })
  }

  private selectInteractionFilter(layer:Layer){
    if(layer.getProperties()['layerId'] == 'points'){
      return true;
    } else {
      return false;
    }
  }

  private initializeInteractions(){
    this.drawInteraction = new Draw({
      source: this.pointVectorSource,
      type: 'Point'
    });

    this.deleteInteraction = new Select();

    this.readInteraction = new Select({
      layers: this.selectInteractionFilter
    });

    this.interactions.push(this.drawInteraction,this.deleteInteraction,this.readInteraction);
  }

  private setInteractionEventHandlers(){
    this.drawInteraction.on('drawend', e => {
      this.addedNoteFeature = e.feature
      this.modalVisibility = true
    });
    
    this.deleteInteraction.on('select', e => {
      if(e.selected.length != 0){
      let text = e.selected[0].getProperties() as any;
      this.deleteText = text.text
      this.deleteModalVisibility = true
      this.deletedFeature = e.selected[0];
      }
    });

    this.readInteraction.on('select', e => {
      if (this.actionPanelVisibility && e.selected.length != 0){
        this.readText = e.selected[0].getProperties()['text'];
        this.readModalVisibility = true;
        this.readInteraction.getFeatures().clear();
      }
    });
  }

  private changeInteraction(interaction:Interaction){
    this.interactions.forEach(x => {
      this.map.removeInteraction(x);
    });
    this.map.addInteraction(interaction);
  }
}
