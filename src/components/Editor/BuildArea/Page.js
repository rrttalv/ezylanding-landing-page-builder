import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'

export const Page = observer((props) => {

  const [style, setStyle] = useState({
    width: 0,
    height: 0
  })

  const {
    route,
    id,
    components,
    customCode
  } = props.page


  useEffect(() => {
    const iframe = document.querySelector('#HTML-FRAME')
    if(iframe){
      setStyle({
        width: iframe.clientWidth + 'px',
        height: iframe.clientHeight + 'px'
      })
    }
  }, [])

  const handlePointerDown = e => {
    console.log(e)
  }

  return (
    <div 
      onPointerDown={e => handlePointerDown(e)}
      className='build-area_page'
      style={style}
    >
    </div>
  )

})