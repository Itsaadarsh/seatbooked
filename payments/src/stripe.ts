import Stripe from 'stripe';
require('dotenv').config();

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2020-08-27',
});
