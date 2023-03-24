import Stripe from "stripe"
import { supabase } from "@/utils/supabase"

export default async function handler(req, res) {
  const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

  const customer = await stripe.customers.create({
    email: req.body.email,
  })
  res.send({ message: `stripe customer created: ${customer.id}` })
  await supabase
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", req.body.uid)
}
