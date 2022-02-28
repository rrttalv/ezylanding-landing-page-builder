import { makeAutoObservable } from "mobx";

class SidebarStore {
  constructor(appStore) {
    makeAutoObservable(this)
    this.appStore = appStore
  }
  
  activeItem = null
  
  toggleItem(id){
    this.appStore.togglePaletteEditing(null)
    this.activeItem = id
  }

  unsetActiveItem(){
    this.appStore.togglePaletteEditing(null)
    this.activeItem = null
  }

  
}

export default SidebarStore;