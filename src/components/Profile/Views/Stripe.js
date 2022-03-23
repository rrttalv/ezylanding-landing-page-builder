import { MobXProviderContext, observer } from 'mobx-react'
import React from 'react';
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export const Stripe = observer((props) => {

  const stripe = useStripe();
  const elements = useElements();

  const getStore = () => {
    return React.useContext(MobXProviderContext)
  }

  const { store: { auth } } = getStore()

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK || 'pk_test_51KfMstDNHncdiETbAnk1hogbgOr7iJCO9oRrX9Xb857upjTqYORCuL3elUhPxTYc3m42e2Mc50xojzKEDEnQgogu00JhPybTGJ')

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }
  }

  return (
    <div className='stripe'>
      {
        auth.purchaseInProgress ? (
          <div className='stripe_form-wrapper'>
            <form onSubmit={handleSubmit}>
              
            </form>
          </div>
        )
        :
        undefined
      }
      </div>
  )

})