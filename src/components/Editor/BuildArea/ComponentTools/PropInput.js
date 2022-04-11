import React, { useEffect, useState } from 'react'
import { ReactComponent as CheckIcon } from '../../../../svg/mint-check.svg'


export const PropInput = (props) => {

  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(props.value)
  }, [])

  const handleSave = e => {
    e.preventDefault()
    e.stopPropagation()
    props.save(value)
  }

  return (
    <div className={`${props.className} prop-input`}>
      <label
        className='prop-input_label'
      >
        {props.label}
      </label>
      <input 
        onDoubleClick={e => e.stopPropagation()}
        placeholder={props.placeholder || 'Set a custom prop...'}
        className='prop-input_input'
        type="text"
        onChange={e => setValue(e.target.value)}
        value={value}
      />
      <CheckIcon 
        className={`prop-input_save`} 
        onClick={e => handleSave(e)}
      />
    </div>
  )

}