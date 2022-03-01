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

export const textStyleKeys = [
  'text-align',
  'background',
  'padding',
  'margin',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
  'margin-left',
  'margin-right',
  'margin-top',
  'margin-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'padding-bottom',
  'background-image',
  'background-color',
  'background-size',
  'background-position',
  'text-indent',
  'font',
  'font-family',
  'width',
  'letter-spacing',
  'line-height',
  'min-width',
  'max-width',
  'max-height',
  'min-height',
  'stroke',
  'stroke-color',
  'stroke-width',
  'text-shadow',
  'text-size-adjust',
  'color',
  'accent-color',
  'text-decoration',
  'font-size',
  'font-weight'
]