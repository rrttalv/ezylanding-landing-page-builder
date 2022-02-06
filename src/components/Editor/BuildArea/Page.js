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
    if(iframe){
      setStyle({
        width: iframe.clientWidth + 'px',
        height: iframe.clientHeight + 'px'
      })
    }
    const activePage = app.getActivePage()
    if(activePage){
      const { headerHeight, bodyHeight, footerHeight } = activePage
      setSeparators({
        header: headerHeight,
        footer: headerHeight + bodyHeight
      })
    }
  }, [app.pages, iframe])

  const handlePointerDown = e => {
    console.log(e)
  }

  const { width } = style
  const activePage = app.getActivePage()
  const { headerHeight, bodyHeight, footerHeight } = activePage

  return (
    <div 
      onPointerDown={e => handlePointerDown(e)}
      className='build-area_page'
      style={style}
    >
      <Header height={headerHeight} top={0} />
      <Body height={bodyHeight} top={headerHeight} />
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