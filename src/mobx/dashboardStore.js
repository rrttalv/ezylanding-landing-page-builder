import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'
import { fetchTemplateList } from "../services/TemplateService";

const initDetails = {
  email: '',
  _id: null,
}

class dashboardStore {
  constructor() {
    makeAutoObservable(this)
  }

  activeView = 'templates'

  assets = []
  assetsPage = 0
  assetsLoading = false
  assetFilter = null
  moreAssets = true

  templates = []
  templateFilter = null
  templatePage = 0
  moreTemplates = true
  templatesLoading = false

  changeActiveView(id){
    this.activeView = id
  }

  async fetchUserTemplates(override = false) {
    if((this.templatesLoading || !this.moreTemplates) && !override){
      return
    }
    try{
      this.templatesLoading = true
      const { data: { templates, isMore } } = await fetchTemplateList(this.templatePage)
      this.templatePage += 1
      this.moreTemplates = isMore
      this.templates = [...this.templates, ...templates]
      this.templatesLoading = false
    }catch(err){
      console.log(err)
      this.templatesLoading = false
    }
  }


}

export default dashboardStore