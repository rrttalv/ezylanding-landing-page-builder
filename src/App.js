import { observer, MobXProviderContext } from 'mobx-react'
import React, { useEffect } from 'react'
import { Header } from './components/Static/Header'
import { Toaster } from 'react-hot-toast'
import { RegularHeader } from './components/Static/RegularHeader'


export const App = observer(() => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { router, auth } } = getStore()

  const getPath = () => {
    return router && router.currentRoute ? router.currentRoute.rootPath : ''
  }

  useEffect(async () => {
    await auth.checkAuth()
    const whitelist = ['/auth', '/']
    if(auth.auth && whitelist.includes(window.location.pathname)){
      window.location.href = '/dashboard'
    }
    if(!auth.auth){
      const isWhitelisted = whitelist.includes(window.location.pathname)
      if(!isWhitelisted){
        window.location.href = '/auth'
      }
    }
  }, [window.location.pathname])

  return (
    <>
      {getPath() === '/editor' ? <Header /> : <RegularHeader />}
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background:'#9163ff',
            maxWidth: '375px',
            color:'#fff'
          },
        }} 
          containerStyle={{
            position: 'sticky',
            top: '50px',
          }}
      />
    </>
  )
})