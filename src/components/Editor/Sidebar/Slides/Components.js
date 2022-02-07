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

  const { sections, inputs } = constants

  const getExpanded = () => {
    return (
      <div className={`component-slide_single ${expandedClass}`}></div>
    )
  }

  const handleItemDragStart = (e, item) => {
    const { clientX, clientY } = e
    const { x, y } = document.querySelector('.editor').getBoundingClientRect()
    app.setActiveDragItem(item, clientX + x, clientY - y, 'sidebarComponentDrag')
    e.preventDefault()
    return
  }

  const handleItemDragEnd = () => {
    if(app.activeDrag){
      app.setMouseUp()
      app.setActiveDragItem(null)
    }
  }

  const insertItem = (e, item) => {
    e.preventDefault()
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
                onClick={e => insertItem(e, item)}
                onDragStart={e => handleItemDragStart(e, item)}
                onDragEnd={e => handleItemDragEnd()}
              >
                {item.thumb ? <img src={item.thumb} className="component-img" /> : <div style={{ width: '50px', height: '50px', background: 'red' }} />}
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
      onPointerUp={() => handleItemDragEnd()}
    >
      {
        getExpanded()
      }
      {
        getRows(sections)
      }
      {
        getRows(inputs)
      }
    </div>
  )
})