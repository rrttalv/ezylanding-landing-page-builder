import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'

export const Element = observer((props) => {

  const { width, height, type, xPos, yPos } = props

  return (
    <div 
      className='floating-element'
      style={{
        position: 'absolute',
        transform: `translate(${xPos}px, ${yPos}px)`,
        width,
        height,
        background: `rgba(62, 227, 197, 0.25)`
      }}
    />
  )

})