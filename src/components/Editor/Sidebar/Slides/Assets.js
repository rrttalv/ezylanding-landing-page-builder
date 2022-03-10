import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import constants from '../../../../config/constants'
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
    //app.setActiveDragItem(item, clientX + x, clientY - y)
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
              <div key={id} className='asset-slide_item'>
                {
                  rawSVG ? (
                    //SHOW SVG
                    <div />
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

  return (
    <div 
      className='asset-slide slide-item'
      onPointerUp={() => handleItemDragEnd()}
    >
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