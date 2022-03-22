import { MobXProviderContext, observer } from 'mobx-react'
import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export const Billing = observer((props) => {
  
  const [period, setPeriod] = useState('yearly')

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { auth } } = getStore()

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK || 'pk_test_51KfMstDNHncdiETbAnk1hogbgOr7iJCO9oRrX9Xb857upjTqYORCuL3elUhPxTYc3m42e2Mc50xojzKEDEnQgogu00JhPybTGJ')

  const togglePeriod = () => {
    if(period === 'yearly'){
      setPeriod('monthly')
    }else{
      setPeriod('yearly')
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
          <div className='billing_plans'>
            <div className='billing_plans-header'>
              <h2>
                No active subscription
              </h2>
              <p>
                With a subscription you will have access to all of our templates. It takes just 2 minutes to subscribe!
              </p>
            </div>
          </div>
        )
      }
    </div>
  )

})