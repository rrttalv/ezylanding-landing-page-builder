import { observer } from 'mobx-react'
import { React, useState } from 'react'
import { AuthArea } from './AuthArea'

export const AuthPage = observer((props) => {

  const [view, setView] = useState('login')

  const changeType = type => {
    setView(type)
  }

  return (
    <div className='container-fluid auth'>
      <div className='row' style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className='col-md-12 offset-0 offset-lg-2 col-lg-8' style={{ minHeight: 'inherit' }}>
          <div className='auth-wrapper'>
            <AuthArea type={view} changeType={changeType} />
          </div>
        </div>
      </div>
    </div>
  )

})