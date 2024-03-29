import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import { Body } from './Body'

export const Page = observer((props) => {

  const [separators, setSeparators] = useState({
    header: 0,
    footer: 0
  })

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app, sidebar } } = getStore()


  const {
    route,
    id,
    components,
    customCode
  } = props.page

  useEffect(() => {
    const activePage = app.getActivePage()
    if(activePage){
      setTimeout(() => {
        const { elementsHeight } = activePage
        setSeparators({
          header: 0,
          footer: elementsHeight
        })
      }, 10)
    }
  }, [app.pages.elements, app.sizeCalcChange, app.selectedElement])

  const activePage = app.getActivePage()
  const { elementsHeight } = activePage

  return (
    <div 
      className='build-area_page'
      style={{
        width: '100%'
      }}
    >
      <Body 
        height={elementsHeight} 
        heightPropName={'elementsHeight'} 
        area={'body'} 
        iframeSelector={'#PAGE-BODY'}
      />
    </div>
  )

})