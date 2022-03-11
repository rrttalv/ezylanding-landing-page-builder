import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useRef, useState } from 'react'
import { SlideHeader } from './SlideHeader'
import { Components } from './Slides/Components'
import { Code } from './Slides/Code'
import { Routes } from './Slides/Routes'
import { Assets } from './Slides/Assets'

export const SlideWrapper = observer((props) => {

  const [wrapperClass, setClass] = useState('hidden')

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  

  const { store: { sidebar } } = getStore()

  const prevItem = usePrevious(sidebar.activeItem)

  const animate = (show = false) => {
    setClass(`animating-${show ? 'open' : 'close'}`)
    if(show){
      setTimeout(() => {
        setClass('visible')
      }, 400)
    }else{
      setTimeout(() => {
        setClass('hidden')
      }, 400)
    }
  }

  const { activeItem } = sidebar

  useEffect(() => {
    if(!sidebar.activeItem){
      if(prevItem){
        animate(false)
      }
    }else{
      if(!prevItem){
        animate(true)
      }
    }

  }, [sidebar.activeItem])

  const getSlide = () => {
    switch(activeItem){
      case 'components':
        return <Components />
      case 'customize':
        return <Code />
      case 'routes':
        return <Routes />
      case 'assets':
        return <Assets />
      default:
        return <div />
    }
  }

  return (
    <div 
      className={`slide-wrapper ${wrapperClass}`}
      style={activeItem === 'assets' ? { backgroundColor: `rgba(238, 238, 238, 0.96)` } : {}}
    >
      <SlideHeader id={activeItem} />
      {getSlide()}
    </div>
  )

})