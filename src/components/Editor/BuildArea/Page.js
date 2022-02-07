import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import { Body } from './Body'
import { Header } from './Header'

export const Page = observer((props) => {

  const [style, setStyle] = useState({
    width: 0,
    height: 0
  })

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

  const iframe = document.querySelector('#HTML-FRAME')

  useEffect(() => {
    const activePage = app.getActivePage()
    if(iframe && activePage && activePage.body.length === 0){
      console.log('here')
      setStyle({
        width: iframe.clientWidth + 'px',
        height: iframe.clientHeight + 'px'
      })
    }
  }, [iframe])

  useEffect(() => {
    const activePage = app.getActivePage()
    if(activePage){
      setTimeout(() => {
        const { headerHeight, bodyHeight, footerHeight } = activePage
        setSeparators({
          header: headerHeight,
          footer: headerHeight + bodyHeight
        })
      }, 10)
    }
  }, [app.pages, app.selectedElement, iframe])

  const { width } = style
  const activePage = app.getActivePage()
  const { headerHeight, bodyHeight, footerHeight } = activePage

  return (
    <div 
      className='build-area_page'
      style={style}
    >
      <Body 
        height={headerHeight} 
        heightPropName={'headerHeight'} 
        area={'header'} 
        top={0} 
        iframeSelector={'#PAGE-HEADER'}
      />
      <Body 
        height={bodyHeight} 
        heightPropName={'bodyHeight'} 
        top={headerHeight} 
        area={'body'} 
        iframeSelector={'#PAGE-BODY'}
      />
      <div 
        className='build-area_page_separator' 
        style={{
          width,
          top: separators.header
        }}
      />
      <div 
        className='build-area_page_separator'
        style={{
          width,
          top: separators.footer
        }}
       />
    </div>
  )

})