import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'

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

  setSocket(socket){
    this.socket = socket
    const id = uuidv4()
    this.roomId = id
    this.socket.emit('roomInit', { roomId: id })
    this._saveInterval = setInterval(() => {
      this.saveTemplate()
    }, 20000)
  }

  saveTemplate(){
    const { templateId, pages, cssTabs, palette, activeFramework, templateMetadata } = this.app
    const { title, id, scripts } = activeFramework
    const frameworkMeta = { title, id, scripts }
    const templateMeta = {
      customScripts: this.app.customScripts,
      footerId: this.app.footerId,
      headerId: this.app.headerId,
      ...templateMetadata
    }
    const { id: userId } = this.auth.userDetails
    this.socket.emit('saveTemplate', userId, templateId, pages, cssTabs, palette, frameworkMeta, templateMeta)
  }

}

export default SocketStore