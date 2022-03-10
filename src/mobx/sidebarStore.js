import { makeAutoObservable } from "mobx";
import { fetchAssets, uploadFile } from "../services/AssetService";

class SidebarStore {
  constructor(appStore) {
    makeAutoObservable(this)
    this.appStore = appStore
  }
  
  activeItem = null
  focusedComponent = null

  //The current target element which will have it's source changed
  targetedElement = null

  //Assets fetching meta
  assets = []
  assetPageNo = 0
  assetsLoading = false
  assetSearchKeyword = null
  moreAssets = true
  
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

  async fetchAssets(){
    try{
      if(!this.moreAssets){
        return
      }
      this.assetsLoading = true
      const { data } = await fetchAssets(this.assetPageNo, this.assetSearchKeyword)
      const { assets, isMore } = data
      if(assets.length === 0 && isMore){
        this.assetPageNo += 1
        return this.fetchAssets()
      }
      this.moreAssets = isMore
      this.assets = [...this.assets, ...assets]
      this.assetPageNo += 1
      this.assetsLoading = false
    }catch(err){
      console.log(err)
      this.assetsLoading = false
    }
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