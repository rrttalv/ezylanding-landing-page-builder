import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import { ComponentBorder } from './ComponentBorder'
import { PartitionBorder } from './PartitionBorder'

export const Body = observer((props) => {
  
  const [bodyHeight, setBodyHeight] = useState(0)

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app, sidebar } } = getStore()
  const activePage = app.getActivePage()

  const selectComponent = (e, id) => {
    e.preventDefault()
    app.setSelectedElement(id, props.area)
  }

  useEffect(() => {
    setTimeout(() => {
      const frame = document.querySelector("iframe").contentWindow.document.querySelector(props.iframeSelector)
      if(frame){
        const { width, height } = frame.getBoundingClientRect()
        if(activePage[props.heightPropName] !== height){
          app.updateActivePageProp(props.heightPropName, height)
        }
      }
    }, 10)
  }, [app.pages, app.selectedElement])

  const { dragIndex, dragSection, activeDrag, } = app

  return (
    <div 
      onMouseMove={e => app.setActiveSection(props.area, e)}
      className={`build-area_${props.area}`}
      style={{
        top: props.top,
        height: props.height,
        width: '100%'
      }}
    >
      {
        activePage[props.area].map((elem, idx) => {
          const { style, children, id } = elem
          const isSelected = app.selectedElement === id
          return (
            <>
              {
                idx === dragIndex && activeDrag && dragSection === props.area ? (
                  <div className='build-area_insert-preview insert-above' />
                )
                :
                undefined
              }
              <div 
                onClick={e => selectComponent(e, id)}
                data-uuid={elem.id}
                className={`section-component ${isSelected ? ' active-component' : ''}`}
                style={{
                  ...style,
                  zIndex: 0
                }}
              >
                {
                  isSelected ? <ComponentBorder style={style} /> : undefined
                }
                {
                  (app.activeDrag && id === app.childDragParentId && app.childDragSection === props.area) || isSelected ? (<PartitionBorder {...elem} />) : undefined
                }
              </div>
              {
                activePage[props.area].length - 1 === idx && idx + 1 === dragIndex && activeDrag && dragSection === props.area ? (
                  <div className='build-area_insert-preview insert-below' />
                )
                :
                undefined
              }
            </>
          )
        })
      }
    </div>
  )
})