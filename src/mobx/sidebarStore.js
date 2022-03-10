import { makeAutoObservable } from "mobx";
import { uploadFile } from "../services/AssetService";

class SidebarStore {
  constructor(appStore) {
    makeAutoObservable(this)
    this.appStore = appStore
  }
  
  activeItem = null
  focusedComponent = null

  //The current target element which will have it's source changed
  targetedElement = null
  assets = []
  assetPageNo = 0
  
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

  setTargetedElement(id){
    this.targetedElement = id
  }

  async uploadAsset(file){
    try{
      const { data } = await uploadFile(file)
      if(this.targetedElement){
        this.appStore.updateElementProp(this.targetedElement, 'src', data.assetUrl)
        this.appStore.toggleElementProp(this.targetedElement, 'editingSrc', false)
        this.targetedElement = null
      }
    }catch(err){
      //show err
      console.log(err)
    }
  }
  
}

export default SidebarStore;