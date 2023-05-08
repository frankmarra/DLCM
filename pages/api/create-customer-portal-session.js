import Stripe from "stripe"

export default async function handler(req, res) {
  const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

  const session = await stripe.billingPortal.sessions.create({
    customer: req.body.stripe_customer_id,
    return_url: "http://localhost:3000",
  })
  res.redirect(session.url)
}
