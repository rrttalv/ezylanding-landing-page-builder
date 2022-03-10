import React, { useState } from 'react'
import { ReactComponent as Block } from '../../../svg/blocks.svg'
import { ReactComponent as Code } from '../../../svg/code.svg'
import { ReactComponent as Link } from '../../../svg/link.svg'
import { ReactComponent as Folder } from '../../../svg/folder.svg'
import { ReactComponent as Tools } from '../../../svg/tools.svg'
import { ReactComponent as Templates } from '../../../svg/tools.svg'

export const SlideHeader = ((props) => {

  const [titleList] = useState({
    'components': {
      icon: <Block />,
      title: 'Insert a component'
    },
    'customize': {
      icon: <Code style={{ marginTop: '5px' }} />,
      title: 'Customize template'
    },
    'routes': {
      icon: <Link style={{ marginTop: '2px', paddingBottom: '2px' }} />,
      title: 'Set up routing'
    },
    'assets': {
      icon: <Folder style={{ marginTop: '2px', paddingBottom: '2px' }} width="23px" />,
      title: 'Manage assets'
    },
  })

  const data = titleList[props.id]

  return (
    <div className='slide-wrapper_header'>
      {
        data ? (
          <>
            {data.icon}
            <h5>{data.title}</h5>
          </>
        )
        :
        undefined
      }
    </div>
  )

})