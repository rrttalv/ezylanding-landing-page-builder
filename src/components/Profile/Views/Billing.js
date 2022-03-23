import { MobXProviderContext, observer } from 'mobx-react'
import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Spinner } from '../../Static/Spinner'
import { discardSubscription, getPaymentIntent } from '../../../services/AuthService';
import { ReactComponent as Close } from '../../../svg/close.svg'
import { Stripe } from './Stripe';

export const Billing = observer((props) => {
  
  const [period, setPeriod] = useState('yearly')
  const [clientSecret, setClientSecret] = useState('')
  const [subscriptionId, setsubscriptionId] = useState('')
  const [intentId, setIntentId] = useState('')

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { auth } } = getStore()

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK)

  const togglePeriod = () => {
    if(period === 'yearly'){
      setPeriod('monthly')
    }else{
      setPeriod('yearly')
    }
  }

  const handlePurchaseStart = async () => {
    try{
      auth.setPurchaseStatus(true)
      const { data: { clientSecret: secret, subscriptionId: subid, paymentIntentId } } = await getPaymentIntent(period)
      setClientSecret(secret)
      setIntentId(paymentIntentId)
      setsubscriptionId(subid)
    }catch(err){
      console.log(err)
      auth.setPurchaseStatus(false)
    }
  }

  const appearance = {
    theme: 'stripe',
  }

  const options = {
    clientSecret,
    appearance,
  }

  const handleDiscard = async () => {
    try{
      auth.setPurchaseStatus(false)
      await discardSubscription(subscriptionId)
    }catch(err){
      console.log(err)
    }
  }


  return (
    <div className='profile_billing'>
      {
        auth.subscription ? (
          <div className='billing_active-subscription'>
          </div>
        )
        :
        (
          <>
          <div className='billing_plans'>
            <div className='billing_plans-header'>
              <h2>
                No active subscription
              </h2>
              <p>
                With a subscription you will have access to all of our templates. It takes just 2 minutes to subscribe!
              </p>
            </div>
            <div className='billing_plans-body'>
              <div className='billing-plan'>
                <div className='billing-plan_header'>
                  <h3 className='billing-plan_name'>Standard Plan</h3>
                  {
                    period === 'monthly' ? (
                      <span className='billing-plan_price'>$20 <span className='billing-price-extra'>/mo</span></span>
                    ) : 
                    (
                      <span className='billing-plan_price'>$16.6 <span className='billing-price-extra'>/mo</span></span>
                    )
                  }
                </div>
                <div className='billing-plan_body'>
                  <p className='billing-plan_body-text'>With the standard plan you will get access to the following features:</p>
                  <ul className='billing-plan_body-list'>
                    <li>
                      All the templates
                    </li>
                    <li>
                      Unlimited asset upload
                    </li>
                    <li>
                      Templates to React project builder
                    </li>
                    <li>
                      Access to your personal templates for life
                    </li>
                    <li>
                      24/7 Support
                    </li>
                  </ul>
                </div>
                <div className='billing-plan_footer'>
                  {
                    auth.purchaseInProgress ? (
                      <div>
                        <Spinner style={{ height: '49px' }} center={true} scale={0.5} />
                      </div>
                    )
                    :
                    (
                      <button onClick={() => handlePurchaseStart()} className='billing-plan_btn'>
                        Buy Now
                      </button>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
          {
            auth.purchaseInProgress && clientSecret ? (
              <div className='modal stripe-modal'>
                <div className='modal-wrapper'>
                  <div className='modal-header'>
                    <h2>Start your {period} subscription</h2>
                    <button onClick={() => handleDiscard()} className='btn-none close-modal'>
                      <Close />
                    </button>
                  </div>
                  <div className='modal-body'>
                    <Elements options={options} stripe={stripePromise}>
                      <Stripe subscriptionId={subscriptionId} intentId={intentId} clientSecret={clientSecret} />
                    </Elements>
                  </div>
                </div>
              </div>
            )
            :
            undefined
          }
          </>
        )
      }
    </div>
  )

})