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
    if(activePage && activePage.body.length === 0){
      const { headerHeight, bodyHeight, footerHeight } = activePage
      setFrameHeight(headerHeight + bodyHeight + footerHeight)
    }
  }, [app.pages])

  const getCorrectElement = elem => {
    const { position: { xPos, yPos, width, height }, style: elemStyle } = elem
    const elemPositionStyle = {
      position: 'absolute',
      transform: `translate(${xPos}px, ${yPos}px)`,
      width,
      height
    }
    const style = {
      ...elemPositionStyle,
      ...elemStyle
    }
    switch(elem.type){
      case 'header':
        return getHeader(elem)
      case 'section':
        return (
            <div 
              className={elem.className} 
              style={elemStyle}
            >
              {
                elem.children ? elem.children.map(child => getCorrectElement(child)) : undefined
              }
            </div>
          )
      case 'link':
        return <a href={`#`} className={elem.className} style={style}>{elem.content}</a>
      case 'button':
        return <button style={style} className={elem.className}>{elem.content}</button>
      case 'input':
        return <input type={elem.inputType} className={elem.className} style={style} />
      case 'img':
        return <img style={style} className={elem.className} alt={elem.alt || ''} />
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
    const { 
      body, 
      header, 
      footer,
      headerHeight,
      bodyHeight,
      footerHeight
    } = page
    const container = (
      <body>
        <div id="EMBED-CONTAINER">
          <div id="PAGE-CONTAINER">
            <div id="PAGE-HEADER" className='PAGE-HEADER' style={{ width: '100%', height: page.header.length === 0 ? headerHeight + 'px' : 'fit-content' }}>
              {
                header.map(headerElem => {
                  return getCorrectElement(headerElem)
                })
              }
            </div>
            <div id="PAGE-BODY" className='PAGE-BODY' style={{ width: '100%', height: page.body.length === 0 ? bodyHeight + 'px' : 'fit-content' }}>
              {body.map(elem => getCorrectElement(elem))}
            </div>
          </div>
        </div>
      </body>
    )
    const head = (
      <head>
        <title>My Page</title>
        <style type="text/css">{`
          *, *::before, *::after {
            box-sizing: border-box;
          }
          html {
            margin: 0;
            padding: 0;
          }
          body {
            ${pageStyle}
            margin: 0;
            padding: 0;
            pointer-events: none;
            overflow: hidden;
          } 
          #PAGE-BODY, #PAGE-HEADER {
            position: relative;
          }
        `}</style>
      </head>
    )
    const bodyString = ReactDOMServer.renderToStaticMarkup(container)
    const headString = ReactDOMServer.renderToStaticMarkup(head)
    const str = `<?xml version="1.0" encoding="UTF-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml">\n` + headString + bodyString + '</html>'
    var blob = new Blob([str], { type: "application/xhtml+xml" });
    return URL.createObjectURL(blob);
  }

  return (
    <iframe style={{ width: '100%', zIndex: 0, height: frameHeight }} src={parseElements()} id="HTML-FRAME" />
  )

})