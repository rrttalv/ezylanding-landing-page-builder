import { makeAutoObservable } from "mobx";

class SidebarStore {
  constructor(appStore) {
    makeAutoObservable(this)
    this.appStore = appStore
  }
  
  activeItem = null
  focusedComponent = null
  
  toggleItem(id){
    this.appStore.togglePaletteEditing(null)
    this.activeItem = id
  }

  unsetActiveItem(){
    this.appStore.togglePaletteEditing(null)
    this.activeItem = null
  }

  setFocusedComponent(id){
    this.focusedComponent = id
  }

  
}

export default SidebarStore;