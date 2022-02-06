import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect } from 'react'
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
      app.handleItemDragMove(clientX - x, clientY - y)
      shouldCloseSidebar(e)
    }
  }

  const handleMouseUp = e => {
    if(app.activeDrag){
      app.insertComponent(e)
      app.setActiveDragItem(null)
    }
  }

  const handleItemDrop = e => {
    e.preventDefault()
  }

  useEffect(() => {
    window.addEventListener('drop', handleItemDrop)
    app.setActivePage()
    return function cleanup() {
      window.removeEventListener('drop', handleItemDrop)
    }
  }, [])

  return (
    <div
      onMouseMove={e => handleMouseMove(e)}
      onMouseUp={e => handleMouseUp(e)}
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
    </div>
  )

})