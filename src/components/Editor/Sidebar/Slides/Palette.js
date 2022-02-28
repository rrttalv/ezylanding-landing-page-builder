import { MobXProviderContext, observer } from 'mobx-react'
import React, { useState } from 'react'
import constants from '../../../../config/constants'


export const Palette = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { sidebar, app } } = getStore()


  return (
    <div className='palette-slide'>
      <div className='palette-slide_wrapper'>
        
      </div>
    </div>
  )

})