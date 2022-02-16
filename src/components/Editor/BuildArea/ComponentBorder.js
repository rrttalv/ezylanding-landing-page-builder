import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'

export const ComponentBorder = observer((props) => {

  const [borderStyle, setBorderStyle] = useState({ opacity: '0' })

  useEffect(() => {
    const copy = {...props.style}
    if(props.position){
      const { width, height, xPos, yPos } = props.position
      copy.width = width + 'px'
      copy.height = height + 'px'
      copy.transform = `translate(${xPos}px, ${yPos}px)`
    }
    delete copy.padding
    copy.width = "100%"
    setBorderStyle(copy)
    
  }, [props.style, props.display])

  return (
    <div className={`comp-border${props.display ? ' visible' : ''}`} style={borderStyle}>
      {props.children}
    </div>
  )

})