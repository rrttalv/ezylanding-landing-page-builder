import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import { ComponentBorder } from './ComponentBorder'

export const Body = observer((props) => {
  
  const [bodyHeight, setBodyHeight] = useState(0)

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app, sidebar } } = getStore()
  const activePage = app.getActivePage()

  const selectComponent = (e, id) => {
    e.preventDefault()
    app.setSelectedElement(id, 'body')
  }

  useEffect(() => {
    setTimeout(() => {
      const frame = document.querySelector("iframe").contentWindow.document.querySelector("#PAGE-BODY")
      if(frame){
        const { width, height } = frame.getBoundingClientRect()
        if(activePage.bodyHeight !== height){
          app.updateActivePageProp('bodyHeight', height)
        }
      }
    }, 10)
  }, [app.pages, app.selectedElement])

  return (
    <div 
      onMouseMove={e => app.setActiveSection('body', e)}
      className='build-area_body'
      style={{
        top: props.top,
        height: props.height,
        width: '100%'
      }}
    >
      {
        activePage.body.map(elem => {
          const { style, children, id } = elem
          return (
            <>
              <div 
                onClick={e => selectComponent(e, id)}
                className={`body-component${app.selectedElement === id ? ' active-component' : ''}`}
                style={{
                  ...style,
                  zIndex: 0
                }}
              >
                {
                  app.selectedElement === id ? <ComponentBorder style={style} /> : undefined
                }
              </div>
            </>
          )
        })
      }
    </div>
  )
})