import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import { ComponentBorder } from './ComponentBorder'
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
    if(elem.type === 'text' || elem.type === 'button' || elem.type === 'link'){
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
    let copy = {...elem.activeStyleMap }
    const { type } = elem
    style.width += 15
    return <SlateEditor elem={elem} parentId={parentId} style={copy} editorStyle={{...style, position: 'relative'}} area={props.area} />
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

  const getHelpers = (elem, sectionId, indicatorOnly = false, isSection = false) => {
    let className = `element-tools`
    if(isSection){
      className += ' section-tools'
    }
    const { before, after } = app.dragMetaData
    const { tagName, position: { width, height } } = elem
    return (
      <>
        {
          indicatorOnly ? (
            <>
            {before ? <div className='element-tools_insert before' /> : undefined}
            {after ? <div className='element-tools_insert after' /> : undefined}
            </>
          )
          :
          undefined
        }
        <div className={className}>
          <div className='element-tools_toolbar'>
            <ElementIndicator 
              elementTag={tagName}
              width={width}
              height={height}
              elementClass={elem.className}
            />
          </div>
        </div>
      </>
    )
  }

  const mapAllElements = (childElems, parentId) => {
    let children = []
    childElems.forEach((child, idx) => {
      children.push(child)
      if(child.children && child.children.length){
        children = [...children, ...mapAllElements(child.children, child.id)]
      }
    })
    return children
  }

  const getTextEditor = (elem, style, sectionId) => {
    const wrapperStyle = {...style, cursor: 'text'}
    if(elem.type === 'button'){
      delete wrapperStyle.background
      const keys = [
        'backgroundColor',
        'borderTopLeftRadius',
        'borderTopRightRadius',
        'borderBottomLeftRadius',
        'borderBottomRightRadius',
        'textAlign'
      ]
      wrapperStyle.display = 'block'
      keys.forEach(k => {
        wrapperStyle[k] = elem.activeStyleMap[k]
      })
    }else{
      const vals = ['flex', 'block', 'grid']
      if(!vals.includes(elem.activeStyleMap.display)){
        elem.activeStyleMap.display = 'block'
      }
      delete elem.activeStyleMap.width
      delete elem.activeStyleMap.marginLeft
      delete elem.activeStyleMap.marginRight
      delete elem.activeStyleMap.marginTop
      delete elem.activeStyleMap.marginBottom
      elem.activeStyleMap.whiteSpace = 'pre-wrap'
    }
    return getEditingTextElem(elem, sectionId, wrapperStyle)
  }

  const getChildElemBorder = (elem, idx, sectionId) => {
    const { position, id } = elem
    let style = {}
    if(position){
      style = {
        width: position.width,
        height: position.height,
        top: position.y - 1,
        left: position.x - 2,
        zIndex: 10,
        backgroundColor: 'transparent',
        background: 'transparent',
        border: 'none',
      }
    }
    const isSelected = app.selectedElement === id
    let elemClass = isSelected ? 'component-wrapper selected' : 'component-wrapper'
    let divClass = isSelected ? 'section-wrapper selected' : 'section-wrapper'
    const isDragTarget = app.dragTarget === id
    if(isDragTarget){
      elemClass += ' active-drag-target'
      divClass += ' active-drag-target'
    }
    style.position = 'absolute'
    switch(elem.type){
      case 'div':
        return <div 
          key={idx + sectionId}
          className={divClass}
          onClick={e => selectComponent(e, id, sectionId)}
          style={{...style}} 
          data-uuid={id}
        >
          <div />
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
      case 'link':
        if(app.activeTextEditor === elem.id){
          return getTextEditor(elem, style, sectionId)
        }
      default:
        return (
          <div 
            key={idx + sectionId}
            style={{...style}}
            data-uuid={id} 
            className={elemClass}
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
  
  const { dragIndex, activeDrag, displayInsert } = app

  return (
    <>
      <div 
        className={`build-area_body`}
        style={{
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
              position: 'absolute',
              top: elem.position.y,
              left: elem.position.x,
              zIndex: 0,
            }
            let className = `section-component`
            if(isSelected){
              className += ' active-component'
            }
            const isDragTarget = app.dragTarget === id
            if(isDragTarget){
              className += ' active-drag-target'
            }
            return (
              <React.Fragment 
                key={elem.id}
              >
                <div 
                  onClick={e => selectComponent(e, id, null, true)}
                  data-uuid={elem.id}
                  className={className}
                  onDoubleClick={e => handleDoubleClick(e, elem, null)}
                  style={tempStyle}
                >
                  {
                    //Need to fix the text editing prop stuff in appStore for this to work
                    //app.activeTextEditor === elem.id ? getTextEditor(elem, tempStyle, null) : undefined
                  }
                  {
                    idx === dragIndex && activeDrag && displayInsert && (app.parentElements.includes(activeDrag.type) || activeDrag.parent) ? (
                      <div className='build-area_insert-preview insert-above' />
                    )
                    :
                    undefined
                  }
                  {
                    activePage.elements.length - 1 === idx && idx + 1 === dragIndex && displayInsert && activeDrag && (app.parentElements.includes(activeDrag.type) || activeDrag.parent) ? (
                      <div className='build-area_insert-preview insert-below' />
                    )
                    :
                    undefined
                  }
                  {
                    isDragTarget || isSelected ? (
                      getHelpers(elem, elem.id, true, true)
                    )
                    :
                    undefined
                  }
                </div>
                  {
                    elem.children ? (
                      mapAllElements(elem.children, elem.id).map((child, idx) => (
                        getChildElemBorder(child, idx, elem.id)
                      ))
                    )
                    :
                    undefined
                  }
              </React.Fragment>
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