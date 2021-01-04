import CoreRouter = require("ojs/ojcorerouter");
import * as AccUtils from "../accUtils";
import * as ko from "knockout";
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import "ojs/ojknockout";
import ModuleRouterAdapter = require("ojs/ojmodulerouter-adapter");
import Context from 'ojs/ojcontext';

interface Tab {
  name: string | undefined,
  id: number,
  disabled?: string
}

class DashboardViewModel {
  data: ko.ObservableArray<Tab>;
  tabDataProvider: ArrayDataProvider<string, string>;
  index: ko.Observable<number>;
  currentIndex: ko.Observable<number | undefined>;
  tabCount: number;
  delete: (id: number) => void;
  onRemove: (event: CustomEvent) => void;
  addTab: (index: number, name: string) => void;

  router: CoreRouter;
  addPath: Function;
  childRouter: CoreRouter;
  heading: ko.Observable<string>;
  module: ModuleRouterAdapter;

  constructor(context) {
    this.router = context.parentRouter;
    this.addPath = context.routerState.detail.addPath;
    this.heading = ko.observable("Home");
    this.initTabs();
    this.childRouter = this.router.createChildRouter([
      { path: '', redirect: 'test' },
      { path: 'test', detail: { index: this.index , addTab: this.addTabfn} },
      { path: 'details', detail: { heading: this.heading } }
    ]
    );
    this.module = new ModuleRouterAdapter(this.childRouter);
  }

  initTabs = () => {
    this.data = ko.observableArray<Tab>([{
      name: 'Home',
      id: -1
    },
    ]);
    this.tabDataProvider = new ArrayDataProvider(this.data, { keyAttributes: 'id' });
    this.index = ko.observable(-1);
    this.currentIndex = ko.observable(-1);
    this.tabCount = 0;
    this.delete = (id) => {
      const hnavlist = document.getElementById('hnavlist');
      if (hnavlist != null) {
        let items = this.data();
        for (let i = 0; i < items.length; i++) {
          if (items[i].id == id) {
            this.data.splice(i, 1);
            // Context.getContext(hnavlist)
            //   .getBusyContext()
            //   .whenReady()
            //   .then(function () {
            //     hnavlist.focus();
            //   });
            break;
          }
        }
      }
    };

    this.onRemove = (event: CustomEvent) => {
      this.delete(event.detail.key);
      event.preventDefault();
      event.stopPropagation();
      this.index(-1);
    };


    this.addTab = (id: number, name: string) => {
      let items = this.data();
      let flag: boolean = true;
        for (let i = 0; i < items.length; i++) {
          if (items[i].id == id) {
            flag = false;
            break;
          }
        }
        if(flag){
          this.data.push({
            "name": name,
            "id": id
          });
        }
      
      this.currentIndex(id);
      console.log(this.data());
      console.log("ID: "+id);
      this.index(id);
    };
  }

  addTabfn = (id: number, name: string) =>{
    this.addTab(id,name);
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
