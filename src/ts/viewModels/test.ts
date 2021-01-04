import * as AccUtils from "../accUtils";
import * as ko from "knockout";
import rawData from 'text!./raw-data.json';
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import AnimationUtils = require('ojs/ojanimation');
import "ojs/ojknockout";
import { ojButtonEventMap } from 'ojs/ojbutton';
import { ojDialog } from 'ojs/ojdialog';
import Components = require('ojs/ojcomponentcore');
import 'ojs/ojactioncard';
import 'ojs/ojaccordion';
import 'ojs/ojlistview';
import 'ojs/ojinputtext';
import 'ojs/ojdialog';
import 'ojs/ojformlayout';
import 'ojs/ojanimation';
import 'ojs/ojtranslation';
import 'ojs/ojmasonrylayout';
import 'ojs/ojdefer';
import CoreRouter from "@oracle/oraclejet/dist/types/ojcorerouter";

import { ojPopup } from 'ojs/ojpopup';
  import 'ojs/ojpopup';
  import 'ojs/ojdefer';
  import 'ojs/ojbutton';
import RequiredValidator = require("@oracle/oraclejet/dist/types/ojvalidator-required");
class TestViewModel {
  index: ko.Observable<number>;
  addTab: Function;
  router: CoreRouter;
  tempIndex: number;
  listData: { id: number;  name: string; summary: string; description: string; items: { id: number; header: string; content: string; }[]; }[];
  data: ko.ObservableArray<{ id: number;  name: string; summary: string; description: string; items: { id: number; header: string; content: string; }[]; }>;
  dataProvider: ArrayDataProvider<unknown, unknown>;
  itemTitle: ko.Observable<string|undefined>;
  itemContent: ko.Observable<string|undefined>;
  demoFlipTile: any;
  demoFlipEnd: (tileFront: any, tileBack: any, bForward: any) => void;
  getReadingDirection: () => "rtl" | "ltr";
  
  constructor(context) {
    this.index = context.routerState.detail.index;
    this.addTab = context.routerState.detail.addTab;
    this.listData = JSON.parse(rawData).data;
    this.router = context.parentRouter;
    this.data = ko.observableArray(this.listData);
    this.dataProvider = new ArrayDataProvider(this.data, { keyAttributes: 'id' });
    this.itemContent = ko.observable();
    this.itemTitle = ko.observable();
    this.tempIndex = 0;
    //console.log(JSON.parse(rawData).data);
    this.openDialog = () => {
      let itemDialog = document.getElementById('itemDialog') as ojDialog;
      itemDialog.open();
    };

    this.closeDialog = () => {
      let itemDialog = document.getElementById('itemDialog') as ojDialog;
      itemDialog.close();
    };


    var closestByClass = function (el, className) {
      while (!el.classList.contains(className)) {
            // Increment the loop to the parent node
        el = el.parentNode;
        if (!el) {
          return null;
        }
      }
      return el;
    };

    var getReadingDirection = () => {
      var dir = document.documentElement.getAttribute('dir');
      if (dir) { dir = dir.toLowerCase(); }
      return (dir === 'rtl') ? 'rtl' : 'ltr';
    };

      // Flip a tile.
    this.demoFlipTile = function (event) {
      var target = event.target;

      var tile = closestByClass(target, 'demo-tile');

      var tileContent = tile.querySelector('.demo-tile-content');
      var tileFront = tile.querySelector('.demo-tile-front');
      var tileBack = tile.querySelector('.demo-tile-back');

        // 'demo-tile-shown' class is used to identify the side of the tile that is shown.
      var bForward = tileFront.classList.contains('demo-tile-shown');

        // Determine startAngle and endAngle for the flip.
      var bRtl = getReadingDirection() === 'rtl';
      var startAngle = bForward ? '0deg' : (bRtl ? '180deg' : '-180deg');
      var endAngle = bForward ? (bRtl ? '180deg' : '-180deg') : '0deg';

        // Unhide the side of the tile that was hidden before animating the flip.
      if (bForward) {
        tileBack.classList.remove('demo-hidden');
        Components.subtreeShown(tileBack);
      } else {
        tileFront.classList.remove('demo-hidden');
        Components.subtreeShown(tileFront);
      }

        // Flip the element.
      AnimationUtils.flipOut(tileContent, {
        flipTarget: 'children',
        persist: 'all',
        startAngle: startAngle,
        endAngle: endAngle,
        perspective: '1500px' }).then(function () {
          demoFlipEnd(tileFront, tileBack, bForward);
        });

        event.stopPropagation();
    };

      // Called after the flip transition ends.
    var demoFlipEnd = (tileFront, tileBack, bForward) => {
      var button = null;
      if (bForward) {
          // Set 'demo-tile-shown' class to the side of the tile that is shown.
        tileBack.classList.add('demo-tile-shown');
        tileFront.classList.remove('demo-tile-shown');

          // Find the flip button on the new tile side.
        button = tileBack.querySelector('.demo-back-flip-icon-container .oj-button-sm');

          // Hide the front of the tile after the flip animation.
        tileFront.classList.add('demo-hidden');
        Components.subtreeHidden(tileFront);
      } else {
          // Set 'demo-tile-shown' class to the side of the tile that is shown.
        tileFront.classList.add('demo-tile-shown');
        tileBack.classList.remove('demo-tile-shown');

          // Find the flip button on the new tile side.
        button = tileFront.querySelector('.demo-front-flip-icon-container .oj-button-sm');

          // Hide the back of the tile after the flip animation.
        tileBack.classList.add('demo-hidden');
        Components.subtreeHidden(tileBack);
      }
        // Before the tile was flipped, the button used to flip the
        // tile had focus, so now restore focus to the flip button on
        // the side of the tile that is now showing.
        button.focus();
      
    };

  }

