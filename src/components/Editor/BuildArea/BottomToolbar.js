import React, { useEffect, useRef, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import { ComponentBorder } from './ComponentBorder'
import { ReactComponent as CSSIcon } from '../../../svg/css2.svg'
import { ReactComponent as Arrows } from '../../../svg/multi-arrow.svg'

export const BottomToolbar = observer((props) => {
  
  const [wrapperClass, setClass] = useState('hidden')

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const { store: { app, sidebar } } = getStore()

  const prevItem = usePrevious(app.layersOpen)

  const animate = (show = false) => {
    setClass(`animating-${show ? 'open' : 'close'}`)
    if(show){
      setTimeout(() => {
        setClass('visible')
      }, 400)
    }else{
      setTimeout(() => {
        setClass('hidden')
      }, 400)
    }
  }

  useEffect(() => {
    if(!app.layersOpen){
      if(prevItem){
        animate(false)
      }
    }else{
      if(!prevItem){
        animate(true)
      }
    }

  }, [app.layersOpen])

  const selectElement = (id) => {
    app.setSelectedElement(id, null)
  }

  const getElems = (element, level = 0) => {
    if(element.children){
      level += 1
    }
    return (
      <div 
        className={`layer-toolbar-list-item${app.selectedElement === element.id ? ' selected' : ''}`}
        style={{
          paddingLeft: level * 2 + 'px'
        }}
        key={element.id}
      >
        <div 
          className='elem-meta'
          onClick={e => selectElement(element.id)}
        >
          <span className='elem-tag'>{element.tagName}</span>
          {
            element.className ? <span className='elem-class'>.{element.className}</span> : undefined
          }
        </div>
        {
          element.children && element.children.length ? (
            element.children.map(child => getElems(child, level))
          )
          :
          undefined
        }
      </div>
    )
  }

  const getLayerItems = () => {
    const elements = app.pages[0].elements
    return (
      elements.map(el => getElems(el, 0))
    )
  }

  const handleToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    app.toggleLayerToolbar()
  }

  return (
    <div className='layer-toolbar'>
      <div 
        className='layer-toolbar_header'
        onClick={e => handleToggle(e)}
      >
        <span>Layers</span>
        <Arrows style={{ transform: `${app.layersOpen ? 'rotate(180deg)' : 'rotate(0deg)'}` }}/>
      </div>
      <div className={`layer-toolbar-list ` + wrapperClass}>
        {getLayerItems()}
      </div>
    </div>
  )

})