import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import ReactDOMServer from 'react-dom/server'

export const IFrame = observer((props) => {

  const [frameHeight, setFrameHeight] = useState(0)
  const [blobUrl, setBlobUrl] = useState(null)

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

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

  const { store: { app, sidebar } } = getStore()

  useEffect(() => {
    const activePage = app.getActivePage()
    if(activePage && activePage.body.length === 0){
      const { headerHeight, bodyHeight, footerHeight } = activePage
      setFrameHeight(headerHeight + bodyHeight + footerHeight)
    }
  }, [app.pages, app.movingElement, app.activeDrag, app.activeFramework])

  useEffect(() => {
    parseElements()
  }, [app.movingElement, app.pages, app.selectedElement, app.activeFramework, app.activeFonts, app.activeTextEditor])

  const getTextElement = (elem, style) => {
    const { className, content, tagName } = elem
    if(app.activeTextEditor === elem.id){
      style.opacity = 0
    }
    switch(tagName){
      case 'h1':
        return <h1 className={className} style={style}>{content}</h1>
      case 'h2':
        return <h2 className={className} style={style}>{content}</h2>
      case 'h3':
        return <h3 className={className} style={style}>{content}</h3>
      case 'h4':
        return <h4 className={className} style={style}>{content}</h4>
      case 'h5':
        return <h5 className={className} style={style}>{content}</h5>
      case 'h6':
        return <h6 className={className} style={style}>{content}</h6>
      default:
        return <p className={className} style={style}>{content}</p>
    }
  }

  const getCorrectElement = (elem, isSectionChild) => {
    const { position, style: elemStyle } = elem
    let elemPositionStyle = {}
    if(elem.position){
      const { xPos, yPos, width, height } = elem.position
      elemPositionStyle = {
        position: 'absolute',
        transform: `translate(${xPos}px, ${yPos}px)`,
        width,
        height
      }
    }
    const wl = ['section', 'header']
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
                elem.children ? elem.children.map(child => getCorrectElement(child, true)) : undefined
              }
            </div>
          )
      case 'div':
        return (
          <div className={elem.className} style={elem.style}>
            {
              elem.children && elem.children.length ? elem.children.map(child => getCorrectElement(child)) : undefined
            }
          </div>
        )
      case 'link':
        return <a href={`#`} className={elem.className} style={style}>{elem.content}</a>
      case 'text':
        return getTextElement(elem, style)
      case 'button':
        const styleCopy = {...style}
        if(app.activeTextEditor === elem.id){
          styleCopy.opacity = '0.25'
        }
        return <button style={styleCopy} className={elem.className}>{elem.content}</button>
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

  useEffect(() => {
    if(!blobUrl){
      parseElements()
    }
  }, [])

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
            font-family: ${app.activeFonts.map(meta => {
              return JSON.stringify(meta.name)
            }).join(' ')};
            margin: 0;
            padding: 0;
            pointer-events: none;
            overflow: hidden;
          } 
          #PAGE-BODY, #PAGE-HEADER {
            position: relative;
          }
        `}</style>
        {
          app.activeFramework ? (
            app.activeFramework.scripts.map((tag, idx) => {
              const origin = window.location.origin
              if(tag.type === 'style'){
                return <link key={idx} rel="stylesheet" href={`${origin}${tag.path}`} />
              }
              if(tag.type === 'script'){
                return <script key={idx} src={`${origin}${tag.path}`}></script>
              }
            })
          )
          :
          ''
        }
      </head>
    )
    const bodyString = ReactDOMServer.renderToStaticMarkup(container)
    const headString = ReactDOMServer.renderToStaticMarkup(head)
    const str = `<?xml version="1.0" encoding="UTF-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml">\n` + headString + bodyString + '</html>'
    var blob = new Blob([str], { type: "application/xhtml+xml" });
    if(blobUrl){
      URL.revokeObjectURL(blobUrl)
    }
    const url = URL.createObjectURL(blob)
    setBlobUrl(url)
  }

  return (
    blobUrl ? (
      <iframe 
        style={{ width: '100%', zIndex: 0, pointerEvents: 'none', height: frameHeight, zIndex: -2 }} 
        src={blobUrl}
        id="HTML-FRAME" 
      />
    )
    :
    <div />
  )

})