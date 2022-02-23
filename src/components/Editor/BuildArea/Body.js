import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import { ComponentBorder } from './ComponentBorder'
import { ReactComponent as CSSIcon } from '../../../svg/css2.svg'
import { ReactComponent as ColumnIcon } from '../../../svg/column.svg'
import { SlateEditor } from './ElementWrappers/SlateEditor'
import { CSSTab } from './CSSTab'
import { ElementIndicator } from './ComponentTools/ElementIndicator'

export const Body = observer((props) => {
  
  const [bodyHeight, setBodyHeight] = useState(0)

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app, sidebar } } = getStore()
  const activePage = app.getActivePage()

  const selectComponent = (e, id, sectionId, section = false) => {
    if(app.editingCSS){
      return
    }
    if(section && app.activeTextEditor){
      app.setActiveTextEditor(null, null)
    }
    if(e.detail === 2){
      return
    }
    e.stopPropagation()
    e.preventDefault()
    app.setSelectedElement(id, sectionId)
  }

  const handleDoubleClick = (e, elem, sectionId) => {
    if(app.editingCSS){
      return
    }
    e.stopPropagation()
    e.preventDefault()
    if(elem.type === 'text' || elem.type === 'button'){
      let id = null
      let section = null
      if(app.activeTextEditor !== elem.id){
        id = elem.id
        section = sectionId
      }
      app.setActiveTextEditor(id, section)
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
  }, [app.pages.elements, app.sizeCalcChange, app.pages, app.selectedElement, app.activeDrag, app.activeFramework])

  const handlePointerEvent = (e, status, id, parentId) => {
    if(app.editingCSS){
      return
    }
    if(!app.selectedElement !== id){
      app.setSelectedElement(id, parentId)
    }
  }

  const getEditingTextElem = (elem, parentId, style) => {
    let copy = {...style}
    const { type } = elem
    if(type === 'text' && elem.tagName.includes('h') && !style.fontWeight){
      copy.fontWeight = 500
    }
    if(!style.fontFamily){
      //copy.fontFamily = app.activeFonts[0].name
    }
    if(type === 'button'){
      copy = {
        ...copy,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
      if(copy.textAlign){
        switch(copy.textAlign){
          case 'left':
            copy.justifyContent = 'flex-start'
            break
          case 'right':
            copy.justifyContent = 'flex-end'
            break
          default:
            break
        }
      }else{
        copy.textAlign = 'center'
      }
    }
    return <SlateEditor elem={elem} parentId={parentId} style={copy} area={props.area} />
  }

  const getElemDimensions = (id) => {
    const el = document.querySelector(`[data-uuid="${id}"]`)
    let elWidth = 0
    let elHeight = 0
    if(el){
      const { height, width } = el.getBoundingClientRect()
      elWidth = width
      elHeight = height
    }
    return { elWidth, elHeight }
  }

  const toggleCSSTab = (e, id, sectionId, isSection = false) => {
    e.stopPropagation()
    e.preventDefault()
    app.toggleCSSTab(id)
  }

  const getHelpers = (elem, sectionId, indicatorOnly = false) => {
    return (
      <>
        <div className='element-tools'>
          <div className='element-tools_toolbar'>
            <ElementIndicator 
              elementTag={elem.tagName}
              elementClass={elem.className}
            />
          </div>
        </div>
        {
          !indicatorOnly ? (
            <div className='prop-menu'>
              <div 
                className='prop-menu__css'
                onClick={e => toggleCSSTab(e, elem.id, sectionId)}
              >
                <CSSIcon />
              </div>
              <div className='prop-menu__lock'>
              </div>
            </div>
          )
          :
          undefined
        }
      </>
    )
  }

  const getChildElemBorder = (elem, idx, sectionId) => {
    const { position, style: elemStyle, id } = elem
    let style = {}
    if(position){
      style = {
        width: position.width,
        height: position.height,
        margin: position.margin,
        padding: position.padding,
        zIndex: 10,
        backgroundColor: 'transparent',
        background: 'transparent',
        border: 'none',
        
      }
      if(elemStyle.position){
        style.position = elemStyle.position
        style.top = elemStyle.top || undefined
        style.left = elemStyle.left || undefined
        style.bottom = elemStyle.bottom || undefined
        style.right = elemStyle.right || undefined
      }
    }
    if(elem.type === 'image' && elemStyle.display !== 'block'){
      style.display = 'block'
    }
    if(elem.type === 'div'){
      if(!elemStyle.height){
        delete style.height
      }
    }
    const isSelected = app.selectedElement === id
    let elemClass = isSelected ? 'component-wrapper selected' : 'component-wrapper'
    let divClass = isSelected ? 'section-wrapper selected' : 'section-wrapper'
    const isDragTarget = app.dragTarget === id
    if(isDragTarget){
      elemClass += ' active-drag-target'
      divClass += ' active-drag-target'
      style.position = 'relative'
    }
    if(elem.className){
      elemClass += ' ' + elem.className
      divClass += ' ' + elem.className
    }
    switch(elem.type){
      case 'div':
        return <div 
          key={idx + sectionId}
          className={divClass}
          onClick={e => selectComponent(e, id, sectionId)}
          style={{...style}} 
          data-uuid={id}
        >
          {elem.children && elem.children.length ? elem.children.map((child, cidx) => getChildElemBorder(child, cidx, id)) : undefined}
          {
            isSelected || isDragTarget ? (
              getHelpers(elem, sectionId, isDragTarget)
            )
            :
            undefined
          }
        </div>
      case 'button':
      case 'text':
        if(app.activeTextEditor === elem.id){
          return getEditingTextElem(elem, sectionId, elemStyle)
        }
      default:
        return (
          <div 
            key={idx + sectionId}
            className={elemClass} 
            style={{...style}}
            data-uuid={id} 
            onDoubleClick={e => handleDoubleClick(e, elem, sectionId)}
            onClick={e => selectComponent(e, id, sectionId)}
          >
          {
            isSelected || isDragTarget ? (
              getHelpers(elem, sectionId, isDragTarget)
            )
            :
            undefined
          }
          </div>
        )
    }
  }
  
  const { dragIndex, activeDrag, } = app

  return (
    <>
      <div 
        className={`build-area_body${app.activeFramework ? ' ' + app.activeFramework.parentClass : ''}`}
        style={{
          top: props.top,
          height: props.height,
          width: '100%'
        }}
      >
        {
          activePage.elements.map((elem, idx) => {
            const { style, children, id, type, position } = elem
            const isSelected = app.selectedElement === id
            const tempStyle = {
              width: position.width,
              height: position.height,
              margin: position.margin,
              padding: position.padding,
              ...position.flexProps
            }
            return (
              <>
                {
                  idx === dragIndex && activeDrag && app.parentElements.includes(activeDrag.type) ? (
                    <div className='build-area_insert-preview insert-above' />
                  )
                  :
                  undefined
                }
                <div 
                  onClick={e => selectComponent(e, id, null, true)}
                  data-uuid={elem.id}
                  className={`section-component ${isSelected ? ' active-component' : ''} ${elem.className ? ' ' + elem.className : ''}`}
                  style={{
                    ...tempStyle,
                    position: 'relative',
                    zIndex: 0
                  }}
                >
                  <div className='section-options'>
                    <div className='section-options_btn'>
                      <CSSIcon />
                    </div>
                  </div>
                  {children ? children.map((child, idx) => getChildElemBorder(child, idx, elem.id)) : undefined}
                  {
                    isSelected ? (
                      <div className='prop-menu section-prop-menu'>
                        <div 
                          className='prop-menu__css'
                          onClick={e => toggleCSSTab(e, id, null, true)}
                        >
                        </div>
                        <div className='prop-menu__lock'>
                        </div>
                      </div>
                    )
                    :
                    undefined
                  }
                </div>
                {
                  activePage.elements.length - 1 === idx && idx + 1 === dragIndex && activeDrag && app.parentElements.includes(activeDrag.type) ? (
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
      {
        app.editingCSS && app.cssElement ? (
          <CSSTab 
            id={app.cssElement.id}
            style={{...app.cssElement.style}}
            className={app.cssElement.className} 
          />
        )
        :
        undefined
      }
    </>
  )
})