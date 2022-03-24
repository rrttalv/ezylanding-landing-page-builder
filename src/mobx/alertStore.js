import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast';
import React from 'react'
import { ReactComponent as Close } from '../svg/close.svg'

const initDetails = {
  error: false,
  success: false,
  message: ''
}

class alertStore {
  constructor() {
    makeAutoObservable(this)
  }

  toast = null

  createToast(message, type = 'error', duration = 5000){
    let icon = '⚠️'
    if(type === 'success'){
      icon = '🎉'
    }
    this.toast = toast(t => (
      <span 
        className="animated-toast" 
        role="button"
        onClick={() => toast.dismiss(t.id)} 
        onKeyDown={() => toast.dismiss(t.id)}
      >
        {message}
      <span 
        style={{
          position: 'absolute',
          right: '5px',
          top: 'calc(50% - 10px)'
        }}
      >
        <Close
          style={{
            width: '10px',
            height: '10px',
            marginBottom: '-1px',
            fill: 'var(--light)'
          }}
        />
      </span>
      </span>
    ),
    {
      icon,
      duration,
      className: `react-toast-wrapper react-toast-${type}`
    })
  }

}

export default alertStore