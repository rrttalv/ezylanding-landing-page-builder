import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useRef, useState } from 'react'

export const RegularHeader = observer(() => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { auth } } = getStore()

  const handleLogout = async e => {
    e.preventDefault()
    //await auth.logout()
  }

  const getAuthItems = () => {
    const { email } = auth.userDetails
    return (
      <div className='header_auth_content'>
        <div className='header_auth_profile'>
          {email.slice(0, 1).toUpperCase()}
        </div>
        <div className='header_auth_btns'>
        </div>
      </div>
    )
  }

  return (
    <div className='header'>
      {
        auth.auth ? (
          <div className='header_auth left'>
            {getAuthItems()}
          </div>
        )
        :
        (
          <div className='header_unauth left'></div>
        )
      }
    </div>
  )

})