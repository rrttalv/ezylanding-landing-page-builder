import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import parse from 'html-react-parser'

export const IFrame = observer((props) => {

  const [fh, setFh] = useState(0)
  const [blobUrl, setBlobUrl] = useState(null)

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }


  const getHeader = elem => {
    const { partitions, content, style } = elem
    return (
      <header
        data-uuid={elem.id}
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
    parseElements()
  }, [app.elementLen, app.activeFramework, app.cssSaved])

  const getTextElement = (elem, style) => {
    const { className, content, tagName, id } = elem
    if(app.activeTextEditor === elem.id){
      style.opacity = 0
    }
    switch(tagName){
      case 'h1':
        return <h1 data-uuid={id} key={id} className={className} style={style}>{content}</h1>
      case 'h2':
        return <h2 data-uuid={id} key={id} className={className} style={style}>{content}</h2>
      case 'h3':
        return <h3 data-uuid={id} key={id}className={className} style={style}>{content}</h3>
      case 'h4':
        return <h4 data-uuid={id} key={id}className={className} style={style}>{content}</h4>
      case 'h5':
        return <h5 data-uuid={id} key={id}className={className} style={style}>{content}</h5>
      case 'h6':
        return <h6 data-uuid={id} key={id}className={className} style={style}>{content}</h6>
      case 'label':
        return <label data-uuid={id} key={id} className={className} style={style}>{content}</label>
      case 'span':
        return <span data-uuid={id} key={id} className={className} style={style}>{content}</span>
      default:
        return <p data-uuid={id} key={id} className={className} style={style}>{content}</p>
    }
  }

  const getSVG = (element) => {
    const parser = new DOMParser().parseFromString(element.content, 'image/svg+xml')
    const svg = parser.firstElementChild
    Object.keys(element.style).forEach(key => {
      svg.style[key] = element.style[key]
    })
    if(element.className){
      svg.setAttribute('className', element.className)
    }
    if(element.domID){
      svg.setAttribute('id', element.domID)
    }
    svg.setAttribute('data-uuid', element.id)
    svg.setAttribute('key', element.id)
    svg.setAttribute('xmlns', "http://www.w3.org/2000/svg")
    svg.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink")
    const div = document.createElement('div')
    div.appendChild(parser.firstElementChild)
    return parse(div.innerHTML)
  }

  const getCorrectElement = (elem, isSectionChild) => {
    const { position, style: elemStyle } = elem
    let elemPositionStyle = {}
    const wl = ['section', 'header']
    const style = {
      ...elemStyle
    }
    const divWl = [...wl, 'div']
    switch(elem.type){
      case 'header':
        return getHeader(elem)
      case 'section':
        return (
            <section 
              key={elem.id}
              data-uuid={elem.id}
              className={elem.className} 
              style={elemStyle}
            >
              {
                elem.children ? elem.children.map(child => getCorrectElement(child, true)) : undefined
              }
            </section>
          )
      case 'div':
        return (
          <div 
            className={elem.className} 
            style={elem.style}
            data-uuid={elem.id}
            key={elem.id}
          >
            {
              elem.children && elem.children.length ? elem.children.map(child => getCorrectElement(child)) : undefined
            }
          </div>
        )
      case 'link':
        return <a key={elem.id} data-uuid={elem.id} href={elem.href} className={elem.className} style={style}>{elem.content}</a>
      case 'list':
        return (
          <ul key={elem.id} data-uuid={elem.id} className={elem.className} style={style}>
            {elem.children.map(child => getCorrectElement(child))}
          </ul>
        )
      case 'listItem':
        return (
          <li key={elem.id} data-uuid={elem.id} className={elem.className} style={style}>
            {elem.children && elem.children.length ? elem.children.map(child => getCorrectElement(child)) : undefined}
          </li>
        )
      case 'text':
        return getTextElement(elem, style)
      case 'button':
        const styleCopy = {...style}
        if(app.activeTextEditor === elem.id){
          styleCopy.opacity = '0.25'
        }
        return <button key={elem.id} data-uuid={elem.id} style={styleCopy} className={elem.className || elem.tagName}>{elem.content}</button>
      case 'input':
        return <input key={elem.id} placeholder={elem.placeholder} data-uuid={elem.id} type={elem.inputType} className={elem.className} style={style} />
      case 'textarea':
        return <textarea key={elem.id} placeholder={elem.placeholder} data-uuid={elem.id} className={elem.className} style={style}></textarea>
      case 'img':
        return <img key={elem.id} data-uuid={elem.id} style={style} src={elem.src} className={elem.className} alt={elem.alt || ''} />
      case 'svg':
        return getSVG(elem)
      case 'style':
        return <style key={elem.id} data-uuid={elem.id} type="text/css">{elem.content}</style>
      default:
        return <div key={elem.id} data-uuid={elem.id} />
    }
  }

  useEffect(() => {
    if(!blobUrl){
      parseElements()
    }
  }, [])

  
  const handleIframeLoad = () => {
    app.handleWindowResize()
  }

  const parseElements = () => {
    const page = app.getActivePage()
    let pageStyle = ''
    Object.keys(page.style).forEach(key => {
      pageStyle += `${key}:${page.style[key]};`
    })
    const { 
      elements,
      elementsHeight
    } = page
    const container = (
      <body>
        <div id="root">
          <div id="PAGE-BODY" className='PAGE-BODY' style={{ width: '100%', height: '100%' }}>
            {elements.map(elem => getCorrectElement(elem))}
          </div>
        </div>
      </body>
    )
    const head = (
      <head>
        <meta charSet="utf-8"></meta>
        <title>My Page</title>
        {
          app.activeFramework ? (
            app.activeFramework.scripts.map((tag, idx) => {
              const origin = window.location.origin
              if(tag.type === 'style'){
                return <style type='text/css'>{app.activeFramework.rawCSS}</style>
              }
              if(tag.type === 'script'){
                return <script key={idx} src={`${origin}${tag.path}`}></script>
              }
            })
          )
          :
          ''
        }
        {
          app.cssTabs.map(tab => {
            const { id, content, name, paletteContent } = tab
            if(name === 'main.css'){
              return <React.Fragment key={id}>
                <style type="text/css" key={id} data-uuid={id}>{content}</style>
                <style type="text/css" id="PALETTES">
                  {paletteContent}
                </style>
              </React.Fragment>
            }
            return <style type="text/css" key={id} data-uuid={id}>{content}</style>
          })
        }
        <style data-uuid={"editor-temp-style"} type="text/css">{`
          html {
            margin: 0;
            padding: 0;
            width: 100%;
          }
          body {
            margin: 0;
            padding: 0;
            width: 100%;
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
    if(blobUrl){
      URL.revokeObjectURL(blobUrl)
    }
    const url = URL.createObjectURL(blob)
    setBlobUrl(url)
  }

  useEffect(() => {
    setFh(app.pages[0].elementsHeight)
  }, [app.sizeCalcChange])

  return (
    blobUrl ? (
      <iframe 
        onLoad={e => handleIframeLoad()}
        style={{ width: '100%', zIndex: 0, pointerEvents: 'none', height: fh, zIndex: -2 }} 
        frameBorder="0" 
        scrolling="auto"
        src={blobUrl}
        id="HTML-FRAME" 
      />
    )
    :
    <div />
  )

})