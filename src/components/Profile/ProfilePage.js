import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { billingErrorTypes } from '../../config/errorTypes'
import { Spinner } from '../Static/Spinner'
import { ProfileSidebar } from './ProfileMenu'
import { Billing } from './Views/Billing'
import { Profile } from './Views/Profile'

export const ProfilePage = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { auth, alerts } } = getStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const billingSection = params.get('billing')
    if(billingSection){
      auth.changeActiveProfileView('billing')
    }
    const type = params.get('billingError')
    if(type && !alerts.toast){
      alerts.createToast(billingErrorTypes[type], 'error', 10000)
    }
  }, [auth.auth])

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
      {
        auth.authLoading ? (
          <div className='loading-wrapper'>
            <Spinner center={true} scale={0.8} />
          </div>
        )
        :
        (
          getView()
        )
      }
    </div>
  )

})