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
    if(e.detail === 2){
      return
    }
    e.stopPropagation()
    app.setSelectedElement(id, props.area)
  }

  const handleDoubleClick = (e, elem) => {
    e.stopPropagation()
    if(elem.type === 'text'){
      //show elem text editor
    }
  }

  useEffect(() => {
      const f = document.querySelector('iframe')
      if(f){
        setTimeout(() => {
          const frame = document.querySelector("iframe").contentWindow.document.querySelector(props.iframeSelector)
            if(frame){
              const { width, height } = frame.getBoundingClientRect()
              if(activePage[props.heightPropName] !== height){
                app.updateActivePageProp(props.heightPropName, height)
              }
            }
        }, 10)
      }
  }, [app.pages.body, app.pages.header, app.pages.footer, app.pages, app.selectedElement, app.movingElement, app.activeDrag, app.activeFramework])

  const handlePointerEvent = (e, status, id) => {
    if(!app.selectedElement !== id){
      app.setSelectedElement(id, props.area)
    }
    const x = status ? e.clientX : 0
    const y = status ? e.clientY : 0
    app.setMovingElement(status, x, y)
  }

  const getChildElemBorder = (elem, idx) => {
    const { position, style: elemStyle, id } = elem
    let elemPositionStyle = {}
    if(elem.position){
      const { xPos, yPos, width, height } = elem.position
      elemPositionStyle = {
        position: 'absolute',
        transform: `translate(${xPos}px, ${yPos}px)`,
        width,
        height
      }
    }
    const style = {
      ...elemPositionStyle,
      ...elemStyle
    }
    if(elem.type !== 'div'){
      if(app.selectedElement === id){
        style.opacity = '1'
      }else{
        style.opacity = '0'
      }
    }
    delete style.background
    delete style.backgroundColor
    delete style.backgroundUrl
    switch(elem.type){
      case 'div':
        return <div 
          className='section-wrapper' style={{...style}} 
          data-uuid={id}
        >
          {elem.children && elem.children.length ? elem.children.map((child, cidx) => getChildElemBorder(child, cidx)) : undefined}
        </div>
      default:
        return <div 
          draggable="false"
          className={app.selectedElement === id ? 'component-wrapper selected' : 'component-wrapper'} 
          style={{...style}}
          data-uuid={id} 
          onDoubleClick={e => handleDoubleClick(e, elem)}
          onClick={e => selectComponent(e, id)}
          onPointerDown={e => handlePointerEvent(e, true, elem.id)}
        />
    }
  }

  const { dragIndex, dragSection, activeDrag, } = app

  return (
    <div 
      onPointerMove={e => app.setActiveGroup(props.area, e)}
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
          const childSelected = app.selectedParentElement === id
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
                className={`section-component ${isSelected || childSelected ? ' active-component' : ''}`}
                style={{
                  ...style,
                  flexDirection: 'column',
                  zIndex: 0
                }}
              >
                <ComponentBorder style={style} display={isSelected}>
                  {children ? children.map((child, idx) => getChildElemBorder(child, idx)) : undefined}
                </ComponentBorder>
                {
                  (app.activeDrag && id === app.currentSectionId && app.childDragSection === props.area) || isSelected ? (<PartitionBorder {...elem} />) : undefined
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