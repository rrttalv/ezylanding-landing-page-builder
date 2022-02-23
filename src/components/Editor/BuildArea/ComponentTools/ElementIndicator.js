import { MobXProviderContext, observer } from 'mobx-react'
import React from 'react'


export const ElementIndicator = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const colorMap = {
    'div': '#d7ba7d',
    'section': '#d7ba7d',
  }

  const { elementTag, elementClass } = props

  const getStyle = () => {
    let color = colorMap[elementTag]
    if(!color){
      color = 'red'
    }
    return {
      color
    }
  }

  return (
    <div className='element-indicator'>
      <span
        style={{
          color: '#d7ba7d',
        }}
        className='element-indicator_tag'
      >
        {'<'}{elementTag}{' />'}
      </span>
      <span
        className='element-indicator_class'
        style={{
          color: '#569cd6'
        }}
      >
        .{elementClass}
      </span>
    </div>
  )

})