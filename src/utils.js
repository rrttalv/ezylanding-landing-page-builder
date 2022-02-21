import React from "react"

export const camelToDash = str => str
  .replace(/(^[A-Z])/, ([first]) => first.toLowerCase())
  .replace(/([A-Z])/g, ([letter]) => `-${letter.toLowerCase()}`)

//Dash to camelcase - https://lodash.com/docs#camelCase

export const getFlexKeys = () => {
  return [
    'flexDirection',
    'flexWrap',
    'flexFlow',
    'justifyContent',
    'alignItems',
    'alignContent',
    'alignSelf',
    'flex',
    'flexBasis',
    'flexGrow',
    'flexShrink',
    'order'
  ]
}