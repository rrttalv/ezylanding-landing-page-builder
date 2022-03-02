import React, { useEffect, useRef, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import { ComponentBorder } from './ComponentBorder'
import { ReactComponent as CSSIcon } from '../../../svg/css2.svg'
import { ReactComponent as Trash } from '../../../svg/trash.svg'
import { ReactComponent as Duplicate } from '../../../svg/duplicate.svg'
import { ReactComponent as Arrows } from '../../../svg/multi-arrow.svg'
import { ReactComponent as Caret } from '../../../svg/caret-down.svg'
import { ReactComponent as GearIcon } from '../../../svg/gear.svg'
import { PropInput } from './ComponentTools/PropInput'

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

  const saveElementProp = (id, propName, toggleName, propValue) => {
    app.updateElementProp(id, propName, propValue)
    app.toggleElementProp(id, toggleName, false)
  }

  const toggleProp = (e, id, propName, propStatus) => {
    e.preventDefault()
    e.stopPropagation()
    app.toggleElementProp(id, propName, propStatus)
  }

  const getPropToggle = (element, toggleName, text, active) => {
    return (
      <button
        onClick={e => toggleProp(e, element.id, toggleName, !active)}
        className={active ? 'active' : ''}
      >
        {text}
      </button>
    )
  }

  const getOptionsMenu = element => {
    const menu = document.querySelector('.layer-toolbar-list')
    const parent = document.querySelector(`[data-metauuid="${element.id}"]`)
    const { y: offsetY } = menu.getBoundingClientRect()
    const { y } = parent.getBoundingClientRect()
    let className = `element-options`
    let inputClass = `element-options_prop-input`
    if((y - offsetY) <= 60){
      className += ' bottom'
      inputClass += ' bottom'
    }else{
      className += ' top'
      inputClass += ' top'
    }
    return (
      <div className={className}>
        <div className='element-options_const-row'>
          <div className='option-wrapper element-options_css'>
            <button
              className={element.cssOpen ? 'active' : ''}
              onClick={e => toggleInlineCSSTab(e, element.id)}
            >
              CSS
            </button>
          </div>
          <div className='option-wrapper element-options_class'>
            {getPropToggle(element, 'editingClass', '.class', element.editingClass)}
            {
              element.editingClass ? (
                <PropInput
                  value={element.className}
                  save={(value) => saveElementProp(element.id, 'className', 'editingClass', value)}
                  className={inputClass}
                  label={'Set element className'}
                />
              )
              :
              undefined
            }
          </div>
          <div className='option-wrapper element-options_id'>
            {getPropToggle(element, 'editingID', '#id', element.editingID)}
            {
              element.editingID ? (
                <PropInput
                  value={element.domID}
                  save={(value) => saveElementProp(element.id, 'domID', 'editingID', value)}
                  className={inputClass}
                  label={'Set element ID'}
                />
              )
              :
              undefined
            }
          </div>
        </div>
        <div className='element-options_misc-row'>
          {
            //Show SRC button
            element.tagName === 'img' ? (
              <div className='option-wrapper'>
                {getPropToggle(element, 'editingSrc', 'src', element.editingSrc)}
                {
                  element.editingSrc ? (
                    <PropInput
                      value={element.src}
                      save={(value) => saveElementProp(element.id, 'src', 'editingSrc', value)}
                      className={inputClass}
                      label={'Set element src'}
                    />
                  )
                  :
                  undefined
                }
              </div>
            )
            :
            undefined
          }
          {
            //Show placeholder input
            element.type === 'input' ? undefined : undefined
          }
          {

          }
        </div>
      </div>
    )
  }

  const toggleOptionsMenu = (id, status) => {
    app.setElementToolbarMenu(id, status)
  }

  const toggleChildren = (id) => {
    app.toggleCompChildren(id)
  }

  const handleDelete = id => {
    app.deleteElement(id)
  }

  const duplicateElement = id => {
    app.duplicateElement(id)
  }

  const getElems = (element, level = 0) => {
    const { childrenOpen } = element
    const isSelected = app.selectedElement === element.id
    return (
      <div 
        className={`layer-toolbar-list-item${isSelected ? ' selected' : ''}${level > 1 ? ' is-child' : ''}`}
        style={{
          marginLeft: level * 1.5 + 'px'
        }}
        key={element.id}
      >
        <div 
          className='elem-meta'
          data-metauuid={element.id}
          onClick={e => selectElement(element.id)}
        >
          <span className='elem-tag'>{element.tagName}</span>
          {
            element.className ? <span className='elem-class'>.{element.className.split(' ').join('.')}</span> : undefined
          }
          {
            element.domID ? <span className='elem-domID'>#{element.domID}</span> : undefined
          }
          {
            element.toolbarOptionsOpen && isSelected ? (
              getOptionsMenu(element)
            )
            :
            undefined
          }
          {
            isSelected ? (
              <>
                <button
                  onClick={e => duplicateElement(element.id)}
                  className='duplicate-btn'
                >
                  <Duplicate className='trash' />
                </button>
                <button
                  onClick={e => handleDelete(element.id)}
                  className='delete-btn'
                >
                  <Trash className='trash' />
                </button>
                <button 
                  onClick={e => toggleOptionsMenu(element.id, !element.toolbarOptionsOpen)}
                  className='options-toggle'>
                  {
                    <GearIcon className={element.toolbarOptionsOpen ? 'active' : 'inactive'} />
                  }
                </button>
              </>
            )
            :
            undefined
          }
          {
            element.children && element.children.length && isSelected && level === 0 ? (
              <button
                onClick={e => toggleChildren(element.id)}
                className='children-toggle'
              >
                <Caret className={childrenOpen ? 'active' : 'inactive'} />
              </button>
            )
            :
            undefined
          }
        </div>
        {
          element.children && element.children.length ? (
            <span style={{display: 'none'}}>{level += 1}</span>
          )
          :
          undefined
        }
        {
          element.children && element.children.length && childrenOpen ? (
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
    if(elements.length === 0){
      return (
        <div className='layer-toolbar_empty'>
          <span>No layers</span>
        </div>
      )
    }
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
      <div 
        className={`layer-toolbar-list ` + wrapperClass}
      >
        {getLayerItems()}
      </div>
    </div>
  )

})