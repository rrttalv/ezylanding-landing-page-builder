import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import constants from '../../../../config/constants'
import { SlideMenu } from './SlideMenu'


export const Components = observer((props) => {

  const [expanded, setExpanded] = useState(false)
  const [expandedClass, setExpandedClass] = useState('hidden')
  const [sectionList, setSectionList] = useState([
    {
      id: 'sections',
      components: constants.sections,
      style: {
        marginRight: '10px'
      },
      active: true
    },
    {
      id: 'inputs',
      components: constants.inputs,
      active: false
    },
    {
      id: 'text',
      components: constants.text,
      active: false
    },
    {
      id: 'media',
      components: constants.media,
      active: false
    }
  ])

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { sidebar, app } } = getStore()

  useEffect(() => {
    const copy = [...sectionList]
    const activeItem = copy.find(({ id }) => id === sidebar.focusedComponent)
    if(activeItem){
      copy.forEach(item => {
        item.active = false
        if(item.id === sidebar.focusedComponent){
          item.active = true
        }
      })
    }
    setSectionList(copy)
  }, [sidebar.focusedComponent])

  const getExpanded = () => {
    return (
      <div className={`component-slide_single ${expandedClass}`}></div>
    )
  }

  const handleItemDragStart = (e, item) => {
    const { clientX, clientY } = e
    const { x, y } = document.querySelector('.editor').getBoundingClientRect()
    app.setActiveDragItem(item, clientX + x, clientY - y)
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

  const getRows = (elem, type, customStyle = {}) => {
    const list = [...elem.elements]
    return (
      <div className={`component-slide_wrapper`} key={elem.id}>
        <div className='component-slide_list'>
          <div className='component-slide_rows'>
            {
              list.map((item, idx) => {
                const listClass = item.title.toLowerCase().split(' ').join('-')
                const displayStyle = item.displayStyle ? item.displayStyle.wrapper : {...customStyle}
                const imgStyle = item.displayStyle && item.displayStyle.image ? item.displayStyle.image : {}
                if(item.type === 'section'){
                  imgStyle.boxShadow = '0px 1px 3px 2px rgba(0, 0, 0, 0.065)'
                  imgStyle.border = '1px solid rgba(62, 227, 197, 0.125)'
                }
                return (
                  <div 
                    key={item.type + idx}
                    className={`component-preview ${listClass}`}
                    draggable
                    style={{...displayStyle}}
                    onClick={e => insertItem(e, item)}
                    onDragStart={e => handleItemDragStart(e, item)}
                    onDragEnd={e => handleItemDragEnd()}
                  >
                    {item.thumb ? (
                      <img 
                        src={item.thumb} 
                        className="component-img" 
                        style={{...imgStyle}}
                      />
                      ) : (
                        <div className='empty-component'>
                          <span className='component-name'>
                            {`<`}{item.tagName} {`/>`}
                          </span>
                        </div>
                      )
                    }
                    <span className='component-title' style={{userSelect: 'none'}}>{item.title}</span>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }

  const handleMenuItemClick = id => {
    sidebar.setFocusedComponent(id)
  }

  const active = sectionList.find(({ active }) => active)

  return (
    <div 
      className={`component-slide slide-item ${active.id}`}
      onPointerUp={() => handleItemDragEnd()}
    >
      <SlideMenu
        className='component-slide_menu'
        onClick={handleMenuItemClick}
        menuItems={sectionList}
      />
      {
        getRows(active.components, active.id, active.style ? active.style : {})
      }
    </div>
  )
})