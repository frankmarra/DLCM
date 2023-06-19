import Stripe from "stripe"
import { supabase } from "@/utils/supabase"

export default async function handler(req, res) {
  const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

  const customer = await stripe.customers.create({
    email: req.body.email,
  })
  try {
    let { error } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: customer.id })
      .eq("id", req.body.uid)

    if (error) alert(error.message)
  } catch (error) {
    throw error
  }

  res.send({
    message: `stripe customer created: ${customer.id} for user: ${req.body.uid}`,
  })
}
