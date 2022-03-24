import axios from "axios"
import { getAPIBase } from "../utils"

const config = { withCredentials: true }

export const handleRegularAuth = async (email, password, isLogin = true) => {
  const body = { username: email, password }
  return axios.post(`${getAPIBase()}/auth/${isLogin ? 'login' : 'register'}`, body, { withCredentials: true })
}

export const checkIfAuthenticated = async () => {
  return axios.get(`${getAPIBase()}/auth/check`, { withCredentials: true })
}

export const logout = async () => {
  return axios.get(`${getAPIBase()}/auth/logout`, { withCredentials: true })
}

export const getPaymentIntent = async tag => {
  return axios.post(`${getAPIBase()}/api/billing/payment-intent`, { tag }, { withCredentials: true })
}

export const createPaymentMethod = async paymentMethodId => { 
  return axios.post(`${getAPIBase()}/api/billing/create-method`, { paymentMethodId }, config)
}

export const discardSubscription = async subscriptionId => {
  return axios.put(`${getAPIBase()}/api/billing/discard-subscription`, { subscriptionId }, config)
}

export const getSubscriptionDetails = async () => {
  return axios.get(`${getAPIBase()}/api/billing/subscription`, config)
}

export const getCustomerInvoices = async (subscriptionOnly = false) => {
  let params = ''
  if(subscriptionOnly){
    params = `?subscriptionInvoices=true`
  }
  return axios.get(`${getAPIBase()}/api/billing/invoices${params}`, config)
}

export const fetchPaymentMethods = async () => {
  return axios.post(`${getAPIBase()}/api/billing/payment-methods`, config)
}