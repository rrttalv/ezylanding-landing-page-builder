import React, { useEffect, useRef, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import { ComponentBorder } from './ComponentBorder'
import { ReactComponent as CSSIcon } from '../../../svg/css2.svg'
import { ReactComponent as Arrows } from '../../../svg/multi-arrow.svg'

export const BottomToolbar = observer((props) => {
  
  const [wrapperClass, setClass] = useState('hidden')
  const [toolbarClass, setToolbarClass] = useState('default')

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
    setToolbarClass(`animating-${show ? 'open' : 'close'}`)
    if(show){
      setClass('visible')
      setTimeout(() => {
        setToolbarClass('visible-child')
      }, 400)
    }else{
      setTimeout(() => {
        setClass('hidden')
        setToolbarClass('hidden-child')
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

  const addLevel = (level) => {
    level += 1
    return level
  }

  const toggleInlineCSSTab = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if(app.selectedElement !== id){
      app.setSelectedElement(id)
    }
    app.toggleCSSTab(id)
  }

  const getElems = (element, level = 0) => {
    return (
      <div 
        className={`layer-toolbar-list-item${app.selectedElement === element.id ? ' selected' : ''}${level > 1 ? ' is-child' : ''}`}
        style={{
          marginLeft: level * 1.5 + 'px'
        }}
        key={element.id}
      >
        <div 
          className='elem-meta'
          onClick={e => selectElement(element.id)}
        >
          <span className='elem-tag'>{'<'}{element.tagName}{'>'}</span>
          {
            element.className ? <span className='elem-class'>.{element.className}</span> : undefined
          }
          <div className='elem-options'>
            {
              //Show SRC button
              element.tagName === 'img' ? undefined : undefined
            }
            <div className='elem-options_css'>
              <button
                className={element.cssOpen ? 'active' : ''}
                onClick={e => toggleInlineCSSTab(e, element.id)}
              >
                CSS
              </button>
            </div>
            <div className='elem-options_custom-class'>
              <button
                className={element.editingClass ? 'active' : ''}
              >
                Class
              </button>
            </div>
          </div>
        </div>
        {
          element.children && element.children.length ? (
            <span style={{display: 'none'}}>{level += 1}</span>
          )
          :
          undefined
        }
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
    <div className={`layer-toolbar ${toolbarClass}`}>
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