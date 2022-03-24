import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'
import { checkIfAuthenticated, fetchPaymentMethods, getCustomerInvoices, getPaymentIntent, getSubscriptionDetails, handleRegularAuth, logout } from "../services/AuthService";

const initDetails = {
  email: '',
  _id: null,
}

class AuthStore {
  constructor(alerts) {
    makeAutoObservable(this)
    this.alerts = alerts
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

  subMeta = {}
  subscriptionLoading = false
  subscriptionDetails = {}
  invoices = []
  invoicesLoading = false

  changeActiveProfileView(id){
    this.activeProfileView = id
  }

  async fetchInvoices(){
    try{
      this.invoicesLoading = true
      const { data: { invoiceList } } = await getCustomerInvoices(true)
      this.invoices = invoiceList
    }catch(err){
      console.log(err)
      this.alerts.createToast('Failed to fetch invoices', 'error', 5000)
    }finally{
      this.invoicesLoading = false
    }
  }

  setPurchaseStatus(status){
    this.purchaseInProgress = status
  }

  async fetchSubscriptionDetails(){
    try{
      this.subscriptionLoading = true
      const { data: { subscriptionDetails } } = await getSubscriptionDetails()
      this.subscriptionDetails = subscriptionDetails
    }catch(err){
      console.log(err)
      this.alerts.createToast('Failed to fetch subscription details', 'error', 5000)
    }finally{
      this.subscriptionLoading = false
    }
  }

  async checkAuth(){
    try{
      this.authLoading = true
      const { data: { user, subscription } } = await checkIfAuthenticated()
      if(user){
        this.auth = true
        this.userDetails = { ...user }
      }
      if(subscription){
        this.subscription = subscription.valid
        this.subMeta = {
          ...subscription
        }
      }
      return true
    }catch(err){
      this.auth = false
      this.subMeta = {}
      this.subscription = false
      this.userDetails = { ...initDetails }
      this.authLoading = false
    }finally{
      this.authLoading = false
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
        this.alerts.createToast(`Failed to register: ${message}`, 'error', 5000)
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
        this.alerts.createToast(`Failed to login: ${message}`, 'error', 5000)
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