  openDialog = () => {
    let itemDialog = document.getElementById('itemDialog') as ojDialog;
    itemDialog.open();
  };

  closeDialog = () => {
    let itemDialog = document.getElementById('itemDialog') as ojDialog;
    itemDialog.close();
  };

  public clickButton = (event: ojButtonEventMap['ojAction']) => {
    let key = (event.currentTarget as HTMLElement).id;
    console.log((event.currentTarget as HTMLElement).id);
    this.listData.forEach(element => {
      if (element.id.toString() === key) {
        console.log(element.name);
        let index = this.listData.indexOf(element);
        //this.index(index);
        this.addTab(index, element.name);
        //this.router.go({path: 'details', params:{ index: this.listData.indexOf(element)}});
      }
    });
    
    return true;
  };

  public addItem = () =>{
    this.listData[this.index()].items.push({
      id: this.tempIndex+2000,
      header: this.itemTitle(),
      content: this.itemContent()
    });
    this.tempIndex++;
    this.data(this.listData);
    let tempIndex = this.index();
    this.index(-1);
    this.index(tempIndex);
    console.log(this.data());
    this.itemTitle("");
    this.itemContent("");
    this.closeDialog();
    return true;
  }

  public deleteItem = (event: ojButtonEventMap['ojAction']) =>{
    let key = (event.currentTarget as HTMLElement).id.substr(3);
    for(let i=0;i<this.listData[this.index()].items.length;i++){
      if(this.listData[this.index()].items[i].id.toString() === key){
        this.listData[this.index()].items.splice(i,1)
        break;
      }
    }
    let tempIndex = this.index();
    this.index(-1);
    this.index(tempIndex);
  }

  public openListener(event: ojButtonEventMap['ojAction']) {
    let id = (event.currentTarget as HTMLElement).id.substr(3);
    (document.querySelector('#pop'+id) as ojPopup).open('#btn'+id);
    console.log((event.currentTarget as HTMLElement).id.substr(3));
    event.stopPropagation();
  };

  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */
  connected(): void {
    AccUtils.announce("Test page loaded.");
    document.title = "Solar System";
    // implement further logic if needed
  }

  /**
   * Optional ViewModel method invoked after the View is disconnected from the DOM.
   */
  disconnected(): void {
    // implement if needed
  }

  /**
   * Optional ViewModel method invoked after transition to the new View is complete.
   * That includes any possible animation between the old and the new View.
   */
  transitionCompleted(): void {
    // implement if needed
  }
  
}

export = TestViewModel;