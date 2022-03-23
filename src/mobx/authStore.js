import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'
import { checkIfAuthenticated, fetchPaymentMethods, getPaymentIntent, handleRegularAuth, logout } from "../services/AuthService";

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

  activeProfileView = 'profile'

  purchaseInProgress = false

  userDetails = {
    email: '',
    id: null,
  }

  paymentMethods = []

  activePlan = {
    id: null,
    expiry: null
  }

  changeActiveProfileView(id){
    this.activeProfileView = id
  }

  setPurchaseStatus(status){
    this.purchaseInProgress = status
  }

  async checkAuth(){
    try{
      const { data: { user } } = await checkIfAuthenticated()
      if(user){
        this.auth = true
        this.userDetails = { ...user }
      }
      return true
    }catch(err){
      this.auth = false
      this.userDetails = { ...initDetails }
    }
  }

  async fetchPaymentMethods(){
    try{
      const { data: { methods } } = await fetchPaymentMethods()
      this.paymentMethods = methods
    }catch(err){
      console.log(err)
    }
  }

  setPaymentMethods(methods){
    this.paymentMethods = methods
  }

  async logout(){
    try{
      await logout()
      this.auth = false
      this.userDetails = { ...initDetails }
      window.location = '/auth'
    }catch(err){
      console.log(err)
    }
  }

  async handleRegister(email, password) {
    try{
      this.authLoading = true
      const { data: { success, message, redirect, user } } = await handleRegularAuth(email, password, false)
      if(success){
        this.auth = true
        this.userDetails = { ...user }
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
      const { data: { success, message, redirect, user } } = await handleRegularAuth(email, password, true)
      if(success){
        this.auth = true
        this.userDetails = { ...user }
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