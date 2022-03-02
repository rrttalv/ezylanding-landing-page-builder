import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'


export const SlideMenu = observer((props) => {

  const { className, style, menuItems, onClick } = props

  const handleClick = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    onClick(id)
  }

  return (
    <div 
      className={`slide-menu ${className}`}
      style={style}
    >
      {
        menuItems.map(item => (
          <div 
            className='slide-menu_item'
          >
            {
              item.icon ? item.icon : undefined
            }
            <button 
              onClick={(e) => handleClick(e, item.id)}
              className={`slide-menu_item_title${item.active ? ' active' : ''}`}
            >
              {item.label || item.id}
            </button>
          </div>
        ))
      }
    </div>
  )

})