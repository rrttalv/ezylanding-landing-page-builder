import axios from 'axios'
import { getAPIBase } from '../utils'

export const uploadFile = async (file) => {
  const data = new FormData()
  data.append('file', file)
  return axios.post(`${getAPIBase()}/api/assets`, data)
}