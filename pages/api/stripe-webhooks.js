import Stripe from "stripe"
import { supabase } from "@/utils/supabase"
import { buffer } from "micro"

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)
  const sig = req.headers["stripe-signature"]
  const signingSecret = process.env.STRIPE_WEBHOOK_TEST_KEY
  const reqBuffer = await buffer(req)

  let event

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret)
  } catch (err) {
    console.log(err)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  async function createdSub(customer) {
    console.log(`subscription created for: ${customer}`)
    await supabase
      .from("profiles")
      .update({ is_subscribed: true })
      .eq("stripe_customer_id", customer)
  }

  async function canceledSub(customer) {
    console.log(`subscription canceled for customer: ${customer}`)
    await supabase
      .from("profiles")
      .update({ is_subscribed: "false" })
      .eq("stripe_customer_id", customer)
  }
  switch (event.type) {
    case "customer.subscription.created":
      const customerSubscriptionCreated = event.data.object
      createdSub(customerSubscriptionCreated.customer)
      // Then define and call a function to handle the event customer.subscription.created
      break
    case "customer.subscription.deleted":
      const customerSubscriptionDeleted = event.data.object
      canceledSub(subscriptionScheduleCanceled.customer)
      // Then define and call a function to handle the event customer.subscription.deleted
      break
    case "subscription_schedule.updated":
      const subscriptionScheduleCanceled = event.data.object

      // Then define and call a function to handle the event subscription_schedule.canceled
      break
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send({ received: true })
}
