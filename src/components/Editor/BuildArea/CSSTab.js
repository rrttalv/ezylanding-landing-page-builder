import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import { CodeEditorEditable } from 'react-code-editor-editable'
import 'highlight.js/styles/dracula.css';
import { camelToDash } from '../../../utils';

export const CSSTab = observer((props) => {

  const handleChange = (newValue) => {
    console.log(newValue)
  }

  const getStringStyle = () => {
    let str = '.' + props.className + ' { \n'
    const copy = {...props.style}
    Object.keys(copy).forEach(key => {
      const strKey = camelToDash(key)
      str += '  ' + strKey.replace('"', '') + ': ' + copy[key] + ';\n'
    })
    str += '}'
    return str
  }

  return (
    <div className='css-tab'>
      <CodeEditorEditable
        value={getStringStyle()}
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