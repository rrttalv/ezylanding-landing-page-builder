import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { BottomToolbar } from './BuildArea/BottomToolbar'
import { BuildArea } from './BuildArea/BuildArea'
import { Element } from './BuildArea/Element'
import io from 'socket.io-client';
import { Sidebar } from './Sidebar/Sidebar'

export const Editor = observer((props) => {
  
  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { app, sidebar, socket } } = getStore()

  
  const shouldCloseSidebar = e => {
    if(app.activeDrag){
      const { x, width } = document.querySelector('.slide-wrapper').getBoundingClientRect()
      if(e.clientX > (x + width - 50)){
        sidebar.unsetActiveItem()
      }
    }
  }

  const handleMouseMove = e => {
    const { clientX, clientY } = e
    if(app.activeDrag){
      const { x, y } = document.querySelector('.editor').getBoundingClientRect()
      app.handleItemDragMove(clientX - x, clientY - y, clientX, clientY)
      shouldCloseSidebar(e)
    }
    if(app.movingElement){
      const { y: py } = document.querySelector('.layer-toolbar-list').getBoundingClientRect()
      const { x } = document.querySelector('.layer-toolbar-list .selected .move-btn').getBoundingClientRect()
      app.handleElementMove(clientX - x, clientY - py - 10, clientX, clientY)
    }
    if(app.movingCSSTab){
      app.moveCSSTab(clientX, clientY)
    }
  }

  const handleMouseUp = e => {
    if(app.movingElement){
      app.setMovingElement(null, 0, 0)
    }
    if(app.activeTextEditor){
      return
    }
    if(app.movingCSSTab){
      app.setMovingCSSTab(status, 0, 0)
    }
    if(app.activeDrag){
      app.insertComponent(e)
      app.setActiveDragItem(null)
    }
  }
  
  const resizeHandler = e => {
    app.handleWindowResize()
  }

  const logHandler = () => {
    console.log({...app.pages[0]})
  }

  useEffect(() => {
    window.addEventListener('resize', resizeHandler.bind(this))
    window.logContents = logHandler.bind(this)
    return function cleanup() {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  useEffect(() => {
    if(socket.socket){
      const { socket: socketInstance } = socket
      socketInstance.on('templateSaved', (template) => {
        //do whatever
      })
    }
  }, [socket.socket])

  useEffect(async () => {
    const params = new URLSearchParams(window.location.search)
    let existing = params.get('templateId')
    let preload = params.get('targetTemplateId')
    //check localstorage for templateID
    if(!existing){
      existing = localStorage.getItem('templateId')
    }
    if(existing && !preload){
      app.setTemplateID(existing)
      await app.fetchTemplate()
    }else{
      if(preload){
        localStorage.removeItem('templateId')
        await app.fetchTemplate(preload)
      }else{
        app.createTemplateID()
        //Load the initial default template for all users
        app.setActivePage()
        app.setIframeHeight()
        app.syncPalette()
        app.setActiveFramework('bootstrap')
        app.setCompiled()
      }
    }
    const newSocket = io(`http://${window.location.hostname}:4000`, { withCredentials: true })
    socket.setSocket(newSocket)
    return () => newSocket.close();
  }, [])

  useEffect(() => {

  }, [app.activePage])

  const handleUpload = async e => {
    const { files } = e.target
    await sidebar.uploadAsset(files[0])
  }

  const handleUploadCancel = e => {
    sidebar.setTargetedElement(null)
  }

  return (
    <div
      onPointerMove={e => handleMouseMove(e)}
      onPointerUp={e => handleMouseUp(e)}
      className='container-fluid editor'
    >
      <input id="upload-input" type="file" style={{ display: 'none' }} onChange={e => handleUpload(e)} onAbort={e => handleUploadCancel(e)} />
      <div className='editor_area'>
        <Sidebar />
        <BuildArea />
        {
          app.activeDrag ? 
          (
            <Element item={app.activeDrag} />
          )
          :
          undefined
        }
      </div>
      <BottomToolbar />
    </div>
  )

})