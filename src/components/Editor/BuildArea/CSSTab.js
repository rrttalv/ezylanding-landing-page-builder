import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import { CodeEditorEditable } from 'react-code-editor-editable'
import 'highlight.js/styles/dracula.css';
import { camelToDash } from '../../../utils';

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
      console.log(yPos.top, offsetY)
      if(yPos.top <= 0){
        yPos.top = 25
      }
      setPositionStyle({
        ...xPos,
        ...yPos,
        display: 'initial'
      })
    }
    setStringStyle()
  }, [])

  useEffect(() => {
    checkIfShouldMove()
  }, [value])

  const checkIfShouldMove = () => {
  }

  const handleChange = (newValue) => {
    setValue(newValue)
    app.changeElementCSSValue(newValue)
  }

  const handleClick = e => {
    e.prevetDefault()
    e.stopPropagation()
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

  return (
    <div 
      className='css-tab'
      style={positionStyle}
    >
      <CodeEditorEditable
        onClick={e => handleClick(e)}
        value={value}
        tabSize={2}
        setValue={handleChange}
        width='500px'
        borderRadius={4}
        height='450px'
        language='css'
      />
    </div>
  )

})