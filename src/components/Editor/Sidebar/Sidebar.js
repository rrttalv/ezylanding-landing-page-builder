import { MobXProviderContext, observer } from 'mobx-react'
import React, { useState } from 'react'
import { ReactComponent as Block } from '../../../svg/blocks.svg'
import { ReactComponent as Code } from '../../../svg/code.svg'
import { ReactComponent as Link } from '../../../svg/link.svg'
import { ReactComponent as Tools } from '../../../svg/tools.svg'
import { ReactComponent as Roller } from '../../../svg/roller.svg'
import { SlideWrapper } from './SlideWrapper'

export const Sidebar = observer((props) => {

  const [slideList] = useState([
    {
      label: 'Components',
      id: 'components',
      icon: <Block />
    },
    {
      label: 'Customize',
      id: 'customize',
      icon: <Code />
    },
    {
      label: 'Routes',
      id: 'routes',
      icon: <Link />
    },
    {
      label: 'Templates',
      id: 'templates',
      icon: <Roller style={{ height: '37px' }} />
    },
    {
      label: 'Build',
      id: 'build',
      icon: <Tools />
    },
  ])

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { sidebar, app } } = getStore()

  const handleItemClick = id => {
    if(sidebar.activeItem === id){
      sidebar.unsetActiveItem()
    }else{
      sidebar.toggleItem(id)
    }
  }

  return (
    <div 
      className='sidebar'
    >
      <div className='sidebar_toggles'>
        {slideList.map(item => (
          <button className={`sidebar_toggle ${item.id}${item.id === sidebar.activeItem ? ' active' : ''}`} key={item.id} onClick={() => handleItemClick(item.id)}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <SlideWrapper />
    </div>
  )

})