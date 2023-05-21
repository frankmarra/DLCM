import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import Stripe from "stripe"

const handler = async (req, res) => {
  const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return res.status(401).json({
      error: "not_authenticated",
      description:
        "The user does not have an active session or is not authenticated",
    })
  const {
    data: { stripe_customer_id },
  } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", session.user.id)
    .single()

  const stripeSession = await stripe.checkout.sessions.create({
    customer: stripe_customer_id,
    mode: "subscription",
    line_items: [
      {
        price: "price_1MoanYJSrZPUTrMcGu9jpmi9",
        quantity: 1,
      },
    ],
    success_url: "http://localhost:3000/payment/success",
    cancel_url: "http://localhost:3000/payment/cancel",
  })

  res.redirect(stripeSession.url)
}

export default handler
