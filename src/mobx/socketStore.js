import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'

class SocketStore {
  constructor(app) {
    makeAutoObservable(this)
    this.app = app
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
    const { templateId, pages, cssTabs, palette, activeFramework } = this.app
    const { title, id, scripts } = activeFramework
    const frameworkMeta = { title, id, scripts }
    this.socket.emit('saveTemplate', null, templateId, pages, cssTabs, palette, frameworkMeta)
  }

}

export default SocketStore