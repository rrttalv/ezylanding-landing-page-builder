import React, { useEffect, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'

export const PartitionBorder = observer((props) => {

  const [borderStyle, setBorderStyle] = useState({ display: 'none' })
  const [areas, setAreas] = useState([])

  useEffect(() => {
    setBorderStyle({
      padding: props.style.padding ? props.style.padding : 0,
      display: 'block',
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
    })
    //Incase user is using bootstrap or equivalent
    if(props.partitionStyles){

    }else{
      const borderAreas = []
      for(let i = 1; i < props.partitions; i++){
        if(i === props.partitions){
          return
        }else{
          borderAreas.push({ left: (100 / props.partitions) * i + '%', height: '100%' })
        }
      }
      setAreas(borderAreas)
    }
  }, [props.style])

  return (
    <div className='section-partition' style={borderStyle}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {
          areas.map((area, idx) => (
            <div className='section-partition_border' key={idx + props.id} style={area} />
          ))
        }
      </div>
    </div>
  )

})