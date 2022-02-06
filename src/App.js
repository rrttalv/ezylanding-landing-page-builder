import { observer, MobXProviderContext } from 'mobx-react'
import React from 'react'
import { Header } from './components/Static/Header'
import { Toaster } from 'react-hot-toast'


export const App = observer(() => {

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store } = getStore()
  
  return (
    <>
      <Header />
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