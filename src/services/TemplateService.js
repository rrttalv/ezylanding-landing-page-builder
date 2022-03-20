import axios from 'axios'
import { getAPIBase } from '../utils'

export const fetchTemplate = async id => {
  return axios.get(`${getAPIBase()}/api/template?templateId=${id}`, { withCredentials: true })
}

export const fetchTemplateList = async pageNo => {
  return axios.get(`${getAPIBase()}/api/templates?pageNo=${pageNo}`, { withCredentials: true })
}

export const saveThumbnail = async (body, templateId) => {
  return axios.post(`${getAPIBase()}/api/template/thumbnail?templateId=${templateId}`, body, { withCredentials: true })
}