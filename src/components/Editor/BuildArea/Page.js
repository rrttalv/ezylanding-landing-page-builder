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
    if(iframe && activePage && activePage.elements.length === 0){
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
        const { elementsHeight } = activePage
        console.log(elementsHeight)
        setSeparators({
          header: 0,
          footer: elementsHeight
        })
      }, 10)
    }
  }, [app.pages.elements, app.sizeCalcChange, app.selectedElement, iframe])

  const { width } = style
  const activePage = app.getActivePage()
  const { elementsHeight } = activePage

  return (
    <div 
      className='build-area_page'
      style={style}
    >
      <Body 
        height={elementsHeight} 
        heightPropName={'elementsHeight'} 
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