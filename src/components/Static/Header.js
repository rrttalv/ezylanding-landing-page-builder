import { MobXProviderContext, observer } from 'mobx-react'
import { ReactComponent as Caret } from '../../svg/caret-down.svg'
import { ReactComponent as Check } from '../../svg/mint-check.svg'
import React, { useEffect, useRef, useState } from 'react'

export const Header = observer(() => {

  const [menuClass, setMenuClass] = useState('hidden')
  
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { header, app } } = getStore()

  useEffect(() => {
    header.initMenuContent()
  }, [])

  const prevOpen = usePrevious(header.settingsOpen)

  useEffect(() => {
    if(header.settingsOpen){
      setMenuClass('animating-open')
      setTimeout(() => {
        setMenuClass('visible')
      }, 250)
    }else{
      if(prevOpen === true){
        setMenuClass('animating-close')
        setTimeout(() => {
          setMenuClass('hidden')
        }, 250)
      }
    }
    header.handleFrameworkChange(app.activeFramework ? app.activeFramework.id : null)
  }, [header.settingsOpen])

  const handleChildClick = (e, item) => {
    e.preventDefault()
    e.stopPropagation()
    if(item.onClick){
      item.onClick.call()
    }
  }

  const getMenuItemChild = (item, idx) => {
    const { title, id, selected, onClick } = item
    return (
      <div 
        onClick={e => handleChildClick(e, item)} 
        className={`header_settings_menu-item${selected ? ' active' : ''}`} 
        key={id + idx}
        >
        <button 
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
        onClick={() => header.toggleSettingsMenuItemChildren(item.id)}
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
          item.open && item.children ? (
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
      <div className='header_settings' onClick={() => header.toggleSettingsMenu()}>
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