import React, { useState } from 'react'
import { ReactComponent as Block } from '../../../svg/blocks.svg'
import { ReactComponent as Code } from '../../../svg/code.svg'
import { ReactComponent as Palette } from '../../../svg/palette.svg'
import { ReactComponent as Link } from '../../../svg/link.svg'
import { ReactComponent as Tools } from '../../../svg/tools.svg'
import { ReactComponent as Templates } from '../../../svg/tools.svg'

export const SlideHeader = ((props) => {

  const [titleList] = useState({
    'components': {
      icon: <Block />,
      title: 'Insert a component'
    },
    'code': {
      icon: <Code style={{ marginTop: '5px' }} />,
      title: 'Customize code'
    },
    'palette': {
      icon: <Palette style={{ marginTop: '0px', width: '27px' }} />,
      title: 'Customize template palette'
    }
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