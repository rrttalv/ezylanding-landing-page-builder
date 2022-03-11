import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import constants from '../../../../config/constants'
import { DragUpload } from '../../../Static/DragUpload'
import { Spinner } from '../../../Static/Spinner'
import { SlideMenu } from './SlideMenu'


export const Assets = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { sidebar, app } } = getStore()

  const handleMenuItemClick = id => {
    sidebar.setFocusedComponent(id)
  }

  useEffect(() => {
    if(sidebar.assets.length === 0){
      sidebar.fetchAssets()
    }
  }, [])

  const handleItemDragStart = (e, asset) => {
    const { clientX, clientY } = e
    const { x, y } = document.querySelector('.editor').getBoundingClientRect()
    //create an image element
    const { id, thumburl, url, rawSVG, originalName } = asset
    let item = null
    if(rawSVG){
      item = {
        type: 'svg',
        tagName: 'svg',
        inlineStyles: true,
        content: asset.svgString,
        dragProps: {
          rawWidth: 200,
          rawHeight: 200,
        },
        style: {
          fill: 'var(--main)',
          stroke: 'var(--main)',
        }
      }
    }else{
      item = {
        type: 'img',
        tagName: 'img',
        className: 'image',
        src: url,
        dragProps: {
          rawWidth: 200,
          rawHeight: 200,
        },
        style: {
          display: 'block'
        }
      }
    }
    app.setActiveDragItem(item, clientX + x, clientY - y)
    e.preventDefault()
    return
  }

  const handleItemDragEnd = () => {
    if(app.activeDrag){
      app.setMouseUp()
      app.setActiveDragItem(null)
    }
  }

  const insertItem = (e, item) => {
    e.preventDefault()
  }

  const { assetsLoading, assets } = sidebar

  const getAssetColumns = () => {
    return (
      <div className='asset-slide_cols'>
        {
          assets.map(asset => {
            const { id, thumburl, url, rawSVG, originalName } = asset
            return (
              <div 
                key={id} 
                draggable
                className='asset-slide_item'
                onMouseDown={e => handleItemDragStart(e, asset)}
              >
                {
                  rawSVG ? (
                    <div className='svg-wrapper' dangerouslySetInnerHTML={{ __html: asset.svgString }} />
                  )
                  :
                  (
                    <img src={thumburl ? thumburl : url} alt={originalName} />
                  )
                }
              </div>
            )
          })
        }
      </div>
    )
  }

  const handleUpload = async files => {
    await Promise.all(Object.values(files).map(async file => {
      await sidebar.uploadAsset(file)
    }))
  }

  return (
    <div 
      className='asset-slide slide-item'
      onPointerUp={() => handleItemDragEnd()}
    >
      <div className='asset-slide_upload'>
        <DragUpload
          className={'asset-slide_upload-wrapper'}
          style={{ marginTop: '25px', textAlign: 'center' }}
          handleUpload={handleUpload}
          uploading={sidebar.uploadingAsset}
        />
      </div>
      <div className='asset-slide_wrapper'>
        {getAssetColumns()}
      </div>
      {
        assetsLoading ? (
          <Spinner style={{ width: '100%', marginTop: '30px' }} scale={0.75} center={true} />
        )
        :
        undefined
      }
    </div>
  )

})