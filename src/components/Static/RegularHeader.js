import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useRef, useState } from 'react'

export const RegularHeader = observer(() => {

  const [menuOpen, setMenuOpen] = useState(false)

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { auth } } = getStore()

  const handleLogout = async e => {
    e.preventDefault()
    await auth.logout()
  }

  const getAuthItems = () => {
    const { email } = auth.userDetails
    return (
      <div className='header_auth-content'>
        <button onClick={e => setMenuOpen(!menuOpen)} className='btn-none'>
          <div className='header_auth-profile'>
           {email.slice(0, 1).toUpperCase()}
          </div>
          {
            menuOpen ? (
              <div className='header_auth-btns'>
                <button className='btn-none'>
                  <a href='/profile' className='btn-link'>
                    Profile
                  </a>
                </button>
                <button onClick={e => handleLogout(e)} className='btn-none'>
                  Log out
                </button>
              </div>
            )
            :
            undefined
          }
        </button>
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