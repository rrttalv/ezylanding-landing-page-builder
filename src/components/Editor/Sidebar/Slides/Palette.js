import { MobXProviderContext, observer } from 'mobx-react'
import React, { useState } from 'react'
import { ChromePicker } from 'react-color'
import constants from '../../../../config/constants'


export const Palette = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { sidebar, app } } = getStore()

  const { palette } = app

  const handleChange = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    app.editPaletteProp(id, e.target.name, e.target.value)
  }

  const toggleEditing = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    app.togglePaletteEditing(id)
  }

  const handleColorChange = (color, id) => {
    const { rgb: { r, g, b, a } } = color
    app.editPaletteProp(id, 'value', `rgba(${r}, ${g}, ${b}, ${a})`)
  }

  const getPaletteItems = () => {
    return (
      <div className='palette-items'>
        {
          palette.map(item => {
            const { name, id, var: varName, value, isEditing } = item
            return (
              <div key={id} className='palette-item'>
                <div className='palette-item_color' onClick={e => toggleEditing(e, id)} style={{ background: value }} />
                {
                  isEditing ? (
                    <ChromePicker
                      color={value}
                      onChangeComplete={color => handleColorChange(color, id)}
                    />
                  )
                  :
                  undefined
                }
                <div className='input-group'>
                  <label
                    className='input-group_label'
                  >
                    Palette --var value
                  </label>
                  <input 
                    className='input-group_input'
                    type='text'
                    name='var'
                    placeholder='Palette item --var name'
                    value={varName}
                    onChange={e => handleChange(e, id)}
                  />
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

  return (
    <div className='palette-slide'>
      <div className='palette-slide_wrapper'>
        {getPaletteItems()}
      </div>
    </div>
  )

})