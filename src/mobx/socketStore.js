import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'
import { toBlob } from 'html-to-image';
import { saveThumbnail } from "../services/TemplateService";

class SocketStore {
  constructor(app, auth) {
    makeAutoObservable(this)
    this.app = app
    this.auth = auth
  }


  //editor socketIO client that is used to save all the changes in real-time
  socket = null
  roomId = null
  _saveInterval = null
  _thumbnailInterval = null
  previewImage = null

  setSocket(socket){
    this.socket = socket
    const id = uuidv4()
    this.roomId = id
    const { _id: userId } = this.auth.userDetails
    this.socket.emit('roomInit', { roomId: id, userId })
    this._saveInterval = setInterval(() => {
      this.saveTemplate()
    }, 15000)
    setTimeout(() => {
      this.saveThumbnail()
    }, 20000)
    this._thumbnailInterval = setInterval(() => {
      this.saveThumbnail()
    }, 120 * 1000)
  }

  async saveThumbnail(){
    const { pages, activePage, templateId, publicTemplate } = this.app
    //Public template thumbnails and preview pictures are generated manually to ensure the best quality
    if(publicTemplate){
      return
    }
    let previewBlob = null
    if(activePage === pages[0].id){
      const frame = document.querySelector('iframe')
      if(frame){
        const root = frame.contentDocument.documentElement
        previewBlob = await toBlob(root, { quality: 1, backgroundColor: '#fff' })
      }
    }
    if(previewBlob){
      const fd = new FormData()
      const file = new File([previewBlob], `${new Date().getTime()}.png`)
      fd.append('thumbnail', file)
      await saveThumbnail(fd, templateId)
    }
  }

  async saveTemplate(){
    const { templateId, pages, cssTabs, palette, activeFramework, templateMetadata } = this.app
    const { title, id, scripts } = activeFramework
    const frameworkMeta = { title, id, scripts }
    const templateMeta = {
      customScripts: this.app.customScripts,
      footerId: this.app.footerId,
      headerId: this.app.headerId,
      ...templateMetadata
    }
    const { _id: userId } = this.auth.userDetails
    this.socket.emit('saveTemplate', userId, templateId, pages, cssTabs, palette, frameworkMeta, templateMeta)
    this.app.setSaved(true)
  }

}

export default SocketStore