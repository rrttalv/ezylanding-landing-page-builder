import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'

class SocketStore {
  constructor(app) {
    makeAutoObservable(this)
    this.app = app
  }


  //editor socketIO client that is used to save all the changes in real-time
  socket = null

  setSocket(socket){
    console.log(socket)
    this.socket = socket
  }

}

export default SocketStore