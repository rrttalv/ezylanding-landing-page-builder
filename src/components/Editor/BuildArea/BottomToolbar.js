import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import { ComponentBorder } from './ComponentBorder'
import { ReactComponent as CSSIcon } from '../../../svg/css2.svg'
import { ReactComponent as ColumnIcon } from '../../../svg/column.svg'

export const BottomToolbar = observer((props) => {
  

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app, sidebar } } = getStore()

  return (
    <div className='layer-toolbar'>

    </div>
  )

})