import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { ReactComponent as PlusIcon } from '../../../../svg/plus.svg';
import { ReactComponent as Caret } from '../../../../svg/caret-down.svg';


export const Routes = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { sidebar, app, routes } } = getStore()

  useEffect(() => {
    routes.getRouteList()
  }, [])

  const handleChange = (e, pageId) => {
    e.preventDefault()
    e.stopPropagation()
    const { name, value } = e.target
    console.log(name, value)
    routes.updateRouteProp(pageId, name, value)
  }

  const toggleDetails = (e, pageId) => {
    e.preventDefault()
    e.stopPropagation()
    routes.toggleDetails(pageId)
  }

  const getRouteDetails = item => {
    const { route, metaDescription, metaTitle, metaImage, id } = item
    return (
      <div className='route-list_prefrences'>
        <div className='input-group'>
          <label className='input-group_label'>
            Meta title
          </label>
          <input
            className='input-group_input'
            name={'metaTitle'}
            value={metaTitle}
            onChange={e => handleChange(e, id)}
          />
        </div>
        <div className='input-group'>
          <label className='input-group_label'>
            Path
          </label>
          <input
            className='input-group_input'
            name={'route'}
            value={route}
            onChange={e => handleChange(e, id)}
          />
        </div>
        <div className='input-group full-width'>
          <label className='input-group_label'>
            Meta description
          </label>
          <textarea
            className='input-group_input'
            name={'metaDescription'}
            value={metaDescription}
            onChange={e => handleChange(e, id)}
          >
          </textarea>
        </div>
      </div>
    )
  }

  const addRoute = e => {
    e.preventDefault()
    e.stopPropagation()
    //Add a new page
  }

  const renderRouteList = () => {
    return (
      <div className='route-list'>
        {
          routes.routeList.map(item => {
            const { route, detailsOpen } = item
            return (
              <div key={item.id} className={`route-list_item${detailsOpen ? ' active' : ''}`}>
                <div className='route-list_header'>
                  <button 
                    className='btn-none'
                    onClick={e => toggleDetails(e, item.id)}
                  >
                    <span className='route-list_header_title'>
                      {route}
                    </span>
                      <Caret 
                        style={{ transform: `rotate(${detailsOpen ? '180deg' : '0'})` }}
                      />
                    </button>
                </div>
                {
                  detailsOpen ? (
                    getRouteDetails(item)
                  )
                  :
                  undefined
                }
              </div>
            )
          })
        }
        <div className='route-list_add'>
          <button 
            className='btn-none'
            onClick={e => addRoute(e)}
          >
            <span>Add new route</span>
            <PlusIcon />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='route-slide slide-item'>
      <div className='route-slide_wrapper'>
        <h6 className='route-slide_title'>Configure project routes</h6>
        {renderRouteList()}
      </div>
    </div>
  )

})