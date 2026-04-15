import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import styled from 'styled-components';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

export default function StripeCheckout({ rideDetails }) {
  const [clientSecret, setClientSecret] = useState(null);

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(parseFloat(rideDetails.price) * 100),
          rideDetails: rideDetails
        })
      });

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (clientSecret) {
    return (
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    );
  }

  return (
    <CheckoutContainer>
      <button
        onClick={handleCheckout}
        className="w-full bg-[#FFD700] text-[#111111] font-bold py-3 rounded-lg hover:bg-yellow-600 transition"
      >
        Pay £{rideDetails.price}
      </button>
    </CheckoutContainer>
  );
}
