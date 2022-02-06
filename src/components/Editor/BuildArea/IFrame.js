import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import ReactDOMServer from 'react-dom/server'

export const IFrame = observer((props) => {

  const [frameHeight, setFrameHeight] = useState(0)

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app, sidebar } } = getStore()

  const getHeader = elem => {
    const { partitions, content, style } = elem
    return (
      <header
        style={style}
      >
        {
          partitions.map(partition => getCorrectElement(content[partition]))
        }
      </header>
    )
  }

  useEffect(() => {
    const activePage = app.getActivePage()
    if(activePage){
      const { headerHeight, bodyHeight, footerHeight } = activePage
      setFrameHeight(headerHeight + bodyHeight + footerHeight)
    }
  }, [app.pages])

  const getCorrectElement = (elem) => {
    console.log(elem)
    switch(elem.type){
      case 'header':
        return getHeader(elem)
      case 'section':
        return (
            <div className={elem.className} style={elem.style}>
              {
                elem.children ? elem.children.map(child => getCorrectElement(child)) : undefined
              }
            </div>
          )
      case 'link':
        return <a href={`#`} className={elem.className} style={elem.style}>{elem.content}</a>
      case 'button':
        return <button style={elem.style} className={elem.className}>{elem.content}</button>
      case 'img':
        return <img style={elem.style} className={elem.className} alt={elem.alt || ''} />
      case 'style':
        return <style type="text/css">{elem.content}</style>
      default:
        return <div />
    }
  }

  const parseElements = () => {
    const page = app.getActivePage()
    let pageStyle = ''
    Object.keys(page.style).forEach(key => {
      pageStyle += `${key}:${page.style[key]};`
    })
    const { components, header, footer } = page
    const container = (
      <div id="EMBED-CONTAINER">
        <div id="PAGE-STYLES">
          <style type='text/css'>{`body {${pageStyle} user-select: none;}`}</style>
        </div>
        <div id="PAGE-CONTAINER">
          {
            header.map(headerElem => {
              return getCorrectElement(headerElem)
            })
          }
        </div>
      </div>
    )
    const str = ReactDOMServer.renderToStaticMarkup(container)
    return 'data:text/html;charset=utf-8,' + encodeURIComponent(str)
  }

  return (
    <iframe style={{ width: '100%', zIndex: 0, height: frameHeight }} src={parseElements()} id="HTML-FRAME" />
  )

})