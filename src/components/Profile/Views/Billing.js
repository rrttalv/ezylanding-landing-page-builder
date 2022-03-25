import { MobXProviderContext, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Spinner } from '../../Static/Spinner'
import { discardSubscription, getPaymentIntent } from '../../../services/AuthService';
import { ReactComponent as Close } from '../../../svg/close.svg'
import { ReactComponent as Download } from '../../../svg/download.svg'
import moment from 'moment'
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

  useEffect(() => {
    if(auth.subscription && !auth.subscriptionDetails.interval){
      auth.fetchSubscriptionDetails()
    }
    if(auth.subscription && !auth.invoices.length){
      auth.fetchInvoices()
    }
  }, [auth.auth, auth.subscription])

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

  const getSubscriptionCard = () => {
    if(auth.subscriptionLoading || !auth.subscriptionDetails.interval){
      return <div />
    }
    const { subscriptionDetails: { active, cancelled, interval, amountConverted, created, currentPeriodEnd, currentPeriodStart } } = auth
    const dateFormat = 'DD MMMM YYYY'
    const startDate = moment(created).format(dateFormat)
    const lastBilled = moment(currentPeriodStart).format(dateFormat)
    const nextBill = moment(currentPeriodEnd).format(dateFormat)
    return (
      <div className='billing_subscription-details'>
        <div className='billing_subscription-card card-shadow'>
          <div className='billing_subscription-card_header'>
            <h5>{interval} subscription</h5>
            <span className={`billing_subscription-card_status ${cancelled ? 'canceled' : 'active'}`}>
              {
                cancelled ? 'Canceled' : 'Active'
              }
            </span>
          </div>
          <div className='billing_subscription-card_body'>
            <div className='billing_subscription-card_body_row'>
              <span className='billing_subscription-card_meta-title'>
                Created at
              </span>
              <span className='billing_subscription-card_meta-text'>
                {startDate}
              </span>
            </div>
            <div className='billing_subscription-card_body_row'>
              <span className='billing_subscription-card_meta-title'>
                Last invoice date
              </span>
              <span className='billing_subscription-card_meta-text'>
                {lastBilled}
              </span>
            </div>
            {
              cancelled ? (
                <div className='billing_subscription-card_body_row'>
                  <span className='billing_subscription-card_meta-title'>
                    Valid until
                  </span>
                  <span className='billing_subscription-card_meta-text'>
                    {nextBill}
                  </span>
                </div>
              )
              :
              (
                <div className='billing_subscription-card_body_row'>
                  <span className='billing_subscription-card_meta-title'>
                    Next invoice due
                  </span>
                  <span className='billing_subscription-card_meta-text'>
                    {nextBill}
                  </span>
                </div>
              )
            }
            <div className='billing_subscription-card_body_row'>
              <span className='billing_subscription-card_meta-title'>
                Billing interval
              </span>
              <span className='billing_subscription-card_meta-text capitalize'>
                {interval}
              </span>
            </div>
            <div className='billing_subscription-card_body_row'>
              <span className='billing_subscription-card_meta-title'>
                Next charge amount
              </span>
              <span className='billing_subscription-card_meta-text capitalize'>
                ${((amountConverted * 100) / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const downloadInvoice = url => {

  }

  const getInvoicesCard = () => {
    if(auth.invoicesLoading){
      return <div />
    }
    const { invoices } = auth
    const dateFormat = 'DD/MM/YYYY'
    return (
      <div className='billing_invoices-details'>
        <div className='billing_invoices-card card-shadow'>
          <div className='billing_invoices-card_header'>
            <h5>Subscription invoices</h5>
          </div>
          <div className='billing_invoices-card_body' style={{ maxHeight: 'calc(235px - 1rem)' }}>
            {invoices.map(invoice => {
              const { paid, created, invoice_pdf: invoiceLink, next_payment_attempt: nextAttemptDate, number, amount_due: dueAmount, total: amount } = invoice
              return (
                <div className={`billing_invoices-card_body-row ${paid ? 'paid' : 'due'}`}>
                  {
                    paid ? (
                      <div className='paid-invoice invoice'>
                        <div className='invoice_detail'>
                          <span>#{number}</span>
                        </div>
                        <div className='invoice_detail'>
                          <span>${(amount / 100).toFixed(2)}</span>
                        </div>
                        <div className='invoice_detail'>
                          <span>Date: </span>
                          <span>{moment(new Date(created * 1000)).format(dateFormat)}</span>
                        </div>
                        <div className='invoice_detail button'>
                          <a href={invoiceLink} target='_blank' className='btn-none download'>
                            <Download />
                          </a>
                        </div>
                      </div>
                    )
                    :
                    (
                      <div className='unpaid-invoice'>

                      </div>
                    )
                  }
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`profile_billing ${!auth.subscription ? 'center' : 'padded'}`}>
      {
        auth.subscription ? (
          <>
            <div className='billing_subscription'>
              <h2 className='title'>
                Subscription details
              </h2>
              {
                auth.subscriptionLoading ? (
                  <Spinner center={true} scale={0.8} style={{ marginTop: '2rem' }} />
                )
                :
                (
                  getSubscriptionCard()
                )
              }
            </div>
            <div className='billing_invoices'>
              <h2 className='title'>
                Invoices
              </h2>
              {
                auth.invoicesLoading ? (
                  <Spinner center={true} scale={0.8} style={{ marginTop: '2rem' }} />
                )
                :
                (
                  getInvoicesCard()
                )
              }
            </div>
            <div className='billing_orders'>
              <h2 className='title'>
                Single order invoices
              </h2>
            </div>
          </>
        )
        :
        (
          <>
          <div className='billing_plans'>
            <div className='billing_plans-header'>
              <h2 className='billing_plans-header_title title'>
                No active subscription
              </h2>
              <p className='billing_plans-header_subtitle'>
                With a subscription you will have access to all of our templates. It takes just 2 minutes to subscribe!
              </p>
              <div className='billing_plans-options'>
                <span className='billing_plans-options_title'>Choose a billing period</span>
                <div className='billing_plans-options_interactive'>
                  <span className={`billing_plans-options_text${period === 'monthly' ? ' active' : ''}`}>
                    Monthly
                  </span>
                  <input className='toggle' checked={period === 'yearly'} type="checkbox" onChange={() => togglePeriod()}/>
                  <span className={`billing_plans-options_text${period === 'yearly' ? ' active' : ''}`}>
                    Yearly
                    <span className={`billing_plans-options_highlighted${period === 'yearly' ? ' active' : ''}`}>
                      Save 20% per year
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className='billing_plans-body'>
              <div className='billing-plan'>
                <div className='billing-plan_header'>
                  <h3 className='billing-plan_name'>Standard {period} Plan</h3>
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