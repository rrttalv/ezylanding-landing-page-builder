import { MobXProviderContext, observer } from 'mobx-react'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

export const IFrame = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app, sidebar } } = getStore()

  const getHeader = elem => {
    const { partitions, partitionStyles, partitionContent, style } = elem
    return (
      <header
        style={style}
      >
        {
          partitions.map(partition => {
            return (
              <div style={partitionStyles[partition]}>
                {
                  partitionContent[partition].map(element => {
                    //getCorrectElement(element)
                    return <a href="#">Some link</a>
                  })
                }
              </div>
            )
          })
        }
      </header>
    )
  }

  const getCorrectElement = (elem) => {
    switch(elem.type){
      case 'header':
        return getHeader(elem)
      case 'section':
        return <div />
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
          <style type='text/css'>{`body {${pageStyle}}`}</style>
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
    <iframe style={{ width: '100%', height: '100%' }} src={parseElements()} id="HTML-FRAME" />
  )

})