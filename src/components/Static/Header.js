import { MobXProviderContext, observer } from 'mobx-react'
import { ReactComponent as Caret } from '../../svg/caret-down.svg'
import { ReactComponent as Check } from '../../svg/mint-check.svg'
import React, { useEffect, useState } from 'react'

export const Header = observer(() => {

  const [menuClass, setMenuClass] = useState('hidden')

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { header } } = getStore()

  useEffect(() => {
    header.initMenuContent()
  }, [])

  useEffect(() => {
    if(header.settingsOpen){
      setMenuClass('animating-open')
      setTimeout(() => {
        setMenuClass('visible')
      }, 250)
    }else{
      setMenuClass('animating-close')
      setTimeout(() => {
        setMenuClass('hidden')
      }, 250)
    }
  }, [header.settingsOpen])

  const getMenuItemChild = (item, idx) => {
    const { title, id, selected, onClick } = item
    return (
      <div className={`header_settings_menu-item${selected ? ' active' : ''}`} key={id + idx}>
        <button 
          onClick={item.onClick}
          className={`header_settings_menu-item-title`}
        >
          {title}
          {
            selected ? (<Check style={{fill: 'none'}} />) : undefined
          }
        </button>
      </div>
    )
  }

  const getContent = (item, idx) => {
    return (
      <div 
        key={idx} 
        className={`header_settings_menu-item${item.open ? ' selected' : ''}`}
        onClick={() => header.toggleMenuItemChildren(item.id)}
      >
        <button 
          className={`header_settings_menu-item-title${item.open ? ' selected' : ''}`}
        >
          {
            item.title
          }
        </button>
        {
          item.open ? <Caret style={{ transform: `rotate(${item.open ? '-90deg' : '0'})` }} /> : undefined
        }
        {
          item.open ? (
            <div className='header_settings_sub-menu'>
              {
                item.children.map((child, idx) => (
                  getMenuItemChild(child, idx)
                ))
              }
            </div>
          )
          :
          undefined
        }
      </div>
    )
  }

  return (
    <div className='header'>
      <div className='header_settings' onClick={() => header.toggleMenu()}>
        <span>Project settings</span> <Caret style={{ transform: `rotate(${header.settingsOpen ? '180deg' : '0'})` }} />
      </div>
      {
        header.settingsMenuContent ? (
          <div className={`header_settings_menu ${menuClass}`}>
            {
              header.settingsMenuContent.map((item, idx) => (
                getContent(item, idx)
              ))
            }
          </div>
        )
        :
        undefined
      }
    </div>
  )

})