import axios from "axios"
import { getAPIBase } from "../utils"

export const handleRegularAuth = async (email, password, isLogin = true) => {
  const body = { email, password }
  return axios.post(`${getAPIBase()}/auth/${isLogin ? 'login' : 'register'}`, body)
}