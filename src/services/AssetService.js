import axios from 'axios'
import { getAPIBase } from '../utils'

export const uploadFile = async (file) => {
  const data = new FormData()
  data.append('file', file)
  return axios.post(`${getAPIBase()}/api/assets`, data)
}

export const fetchAssets = async (pageNo, keyword = null) => {
  let query = `?pageNo=${pageNo}`
  if(keyword){
    query += `&keyword=${keyword}`
  }
  const url = `${getAPIBase()}/api/assets${query}`
  return axios.get(url)
}