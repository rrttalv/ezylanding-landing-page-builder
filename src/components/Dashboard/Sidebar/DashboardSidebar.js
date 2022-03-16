import { MobXProviderContext, observer } from 'mobx-react'
import { ReactComponent as Folder } from '../../../svg/folder.svg'
import { ReactComponent as Squares } from '../../../svg/squares.svg'
import { ReactComponent as Roller } from '../../../svg/roller.svg'

import React, { useState } from 'react'

export const DashboardSidebar = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { dashboard } } = getStore()

  const [items, setItems] = useState([
    {
      title: 'Your Templates',
      id: 'templates',
      icon: <Squares style={{ height: '25px', width: '25px' }} />
    },
    {
      title: 'Assets',
      id: 'assets',
      icon: <Folder style={{ height: '24px', width: '24px' }} />
    },
    {
      title: 'Browse Templates',
      id: 'browse',
      icon: <Roller />
    },
  ])

  const getRow = item => {
    const { id, title, icon } = item
    return (
      <button onClick={e => dashboard.changeActiveView(id)} className='btn-none dashboard-sidebar_toggle'>
        <div key={id} className={`dashboard-sidebar_item ${id}${dashboard.activeView === id ? ' active' : ''}`}>
          {icon}
          <span className='dashboard-sidebar_item-title'>
            {title}
          </span>
        </div>
      </button>
    )
  }

  return (
    <div className='dashboard-sidebar'>
      <div className='dashboard-sidebar_content'>
        <div className='dashboard-sidebar_main-row sidebar-row'>
          {
            items.map(item => getRow(item))
          }
        </div>
      </div>
    </div>
  )

})