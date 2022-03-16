import axios from 'axios'
import { getAPIBase } from '../utils'

export const fetchTemplate = async id => {
  return axios.get(`${getAPIBase()}/api/template?templateId=${id}`, { withCredentials: true })
}

export const fetchTemplateList = async () => {
  return axios.get(`${getAPIBase()}/api/templates`, { withCredentials: true })
}