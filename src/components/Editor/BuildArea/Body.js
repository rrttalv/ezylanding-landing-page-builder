import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'

export const Body = observer((props) => {
  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app, sidebar } } = getStore()
  const activePage = app.getActivePage()

  return (
    <div 
      onMouseMove={e => app.setActiveSection('body', e)}
      className='build-area_body'
      style={{
        top: props.top,
        height: props.height,
        width: '100%'
      }}
    >

    </div>
  )
})