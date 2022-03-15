import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'
import { handleRegularAuth } from "../services/AuthService";

const initDetails = {
  email: '',
  _id: null,
}

class AuthStore {
  constructor() {
    makeAutoObservable(this)
  }

  auth = false
  subscription = false
  authLoading = false
  userDetails = {
    email: '',
    id: null,
  }

  async handleRegister(email, password) {
    try{
      this.authLoading = true
      const { success, message, redirect } = await handleRegularAuth(email, password, false)
      if(success){
        window.location = redirect
      }else{
        //show error message
        console.log(message)
      }
      this.authLoading = false
    }catch(err){
      console.log(err)
      this.authLoading = false
    }
  }


  async handleLogin(email, password) {
    try{
      this.authLoading = true
      const { success, message, redirect } = await handleRegularAuth(email, password, true)
      if(success){
        window.location = redirect
      }else{
        //show error message
        console.log(message)
      }
      this.authLoading = false
    }catch(err){
      console.log(err)
      this.authLoading = false
    }
  }

  setAuth(status, user) {
    this.auth = status
    if(!status){
      this.userDetails = {...initDetails}
      this.subscription = false
    }else{
      this.userDetails = { email: user.email, id: user._id }
      if(user.subscription){
        this.subscription = user.subscription
      }
    }
  }

}

export default AuthStore