import { MobXProviderContext, observer } from 'mobx-react'
import React from 'react'
import { IFrame } from './IFrame'
import { Page } from './Page'

export const BuildArea = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app, sidebar } } = getStore()

  const activePage = app.getActivePage()

  return (
    <div className='build-area'>
      <div className='build-area_frame'>
        {
          activePage ? (
            <div className='build-area_preview'>
              <IFrame />
              <Page page={activePage} />
            </div>
          )
          :
          (
            <span>Loading...</span>
          )
        }
      </div>
    </div>
  )

})