import AppStore from './appStore';
import { RouterStore } from 'mobx-router';
import SidebarStore from './sidebarStore';
import RouteStore from './routeStore';
import HeaderStore from './headerStore';
import SocketStore from './socketStore';
import DashboardStore from './dashboardStore';
import AuthStore from './authStore';

const auth = new AuthStore()
const dashboard = new DashboardStore(auth)
const app = new AppStore(auth)
const sidebar = new SidebarStore(app)
const routes = new RouteStore(app)
const socket = new SocketStore(app, auth)
const header = new HeaderStore(app, sidebar)

const store = {
  auth,
  dashboard,
  app,
  sidebar,
  socket,
  header,
  routes,
  router: new RouterStore()
};

export default store;