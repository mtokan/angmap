import { Component, OnInit, AfterViewInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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
import {MatDialog} from '@angular/material/dialog';
import { SaveNoteDialogComponent } from '../save-note-dialog/save-note-dialog.component';
import { ReadNoteDialogComponent } from '../read-note-dialog/read-note-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

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
  public interactions: Interaction[] = []
  public actionSelection: string = 'select';
  public actionPanelVisibility = false
  public form = this.formBuilder.group({
    firstLevel: true,
    secondLevel: false,
    points: false,
  })

  constructor(private mapService: MapService,private primengConfig: PrimeNGConfig,private formBuilder: FormBuilder,public dialog: MatDialog) {}

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
      this.changeInteraction(this.readInteraction);
      this.actionSelection = 'select'
    }
  }

  public changeNoteInteraction(){
    if (this.actionSelection === 'create') {
      this.changeInteraction(this.drawInteraction);
    } else if(this.actionSelection === 'delete'){
      this.changeInteraction(this.deleteInteraction);
    } else if (this.actionSelection === 'select'){
      this.changeInteraction(this.readInteraction);
    }
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
      const dialogRef = this.dialog.open<SaveNoteDialogComponent,any,FormGroup>(SaveNoteDialogComponent, {disableClose: true});
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          e.feature.setProperties({'title':result.value['title'],'date':result.value['date'],'note':result.value['note']});
        } else {
          this.pointVectorSource.removeFeature(e.feature);
        }
      })
    });
    
    this.deleteInteraction.on('select', e => {
      if(e.selected.length != 0){
      const title = e.selected[0].getProperties()['title'];
      const dialogRef = this.dialog.open<AlertDialogComponent,string,boolean>(AlertDialogComponent,{disableClose: true,data: `Are you sure you want to delete this note?`});
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.pointVectorSource.removeFeature(e.selected[0]);
        }
      })}
    });

    this.readInteraction.on('select', e => {
      if (e.selected.length != 0){
        const _title = e.selected[0].getProperties()['title'];
        const _date = e.selected[0].getProperties()['date'];
        const _note = e.selected[0].getProperties()['note'];
        
        const dialogRef = this.dialog.open(ReadNoteDialogComponent, {data: {title: _title, date: new Date(_date).toLocaleDateString(), note: _note}});
        dialogRef.afterClosed().subscribe(result => this.readInteraction.getFeatures().clear());
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
