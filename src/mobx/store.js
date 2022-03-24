import AppStore from './appStore';
import { RouterStore } from 'mobx-router';
import SidebarStore from './sidebarStore';
import RouteStore from './routeStore';
import HeaderStore from './headerStore';
import SocketStore from './socketStore';
import DashboardStore from './dashboardStore';
import AuthStore from './authStore';
import AlertStore from './alertStore';

const alerts = new AlertStore()
const auth = new AuthStore(alerts)
const dashboard = new DashboardStore(auth, alerts)
const app = new AppStore(auth, alerts)
const sidebar = new SidebarStore(app, alerts)
const routes = new RouteStore(app)
const socket = new SocketStore(app, auth, alerts)
const header = new HeaderStore(app, sidebar)

const store = {
  auth,
  alerts,
  dashboard,
  app,
  sidebar,
  socket,
  header,
  routes,
  router: new RouterStore()
};

export default store;