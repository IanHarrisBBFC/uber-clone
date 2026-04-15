import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, rideDetails } = req.body;

    if (!amount || !rideDetails) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `CabnFly Transfer - ${rideDetails.vehicle}`,
              description: `From ${rideDetails.pickup} to ${rideDetails.dropoff}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}&pickup=${encodeURIComponent(rideDetails.pickup)}&dropoff=${encodeURIComponent(rideDetails.dropoff)}&vehicle=${encodeURIComponent(rideDetails.vehicle)}&price=${rideDetails.price}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/confirm`,
    });

    return res.status(200).json({ 
      sessionId: session.id,
      clientSecret: session.client_secret 
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: error.message });
  }
}
