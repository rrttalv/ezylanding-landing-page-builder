import { MobXProviderContext, observer } from 'mobx-react'
import React from 'react'

export const Assets = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { dashboard } } = getStore()

  return (
    <div className='dashboard_assets content'>

    </div>
  )

})