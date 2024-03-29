import { MobXProviderContext, observer } from 'mobx-react'
import { ReactComponent as NewTab } from '../../../svg/new-tab.svg'
import { ReactComponent as Pages } from '../../../svg/pages.svg'
import { ReactComponent as Eye } from '../../../svg/eye.svg'
import moment from 'moment'
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
        const { pageLength, thumbnail, title, frameworkId, tags, publicTemplate, templateId, updatedAt } = template
        const editStr = moment(updatedAt).fromNow(false)
        const editDateStr = editStr.includes('a few seconds ago') ? 'just seconds ago' : editStr
        return (
          <div key={templateId} className='template'>
            <div className='template_wrapper'>
              <div className='template_wrapper-preview'>
                <img src={thumbnail ? thumbnail : '/images/components/media/landscape-image.jpg'} />
              </div>
              <div className='template_wrapper-meta'>
                <div className='template_wrapper-meta_left'>
                  <h5>{title}</h5>
                  <div className='template_wrapper-meta_body'>
                    <Pages /> <span className='page-len'>{pageLength} Page{pageLength > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className='template_wrapper-meta_right'>
                  <div className='template_wrapper-meta_options'>
                    <button className='btn-none'>
                      <Eye className='template-preview-icon' />
                    </button>
                    <button onClick={() => openEditor(templateId)} className='btn-none'>
                      <NewTab className='template-open-icon' />
                    </button>
                  </div>
                </div>
              </div>
              <div className='template_wrapper-bottom'>
                <div className='template_wrapper-meta_left' style={{ width: '65%', wordBreak: 'break-word' }}>
                  <div className='template_wrapper-meta_tags'>
                    <span>#{frameworkId}</span>
                    {tags.map((tag, idx) => (<span key={idx + '_' + templateId}>#{tag}</span>))}
                  </div>
                </div>
                <div className='template_wrapper-meta_right' style={{ width: '35%' }}>
                  <div className='template_wrapper-meta_date'>
                    <span>Edited {editDateStr}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })
    )
  }

  const createNewTemplate = () => {
    localStorage.removeItem('templateId')
    window.location.href = '/editor'
  }

  return (
    <div className='dashboard_templates content'>
      <div className='dashboard_templates-header'>
        <div className='dashboard_templates-discover'>
          <h2 className='title'>Looking for something new? 👀</h2>
          <button className='btn-none' onClick={() => dashboard.changeActiveView('browse')}>
            Discover templates
          </button>
        </div>
      </div>
      <div className='content-section_header'>
        <h3 className='content-section_header-title'>Saved templates</h3>
      </div>
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