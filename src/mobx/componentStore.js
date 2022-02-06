import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'

class ComponentStore {
  constructor() {
    makeAutoObservable(this)
  }

  
}

export default ComponentStore