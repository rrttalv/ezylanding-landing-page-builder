import { MobXProviderContext, observer } from 'mobx-react'
import React, { useState } from 'react'
import constants from '../../../../config/constants'


export const Components = observer((props) => {

  const [expanded, setExpanded] = useState(false)
  const [expandedClass, setExpandedClass] = useState('hidden')

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { sidebar, app } } = getStore()

  const { sections } = constants

  const getExpanded = () => {
    return (
      <div className={`component-slide_single ${expandedClass}`}></div>
    )
  }

  const handleItemMouseDown = (e, item) => {
    const { clientX, clientY } = e
    app.setMouseDown(clientX, clientY, 'sidebarComponentDrag')
    app.setActiveDragItem(item, clientX, clientY)
    console.log(item)
    return
  }

  const handleItemMouseUp = () => {
    app.setMouseUp()
    app.setActiveDragItem(null)
  }

  const getRows = (elem) => {
    const copy = [...elem.elements]
    const list = copy.slice(0, 2)
    return (
      <div className='component-slide_list'>
        <h6 className='component-slide_title'>{elem.title}</h6>
        <div className='component-slide_rows'>
          {
            list.map(item => (
              <div 
                className='component-preview'
                draggable
                onPointerDown={e => handleItemMouseDown(e, item)}
              >
                <img src={item.thumb} className="component-img" />
                <span className='component-title' style={{userSelect: 'none'}}>{item.title}</span>
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  return (
    <div 
      className='component-slide'
      onPointerUp={() => handleItemMouseUp()}
    >
      {
        getExpanded()
      }
      {
        getRows(sections)
      }
    </div>
  )
})