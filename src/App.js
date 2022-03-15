import { observer, MobXProviderContext } from 'mobx-react'
import React from 'react'
import { Header } from './components/Static/Header'
import { Toaster } from 'react-hot-toast'
import { RegularHeader } from './components/Static/RegularHeader'


export const App = observer(() => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { router } } = getStore()

  const getPath = () => {
    console.log(router.currentRoute)
    return router && router.currentRoute ? router.currentRoute.rootPath : ''
  }

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