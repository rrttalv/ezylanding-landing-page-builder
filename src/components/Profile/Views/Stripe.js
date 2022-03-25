import { MobXProviderContext, observer } from 'mobx-react'
import React, { useState } from 'react';
import { CardElement, Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Spinner } from '../../Static/Spinner';
import { createPaymentMethod } from '../../../services/AuthService';

export const Stripe = observer((props) => {

  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')


  const stripe = useStripe();
  const elements = useElements();

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { auth } } = getStore()

  const handleSubmit = async (e) => {
    try{
      e.preventDefault()
      if(!stripe || !elements){
        return
      }

      setIsLoading(true)
  
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `${process.env.REACT_APP_API_BASE}/api/stripe/callback?clientSecret=${props.clientSecret}&subscriptionId=${props.subscriptionId}&intentId=${props.intentId}`,
        },
      })
  
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occured.");
      }
  
      setIsLoading(false)
    }catch(err){
      console.log(err)
      setIsLoading(false)
    }
  }

  return (
    <div className='stripe'>
      {
        auth.purchaseInProgress && props.clientSecret ? (
          <div className='stripe_form-wrapper'>
            {
              message ? (
                <div className='stripe-error'>
                  <span>Payment error: {message}</span>
                </div>
              )
              :
              undefined
            }
            <form onSubmit={handleSubmit}>
              <div className='form-row'>
                <label htmlFor="name">
                  Name on card
                </label>
                <input 
                  label="Name"
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <PaymentElement id="payment-element" />
              <button disabled={isLoading || !stripe || !elements} id="submit">
                {isLoading ? undefined : <span id="button-text">Pay now</span>}
                {
                  isLoading ? <Spinner center={true} style={{ height: '25px', margin: 0 }} scale={0.3} /> : undefined
                }
              </button>
            </form>
          </div>
        )
        :
        undefined
      }
      </div>
  )

})