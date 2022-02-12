import AppStore from './appStore';
import { RouterStore } from 'mobx-router';
import SidebarStore from './sidebarStore';
import HeaderStore from './headerStore';

const app = new AppStore()
const sidebar = new SidebarStore(app)
const header = new HeaderStore(app, sidebar)

const store = {
  app,
  sidebar,
  header,
  router: new RouterStore()
};

export default store;