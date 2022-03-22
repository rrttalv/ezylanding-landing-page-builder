import { MobXProviderContext, observer } from 'mobx-react'
import React from 'react'
import { ProfileSidebar } from './ProfileMenu'
import { Billing } from './Views/Billing'
import { Profile } from './Views/Profile'

export const ProfilePage = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { auth } } = getStore()

  const getView = () => {
    const { activeProfileView } = auth
    switch(activeProfileView){
      case 'profile':
        return <Profile />
      case 'billing':
        return <Billing />
      default:
        return <div />
    }
  }

  return (
    <div className='container-fluid d-flex profile'>
      <ProfileSidebar />
      {getView()}
    </div>
  )

})