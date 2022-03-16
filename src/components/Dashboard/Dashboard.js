import { MobXProviderContext, observer } from 'mobx-react'
import React from 'react'
import { DashboardSidebar } from './Sidebar/DashboardSidebar'
import { Assets } from './Views/Assets'
import { Browse } from './Views/Browse'
import { Templates } from './Views/Templates'

export const Dashboard = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { dashboard } } = getStore()

  const getView = () => {
    const { activeView } = dashboard
    switch(activeView){
      case 'templates':
        return <Templates />
      case 'assets':
        return <Assets />
      case 'browse':
        return <Browse />
      default:
        return <div />
    }
  }

  return (
    <div className='container-fluid dashboard d-flex'>
      <DashboardSidebar />
      {getView()}
    </div>
  )

})