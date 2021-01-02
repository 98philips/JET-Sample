import * as AccUtils from "../accUtils";
import * as ko from "knockout";
import rawData from 'text!./raw-data.json';
import "ojs/ojknockout";
import { ojButtonEventMap } from 'ojs/ojbutton';
import 'ojs/ojactioncard';
import CoreRouter from "@oracle/oraclejet/dist/types/ojcorerouter";

import { ojPopup } from 'ojs/ojpopup';
  import 'ojs/ojpopup';
  import 'ojs/ojdefer';
  import 'ojs/ojbutton';
class TestViewModel {
  heading: ko.Observable<string>
  router: CoreRouter
  listData: { id: number; customerId: number; name: string; summary: string; description: string; items: { id: number; header: string; content: string; }[]; }[];
  constructor(context) {
    this.heading = context.routerState.detail.heading;
    this.heading("Home");
    this.listData = JSON.parse(rawData).data;
    this.router = context.parentRouter;
    console.log(JSON.parse(rawData).data);

  }

  public clickButton = (event: ojButtonEventMap['ojAction']) => {
    let key = (event.currentTarget as HTMLElement).id;
    console.log((event.currentTarget as HTMLElement).id);
    this.listData.forEach(element => {
      if (element.id.toString() === key) {
        //this.record(element);
        console.log(element.name);
        this.heading(element.name);
        this.router.go({path: 'details', params:{ index: this.listData.indexOf(element)}});
      }
    });
    
    return true;
  };

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
    document.title = "Test";
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