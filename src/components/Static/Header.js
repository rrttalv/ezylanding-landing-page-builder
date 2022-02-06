import { MobXProviderContext, observer } from 'mobx-react'
import React from 'react'

export const Header = observer(() => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { app } = getStore()

  return (
    <div className='header'>

    </div>
  )

})