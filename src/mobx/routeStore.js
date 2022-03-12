import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'
import { scripts } from "../config/constants";
import cssParser from 'css'
import { camelCase, replace, trim } from "lodash";
import { camelToDash, getFlexKeys, textStyleKeys } from "../utils";

const initSectionProps = {
  insertBefore: null,
  insertAfter: null,
  sectionId: null
}

const initDragMeta = {
  insertAfter: null,
  insertBefore: null,
  parent: null
}


class RouteStore {
  constructor(app) {
    makeAutoObservable(this)
    this.app = app
  }

  routeList = []

  getRouteList(){
    this.routeList = this.app.pages.map(page => ({route: page.route, ...page.routeMeta, id: page.id}))
    return this.routeList
  }

  updateRouteProp(pageId, propName, propValue){
    const page = this.app.pages.find(({ id }) => id === pageId)
    if(propName === 'route'){
      page[propName] = propValue
    }else{
      page.routeMeta[propName] = propValue
    }
    this.getRouteList()
  }


  toggleDetails(pageId){
    const page = this.app.pages.find(({ id }) => id === pageId)
    page.routeMeta.detailsOpen = !page.routeMeta.detailsOpen
    this.getRouteList()
  }

}

export default RouteStore