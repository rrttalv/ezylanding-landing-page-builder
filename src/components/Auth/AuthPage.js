import { observer } from 'mobx-react'
import { React, useState } from 'react'
import { Login } from './Login'

export const AuthPage = observer((props) => {

  const [view, setView] = useState('login')

  return (
    <div className='container-fluid auth'>
      <div className='row' style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className='col-md-12 offset-0 offset-lg-2 col-lg-8' style={{ minHeight: 'inherit' }}>
          <div className='auth-wrapper'>
            {
              view === 'login' ? ( <Login /> ) : undefined
            }
          </div>
        </div>
      </div>
    </div>
  )

})