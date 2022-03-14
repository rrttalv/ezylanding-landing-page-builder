import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { ReactComponent as PlusIcon } from '../../../../svg/plus.svg';
import { ReactComponent as Caret } from '../../../../svg/caret-down.svg';
import { ReactComponent as Dot } from '../../../../svg/active-dot.svg';
import { ReactComponent as Trash } from '../../../../svg/trash.svg';


export const Routes = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { sidebar, app, routes } } = getStore()

  useEffect(() => {
    routes.getRouteList()
  }, [app.pages.length, app.activePage])

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

  const setActivePage = (e, pageId) => {
    e.preventDefault()
    e.stopPropagation()
    app.setActivePage(pageId)
  }

  const deletePage = (e, pageId) => {
    e.preventDefault()
    e.stopPropagation()
    app.deletePage(pageId)
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
        <div 
          className='input-group'
          style={{ width: `calc(50% - 6px)`, marginLeft: '6px' }}
        >
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
        <div className='route-list_prefrences_settings'>
          <button
            onClick={e => setActivePage(e, id)}
            disabled={app.activePage === id} 
            className='btn btn-empty activate'
          >
            <Dot />
            Set active   
          </button>
          <button
            onClick={e => deletePage(e, id)}
            disabled={app.pages.length === 1}
            className='btn btn-empty delete'
          >
            <Trash />
            Delete page  
          </button>
        </div>
      </div>
    )
  }

  const addRoute = e => {
    e.preventDefault()
    e.stopPropagation()
    app.addNewPage()
  }

  const renderRouteList = () => {
    return (
      <div className='route-list'>
        {
          routes.routeList.map(item => {
            const { route, detailsOpen, id } = item
            return (
              <div key={item.id} className={`route-list_item${detailsOpen ? ' active' : ''}${id === app.pageDropTarget.id ? ' drop-target' : ''}`}>
                <div className='route-list_header' data-pageid={id}>
                  <button 
                    className='btn-none'
                    onClick={e => toggleDetails(e, item.id)}
                  >
                    <span className='route-list_header_title'>
                      {route}
                    </span>
                      {
                        id === app.activePage ? (<span className='route-list_header_active blinking'><Dot /></span>) : undefined
                      }
                      <Caret 
                        style={{ transform: `rotate(${detailsOpen ? '180deg' : '0'})`, fill: `${detailsOpen ? '#3ee3c5' : 'var(--dim-gray)'}` }}
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