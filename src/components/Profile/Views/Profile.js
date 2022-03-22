import { MobXProviderContext, observer } from 'mobx-react'
import React from 'react'

export const Profile = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { auth } } = getStore()

  return (
    <div className='profile_details'>

    </div>
  )

})