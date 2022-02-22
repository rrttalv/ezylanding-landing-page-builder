import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import { CodeEditorEditable } from 'react-code-editor-editable'
import 'highlight.js/styles/dracula.css';
import { camelToDash } from '../../../utils';
import { ReactComponent as MoveIcon } from '../../../svg/move.svg';
import { ReactComponent as CloseIcon } from '../../../svg/close2.svg';

export const CSSTab = observer((props) => {

  const [value, setValue] = useState('')

  const [positionStyle, setPositionStyle] = useState({ left: 0, top: 0, display: 'none' })

  
  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app } } = getStore()

  useEffect(() => {
    const element = document.querySelector(`[data-uuid="${props.id}"]`)
    const editor = document.querySelector('.build-area_page')
    if(element && editor){
      const { x, y, width, height } = element.getBoundingClientRect()
      const { x: offsetX, y: offsetY } = editor.getBoundingClientRect()
      let xPos = {
        left: (x - offsetX) + width + 10,
      }
      let yPos = {
        top: (y - offsetY) - height
      }
      if(document.body.clientWidth < xPos.left + 450){
        xPos = {
          left: x - 450 - offsetX - width + 10
        }
      }
      if(yPos.top <= 0){
        yPos.top = 25
      }
      if(xPos.left <= 0){
        xPos.left = 25
      }
      setPositionStyle({
        ...xPos,
        ...yPos,
        display: 'initial'
      })
      app.setCSSTabPosition(xPos.left, yPos.top)
    }
    setStringStyle()
  }, [])

  useEffect(() => {
    const { x, y } = app.cssEditorPosition
    setPositionStyle({
      left: x,
      top: y,
      display: 'initial'
    })
  }, [app.cssEditorPosition.x, app.cssEditorPosition.y])


  const handleChange = (newValue) => {
    setValue(newValue)
    app.changeElementCSSValue(newValue)
  }

  const handleClick = e => {
    e.preventDefault()
    e.stopPropagation()
    app.toggleCSSTab(props.id)
  }

  const setStringStyle = () => {
    let str = ''
    const copy = {...props.style}
    Object.keys(copy).forEach(key => {
      const strKey = camelToDash(key)
      str += '  ' + strKey.replace('"', '') + ': ' + copy[key] + ';\n'
    })
    setValue(str)
  }

  const setMovingCSSTab = (e, status) => {
    e.preventDefault()
    e.stopPropagation()
    app.setMovingCSSTab(status, e.clientX, e.clientY)
  }

  return (
    <div 
      className='css-tab'
      style={positionStyle}
    >
      <div className='css-tab_header'>
        <button
          className='css-tab_action move'
          onMouseDown={e => setMovingCSSTab(e, true)}
          onMouseUp={e => setMovingCSSTab(e, false)}
        >
          <MoveIcon />
        </button>
        <button
          onClick={e => handleClick(e)}
          className='css-tab_action close'>
            <CloseIcon />
        </button>
      </div>
      <CodeEditorEditable
        value={value}
        tabSize={2}
        setValue={handleChange}
        width='500px'
        height='450px'
        language='css'
      />
    </div>
  )

})