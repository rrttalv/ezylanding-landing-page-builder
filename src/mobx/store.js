import AppStore from './appStore';
import { RouterStore } from 'mobx-router';
import SidebarStore from './sidebarStore';
import RouteStore from './routeStore';
import HeaderStore from './headerStore';

const app = new AppStore()
const sidebar = new SidebarStore(app)
const routes = new RouteStore(app)
const header = new HeaderStore(app, sidebar)

const store = {
  app,
  sidebar,
  header,
  routes,
  router: new RouterStore()
};

export default store;