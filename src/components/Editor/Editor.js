import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { BuildArea } from './BuildArea/BuildArea'
import { Sidebar } from './Sidebar/Sidebar'

export const Editor = observer((props) => {

  
  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app, sidebar } } = getStore()

  const handleItemDrop = (e) => {
    console.log('here')
    return
  }

  const handleDragMove = e => {
    const { clientX, clientY } = e
  }

  const handleMouseMove = e => {
    
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
      onDragEnd={e => handleItemDrop(e)}
      onDrag={e => handleDragMove(e)}
      onMouseMove={e => handleMouseMove(e)}
      className='container-fluid editor'
    >
      <div className='editor_area'>
        <Sidebar />
        <BuildArea /> 
      </div>
    </div>
  )

})