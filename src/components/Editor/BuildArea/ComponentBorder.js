import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'

export const ComponentBorder = observer((props) => {

  const [borderStyle, setBorderStyle] = useState({ opacity: '0' })

  useEffect(() => {
    const copy = {...props.style}
    delete copy.padding
    copy.width = "100%"
    setBorderStyle(copy)
    if(!props.display){
      setBorderStyle({ ...copy, opacity: '0' })
    }
  }, [props.style, props.display])

  return (
    <div className='comp-border' style={borderStyle}>
      {props.children}
    </div>
  )

})