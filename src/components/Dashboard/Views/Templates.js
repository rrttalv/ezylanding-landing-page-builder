import { MobXProviderContext, observer } from 'mobx-react'
import { ReactComponent as Trash } from '../../../svg/trash.svg'
import { ReactComponent as NewTab } from '../../../svg/new-tab.svg'
import React, { useEffect } from 'react'
import { Spinner } from '../../Static/Spinner'

export const Templates = observer((props) => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { dashboard } } = getStore()

  const { templates, templateFilter, moreTemplates, templatesLoading } = dashboard

  useEffect(() => {
    if(!templates.length && moreTemplates){
      dashboard.fetchUserTemplates()
    }
  }, [])

  const openEditor = id => {
    window.location.href = `/editor?templateId=${id}`
    //do smth
  }

  const showDeleteConfirmation = id => {
    return
  }

  const getTemplates = () => {
    return (
      templates.map(template => {
        const { pageLength, thumbnail, frameworkId, publicTemplate, templateId } = template
        return (
          <div key={templateId} className='template'>
            <div className='template_wrapper'>
              <div className='template_wrapper-preview'>
                <img src={thumbnail ? thumbnail : '/images/components/media/landscape-image.jpg'} />
              </div>
              <div className='template_wrapper-meta'>
                <span>Pages: <strong>{pageLength}</strong></span>
                <span>Framework: <strong>{frameworkId}</strong></span>
              </div>
              {
                publicTemplate ? (
                  <div />
                ) 
                : 
                (
                  <div className='template_wrapper-options'>
                    <button className='btn-none trash'>
                      <Trash />
                    </button>
                    <button onClick={() => openEditor(templateId)} className='btn-none edit'>
                      <NewTab />
                    </button>
                  </div>
                )
              }
            </div>
          </div>
        )
      })
    )
  }

  return (
    <div className='dashboard_templates content'>
      <div className='dashboard_templates-preview'>
        {getTemplates()}
        {
          (templates.length || (!templates.length && !moreTemplates)) && !templatesLoading ? (
            moreTemplates ? (
              <div className='content_footer dashboard_templates-loadmore'>
                <button className='btn-bordered'>
                  Load More
                </button>
              </div>
            )
            :
            (
              <div className='content_footer dashboard_templates-empty'>
                <span>That's all we've got...</span>
              </div>
            )
          )
          :
          undefined
        }
        {
          templatesLoading ? (
            <div className='dashboard_templates-loading-wrapper'>
              <Spinner center={true} scale={0.7} />
            </div>
          )
          :
          undefined
        }
      </div>
    </div>
  )

})