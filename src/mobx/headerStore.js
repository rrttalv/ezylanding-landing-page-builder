import { makeAutoObservable } from "mobx";
import { scripts } from "../config/constants";

class HeaderStore {
  constructor(appStore, sidebarStore) {
    makeAutoObservable(this)
    this.appStore = appStore
    this.sidebarStore = sidebarStore
  }
  
  settingsOpen = false
  settingsMenuContent = null

  toggleMenu(){
    this.settingsOpen = !this.settingsOpen
  }

  toggleMenuItemChildren(target){
    this.settingsMenuContent = this.settingsMenuContent.map(item => {
      if(item.id === target){
        return {
          ...item,
          open: !item.open
        }
      }else{
        return {
          ...item,
          open: false
        }
      }
    })
  }

  initMenuContent(){
    if(!this.settingsMenuContent){
      this.settingsMenuContent = [
        {
          title: 'Front-end framework preferences',
          id: 'frameworks',
          children: scripts.map(script => {
            const { title, scripts: required, id } = script
            return {
              title,
              id,
              selected: this.appStore.activeFramework && this.appStore.activeFramework.id === id,
              onClick: this.appStore.setActiveFramework(id)
            }
          }),
          open: false
        },
        {
          title: 'Deployment settings',
          id: 'deploy-settings',
          open: false
        },
        {
          title: 'Build settings',
          id: 'build-settings',
          open: false
        },
        {
          title: 'Template prefrences',
          id: 'template-settings',
          open: false
        },
        {
          title: 'Editor prefrences',
          id: 'editor-settings',
          open: false
        }
      ]
    }
  }

}

export default HeaderStore;