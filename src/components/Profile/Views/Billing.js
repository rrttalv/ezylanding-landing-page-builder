import { MobXProviderContext, observer } from 'mobx-react'
import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Spinner } from '../../Static/Spinner'
import { getPaymentIntent } from '../../../services/AuthService';

export const Billing = observer((props) => {
  
  const [period, setPeriod] = useState('yearly')
  const [clientSecret, setClientSecret] = useState('')

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

  const handlePurchaseStart = async () => {
    try{
      auth.setPurchaseStatus(true)
      const { data: { client_secret } } = await getPaymentIntent(period)
    }catch(err){
      console.log(err)
      auth.setPurchaseStatus(false)
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
        )
      }
    </div>
  )

})