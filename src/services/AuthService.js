import axios from "axios"
import { getAPIBase } from "../utils"

export const handleRegularAuth = async (email, password, isLogin = true) => {
  const body = { username: email, password }
  return axios.post(`${getAPIBase()}/auth/${isLogin ? 'login' : 'register'}`, body, { withCredentials: true })
}

export const checkIfAuthenticated = async () => {
  return axios.get(`${getAPIBase()}/auth/check`, { withCredentials: true })
}

export const logout = async () => {
  return axios.get(`${getAPIBase()}/auth/logout`)
}