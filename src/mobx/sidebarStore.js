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

  //Asset upload data
  uploadingAsset = false
  
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

  addAsset(data){
    this.assets.splice(0, 0, data)
  }

  async fetchAssets(){
    try{
      if(!this.moreAssets){
        return
      }
      this.assetsLoading = true
      const { data } = await fetchAssets(this.assetPageNo, this.assetSearchKeyword)
      const { assets, isMore } = data
      this.assets = [...this.assets, ...assets]
      if(assets.length < 15 && isMore){
        this.assetPageNo += 1
        return this.fetchAssets()
      }
      this.moreAssets = isMore
      this.assetPageNo += 1
      this.assetsLoading = false
    }catch(err){
      console.log(err)
      this.assetsLoading = false
    }
  }

  async uploadAsset(file){
    try{
      this.uploadingAsset = true
      const { data } = await uploadFile(file)
      const { asset } = data
      console.log(this.assets.length)
      this.addAsset(asset)
      console.log(this.assets.length)
      if(this.targetedElement){
        this.appStore.updateElementProp(this.targetedElement, 'src', asset.url)
        this.appStore.toggleElementProp(this.targetedElement, 'editingSrc', false)
        this.targetedElement = null
      }
    }catch(err){
      //show err
      console.log(err)
    }finally{
      this.uploadingAsset = false
    }
  }
  
}

export default SidebarStore;