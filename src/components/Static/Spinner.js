import React from 'react'

export const Spinner = (props => {

  const { scale, style, center } = props

  return (
    <div className={`spinner-wrapper${center ? ' center' : ''}`} style={style}>
      <div className="lds-roller" style={{ transform: `scale(${scale ? scale : 1})` }}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )

})