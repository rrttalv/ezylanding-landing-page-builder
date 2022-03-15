import { observer } from 'mobx-react'
import { React, useState } from 'react'
import { PropInput } from '../Editor/BuildArea/ComponentTools/PropInput'

export const Login = observer((props) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className='auth-card login'>
      <div className='auth-card_header'>
        <h2>Login</h2>
      </div>
      <div className='auth-card_body'>
        <div className='auth-card_input'>
          <div className='input-group auth-group'>
            <label className='input-group_label'>Email address</label>
            <input type='text' onChange={e => setUsername(e.target.value)} value={username} className='input-group_input' />
          </div>
          <div className='input-group auth-group'>
            <label className='input-group_label'>Password</label>
            <input type='text' onChange={e => setPassword(e.target.value)} value={password} className='input-group_input' />
          </div>
        </div>
      </div>
      <div className='auth-card_footer'>
        <div className='auth-card_button'>
          <button className='btn btn-empty'>
            Login
          </button>
        </div>
        <span className='auth-card_separator'>OR</span>
        <div className='auth-card_oauth-buttons'>
          <button className='btn btn-empty'>
            Login with Google
          </button>
          <button className='btn btn-empty'>
            Login with GitHub
          </button>
          <button className='btn btn-empty'>
            Login with Twitter
          </button>
        </div>
      </div>
    </div>
  )

})