import AppStore from './appStore';
import { RouterStore } from 'mobx-router';
import SidebarStore from './sidebarStore';

const app = new AppStore()

const store = {
  app,
  sidebar: new SidebarStore(app),
  router: new RouterStore()
};

export default store;