import { MobXProviderContext, observer } from 'mobx-react'
import { ReactComponent as Caret } from '../../svg/caret-down.svg'
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

  const getContent = (item, idx) => {
    return (
      <div 
        key={idx} 
        className='header_settings_menu-item'
        onClick={() => header.toggleMenuItemChildren(item.id)}
      >
        <button className='header_settings_menu-item-title'>
          {
            item.title
          }
        </button>
        {
          item.open ? <Caret style={{ transform: `rotate(${item.open ? '-90deg' : '0'})` }} /> : undefined
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