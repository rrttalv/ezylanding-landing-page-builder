import { MobXProviderContext, observer } from 'mobx-react'
import { ReactComponent as Profile } from '../../svg/profile.svg'
import { ReactComponent as Caret } from '../../svg/caret-down.svg'
import { ReactComponent as Card } from '../../svg/card.svg'
import React, { useState } from 'react'

export const ProfileSidebar = observer((props) => {

  const [items] = useState([
    {
      title: 'Your Profile',
      id: 'profile',
      icon: <Profile className='profile-sidebar-icon_profile' style={{ height: '25px', width: '25px' }} />
    },
    {
      title: 'Billing',
      id: 'billing',
      icon: <Card className='profile-sidebar-icon_card' style={{ height: '25px', width: '25px' }} />
    }
  ])

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { auth } } = getStore()

  const getRow = item => {
    const { id, title, icon } = item
    return (
      <button key={id} onClick={e => auth.changeActiveProfileView(id)} className='btn-none dashboard-sidebar_toggle'>
        <div className={`dashboard-sidebar_item ${id}${auth.activeProfileView === id ? ' active' : ''}`}>
          {icon}
          <span className='dashboard-sidebar_item-title'>
            {title}
          </span>
        </div>
      </button>
    )
  }

  return (
    <div className='dashboard-sidebar profile-sidebar'>
      <div className='dashboard-sidebar_content'>
        <div className='dashboard-sidebar_back'>
          <a href="/dashboard" className='btn-none back-btn'>
            <Caret style={{ transform: 'rotate(90deg)' }} />
            Back to dashboard
          </a>
        </div>
        <div className='dashboard-sidebar_main-row sidebar-row'>
          {
            items.map(item => getRow(item))
          }
        </div>
      </div>
    </div>
  )

})