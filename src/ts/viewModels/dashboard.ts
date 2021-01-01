import CoreRouter = require("ojs/ojcorerouter");
import * as AccUtils from "../accUtils";
import * as ko from "knockout";
import "ojs/ojknockout";
import ModuleRouterAdapter = require("ojs/ojmodulerouter-adapter");
class DashboardViewModel {

  router: CoreRouter
  addPath: Function
  childRouter: CoreRouter
  heading: ko.Observable<string>
  module: ModuleRouterAdapter
  constructor(context) {
    this.router = context.parentRouter;
    this.addPath = context.routerState.detail.addPath;
    this.heading = ko.observable("Home");
    this.childRouter = this.router.createChildRouter([
      { path: '', redirect: 'test' },
      { path: 'test', detail: { heading: this.heading }},
      { path: 'details', detail: { heading: this.heading }}
    ]
    );
    this.module = new ModuleRouterAdapter(this.childRouter);
  }

  clickAction = () => {
    // this.addPath("test");
    // //this.router.sync();
    // console.log("clickAction");
    // return true;
    this.childRouter.go({ path: 'test' });
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
    AccUtils.announce("Dashboard page loaded.");
    document.title = "Dashboard";
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

export = DashboardViewModel;
