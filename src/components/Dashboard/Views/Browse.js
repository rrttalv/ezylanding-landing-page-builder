import { MobXProviderContext, observer } from 'mobx-react'
import React from 'react'

export const Browse = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { dashboard } } = getStore()

  return (
    <div className='dashboard_browse content'>

    </div>
  )

})