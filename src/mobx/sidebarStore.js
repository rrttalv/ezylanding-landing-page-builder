import { makeAutoObservable } from "mobx";

class SidebarStore {
  constructor(appStore) {
    makeAutoObservable(this)
    this.appStore = appStore
  }
  
  activeItem = null
  
  toggleItem(id){
    this.activeItem = id
  }

  unsetActiveItem(){
    this.activeItem = null
  }

  
}

export default SidebarStore;