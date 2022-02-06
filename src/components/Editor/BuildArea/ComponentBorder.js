import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'

export const ComponentBorder = observer((props) => {

  const [borderStyle, setBorderStyle] = useState({ display: 'none' })

  useEffect(() => {

    const copy = {...props.style}
    delete copy.padding
    copy.width = "100%"
    setBorderStyle(copy)

  }, [props.style])

  return (
    <div className='comp-border' style={borderStyle} />
  )

})