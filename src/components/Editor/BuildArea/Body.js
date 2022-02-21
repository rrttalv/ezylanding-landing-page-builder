import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import { ComponentBorder } from './ComponentBorder'
import { PartitionBorder } from './PartitionBorder'
import { ReactComponent as CSSIcon } from '../../../svg/css2.svg'
import { ReactComponent as ColumnIcon } from '../../../svg/column.svg'
import { SlateEditor } from './ElementWrappers/SlateEditor'
import { CSSTab } from './CSSTab'

export const Body = observer((props) => {
  
  const [bodyHeight, setBodyHeight] = useState(0)

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app, sidebar } } = getStore()
  const activePage = app.getActivePage()

  const selectComponent = (e, id, sectionId, section = false) => {
    console.log(id, sectionId)
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
  }, [app.pages.body, app.pages.header, app.pages.footer, app.pages, app.selectedElement, app.movingElement, app.activeDrag, app.activeFramework])

  const handlePointerEvent = (e, status, id, parentId) => {
    if(!app.selectedElement !== id){
      app.setSelectedElement(id, parentId)
    }
  }

  const getEditingTextElem = (elem, parentId, style) => {
    let copy = {...style}
    const { type } = elem
    if(type === 'text' && elem.tagName.includes('h') && !style.fontWeight){
      copy.fontWeight = 600
    }
    if(!style.fontFamily){
      copy.fontFamily = app.activeFonts[0].name
    }
    if(type === 'button'){
      copy = {
        ...copy,
        display: 'flex',
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

  const getChildElemBorder = (elem, idx, sectionId) => {
    const { position, style: elemStyle, id } = elem
    let style = {}
    if(position){
      style = {
        width: position.width,
        height: position.height,
        margin: position.margin,
        padding: position.padding,
        ...position.flexProps
      }
      if(elem.type === 'div'){
        delete style.height
      }
    }
    switch(elem.type){
      case 'div':
        return <div 
          key={idx + sectionId}
          className='section-wrapper' 
          style={{...style}} 
          data-uuid={id}
        >
          {elem.children && elem.children.length ? elem.children.map((child, cidx) => getChildElemBorder(child, cidx, id)) : undefined}
        </div>
      case 'button':
      case 'text':
        if(app.activeTextEditor === elem.id){
          if(elem.type === 'button'){
          }
          return getEditingTextElem(elem, sectionId, elemStyle)
        }
      default:
        return (
          <div 
            draggable="false"
            key={idx + sectionId}
            className={app.selectedElement === id ? 'component-wrapper selected' : 'component-wrapper'} 
            style={{...style}}
            data-uuid={id} 
            onDoubleClick={e => handleDoubleClick(e, elem, sectionId)}
            onClick={e => selectComponent(e, id, sectionId)}
            onPointerDown={e => handlePointerEvent(e, true, elem.id, sectionId)}
          >
          {
            app.selectedElement === id ? (
              <div className='prop-menu'>
                <div 
                  className='prop-menu__css'
                  onClick={e => toggleCSSTab(e, id, sectionId)}
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
          {
            app.editingCSS && elem.cssOpen ? (
              <CSSTab style={{...elemStyle}} className={elem.className} />
            )
            :
            undefined
          }
          </div>
        )
    }
  }
  
  const { dragIndex, dragSection, activeDrag, } = app

  return (
    <div 
      className={`build-area_body`}
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
          let childSelected = app.selectedParentElement === id
          if(app.selectedParentElement && !childSelected){
            const subElem = elem.children.find(({ id }) => id === app.selectedParentElement)
            childSelected = !!subElem
          }
          return (
            <>
              {
                idx === dragIndex && activeDrag ? (
                  <div className='build-area_insert-preview insert-above' />
                )
                :
                undefined
              }
              <div 
                onClick={e => selectComponent(e, id, null, true)}
                data-uuid={elem.id}
                className={`section-component ${isSelected || childSelected ? ' active-component' : ''}`}
                style={{
                  ...style,
                  zIndex: 0
                }}
              >
                <div className='section-options'>
                  <div className='section-options_btn'>
                    <CSSIcon />
                  </div>
                </div>
                <ComponentBorder display={isSelected || childSelected} style={{...elem.style}}>
                  {children ? children.map((child, idx) => getChildElemBorder(child, idx, elem.id)) : undefined}
                </ComponentBorder>
                {
                  ((app.activeDrag && id === app.currentSectionId) || childSelected) || isSelected ? (<PartitionBorder {...elem} />) : undefined
                }
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
                activePage.elements.length - 1 === idx && idx + 1 === dragIndex && activeDrag ? (
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