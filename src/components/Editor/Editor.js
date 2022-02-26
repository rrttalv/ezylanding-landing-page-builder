import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { BottomToolbar } from './BuildArea/BottomToolbar'
import { BuildArea } from './BuildArea/BuildArea'
import { Element } from './BuildArea/Element'
import { Sidebar } from './Sidebar/Sidebar'

export const Editor = observer((props) => {

  
  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app, sidebar } } = getStore()

  
  const shouldCloseSidebar = e => {
    if(app.activeDrag){
      const { x, width } = document.querySelector('.slide-wrapper').getBoundingClientRect()
      if(e.clientX > (x + width - 50)){
        sidebar.unsetActiveItem()
      }
    }
  }

  const handleMouseMove = e => {
    const { clientX, clientY } = e
    const { x, y } = document.querySelector('.editor').getBoundingClientRect()
    if(app.activeDrag){
      app.handleItemDragMove(clientX - x, clientY - y, clientX, clientY)
      shouldCloseSidebar(e)
    }
    if(app.movingCSSTab){
      app.moveCSSTab(clientX, clientY)
    }
  }

  const handleMouseUp = e => {
    if(app.activeTextEditor){
      return
    }
    if(app.movingCSSTab){
      app.setMovingCSSTab(status, 0, 0)
    }
    if(app.activeDrag){
      app.insertComponent(e)
      app.setActiveDragItem(null)
    }
  }
  
  const resizeHandler = e => {
    app.handleWindowResize()
  }

  useEffect(() => {
    app.setActivePage()
    app.setIframeHeight()
    window.addEventListener('resize', resizeHandler.bind(this))
    app.setActiveFramework('bootstrap')
    return function cleanup() {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return (
    <div
      onPointerMove={e => handleMouseMove(e)}
      onPointerUp={e => handleMouseUp(e)}
      className='container-fluid editor'
    >
      <div className='editor_area'>
        <Sidebar />
        <BuildArea />
        {
          app.activeDrag ? 
          (
            <Element item={app.activeDrag} />
          )
          :
          undefined
        }
      </div>
      <BottomToolbar />
    </div>
  )

})