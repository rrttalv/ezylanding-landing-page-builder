import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { ReactComponent as Upload } from '../../svg/upload.svg'

export const DragUpload = observer(props => {

  const [dragging, setDragging] = useState(false)
  let _dragTimer = null


  const { className, style, handleUpload, uploading } = props
  
  const startDataTransfer = (e) => {
    e.preventDefault()
    e.stopPropagation()
    document.querySelector('#upload-input').click()
  }

  const debounceSetDrag = (e, dragStatus) => {
    e.preventDefault()
    e.stopPropagation()
    if(!dragging && dragStatus){
      setDragging(dragStatus)
      return
    }
    if(_dragTimer){
      clearTimeout(_dragTimer)
    }
    _dragTimer = setTimeout(() => {
      setDragging(dragStatus)
    }, 100)
  }

  const handleDrop = (e, source) => {
    e.preventDefault()
    e.stopPropagation()
    if(_dragTimer){
      clearTimeout(_dragTimer)
    }
    setDragging(false)
    handleUpload(e.dataTransfer.files)
  }

  
  const wrapperClass = `drag-upload ${className} ${dragging ? 'dragging' : ''}`

  const dragFuncs = {
    onDragEnter: (e) => debounceSetDrag(e, true),
    onDragOver: (e) => debounceSetDrag(e, true),
    onDragLeave: (e) => debounceSetDrag(e, false),
    onDragEnd: (e) => handleDrop(e, true),
    onDragExit: (e) => debounceSetDrag(e, false),
    onDropCapture: (e) => handleDrop(e),
    onDrop: (e) => handleDrop(e),
  }

  const metaStyle = dragging ? '#7176ec' : '#777777'

  return (
    <div 
      className={wrapperClass}
      style={style}
      onDrag
      {...dragFuncs}
      onClick={e => startDataTransfer(e)}
    >
      <span className='drag-upload_text' style={{ color: metaStyle }}>
        <Upload className='drag-upload_icon' style={{ fill: metaStyle }} />
        {
          uploading ? 'Uploading...' : (dragging ? 'Drop the asset(s) here' : 'Drag & drop 1 or more assets here')
        }
      </span>
    </div>
  )

})