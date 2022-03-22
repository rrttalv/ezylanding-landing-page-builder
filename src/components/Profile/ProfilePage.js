import { MobXProviderContext, observer } from 'mobx-react'
import React from 'react'
import { ProfileSidebar } from './ProfileMenu'

export const ProfilePage = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { auth } } = getStore()

  const getView = () => {
    const { activeProfileView } = auth
    switch(activeProfileView){
      case 'profile':
        return <div />
      case 'billing':
        return <div />
      default:
        return <div />
    }
  }

  return (
    <div className='container-fluid d-flex profile'>
      <ProfileSidebar />
    </div>
  )

})