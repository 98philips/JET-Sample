import * as AccUtils from "../accUtils";
import "ojs/ojknockout";
import * as ko from "knockout";
import rawData from 'text!./raw-data.json';
import 'ojs/ojaccordion';
import CoreRouter from "ojs/ojcorerouter";

class DetailsViewModel {
  heading: ko.Observable<string>;
  record: ko.Observable<any>;
  listData: any;
  router: CoreRouter;


  constructor(context) {
    this.heading = context.routerState.detail.heading;
    this.listData = JSON.parse(rawData).data;
    let item = this.listData[context.params.index];
    this.record = ko.observable(item);
    this.heading(item.name);
    this.router = context.parentRouter;
  }

  public backAction = (): void => {
  }

  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */
  connected(): void {
    AccUtils.announce("Details page loaded.");
 //   document.title = this.record().name;
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

export = DetailsViewModel;