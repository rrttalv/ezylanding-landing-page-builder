import React, { useState } from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { ReactComponent as Google } from '../../svg/google.svg'
import { ReactComponent as Twitter } from '../../svg/twitter.svg'
import { ReactComponent as Github } from '../../svg/github.svg'
import { PropInput } from '../Editor/BuildArea/ComponentTools/PropInput'

export const AuthArea = observer((props) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fields] = useState({
    register: {
      title: 'Register new account',
      buttonText: 'Register'
    },
    login: {
      title: 'Login',
      buttonText: 'Login'
    }
  })

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { auth } } = getStore()

  const handleOAuth = type => {
    const newURL = process.env.REACT_APP_API_BASE + `/auth/${type}`
    window.location.href = newURL
  }

  const handleAuth = () => {
    if(props.type === 'login'){
      auth.handleLogin(username, password)
    }else{
      auth.handleRegister(username, password)
    }
  }

  const changeType = () => {
    props.changeType(props.type === 'register' ? 'login' : 'register')
  }

  const { title, buttonText } = fields[props.type]

  return (
    <div className='auth-card login'>
      <div className='auth-card_header'>
        <h2>{title}</h2>
      </div>
      <div className='auth-card_body'>
        <div className='auth-card_input'>
          <div className='input-group auth-group'>
            <label className='input-group_label'>Email address</label>
            <input type='text' onChange={e => setUsername(e.target.value)} value={username} className='input-group_input' placeholder='john.doe@example.com' />
          </div>
          <div className='input-group auth-group'>
            <label className='input-group_label'>Password</label>
            <input type='text' onChange={e => setPassword(e.target.value)} value={password} className='input-group_input' placeholder='********' />
          </div>
        </div>
      </div>
      <div className='auth-card_footer'>
        <div className='auth-card_buttons'>
          <button className='btn btn-empty auth-btn'>
            {buttonText}
          </button>
        </div>
        <span className='auth-card_separator'>OR</span>
        <div className='auth-card_oauth-buttons'>
          <button onClick={() => handleOAuth('google')} className='btn btn-empty google'>
            <Google />
            {buttonText} with Google
          </button>
          <button onClick={() => handleOAuth('google')} className='btn btn-empty github'>
            <Github />
            {buttonText} with GitHub
          </button>
          <button onClick={() => handleOAuth('google')} className='btn btn-empty twitter'>
            <Twitter />
            {buttonText} with Twitter
          </button>
        </div>
        <button onClick={e => changeType()} className='btn-none switch'>
          {
            props.type === 'register' ? 'Already have an account?' : `Don't have an account yet?`
          }
        </button>
      </div>
    </div>
  )

})