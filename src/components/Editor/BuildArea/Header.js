import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'

export const Header = observer((props) => {
  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app, sidebar } } = getStore()
  const activePage = app.getActivePage()

  const getHeaderComponents = () => {
    
  }

  return (
    <div className='build-area_header'>

    </div>
  )
})