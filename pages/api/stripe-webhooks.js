import Stripe from "stripe"
import { supabase } from "@/utils/supabase"
const endpointSecret =
  "whsec_ed0b25f0aa25b273e709ee6e7feda8c64e0668e5cbe56a92ba95def7680f46ad"
export default async function handler(req, res) {
  const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)
  const sig = req.headers["stripe-signature"]

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
    console.log("event: ", event)
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  switch (event.type) {
    case "checkout.session.async_payment_failed":
      const checkoutSessionAsyncPaymentFailed = event.data.object
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break
    case "checkout.session.async_payment_succeeded":
      const checkoutSessionAsyncPaymentSucceeded = event.data.object
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object
      // Then define and call a function to handle the event checkout.session.completed
      break
    case "checkout.session.expired":
      const checkoutSessionExpired = event.data.object
      // Then define and call a function to handle the event checkout.session.expired
      break
    case "customer.subscription.created":
      const customerSubscriptionCreated = event.data.object
      // Then define and call a function to handle the event customer.subscription.created
      break
    case "customer.subscription.deleted":
      const customerSubscriptionDeleted = event.data.object
      // Then define and call a function to handle the event customer.subscription.deleted
      break
    case "subscription_schedule.canceled":
      const subscriptionScheduleCanceled = event.data.object
      console.log("canceled: ", subscriptionScheduleCanceled)
      // Then define and call a function to handle the event subscription_schedule.canceled
      break
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send()
}
