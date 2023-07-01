import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import Stripe from "stripe"

const handler = async (req, res) => {
  // const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)
  const stripe = Stripe(process.env.STRIPE_LIVE_SECRET_KEY)
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
  const { data: profileData } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", session.user.id)
    .single()

  const stripeSession = await stripe.checkout.sessions.create({
    customer: profileData.stripe_customer_id,
    mode: "subscription",
    line_items: [
      {
        price: "price_1NOtWvJSrZPUTrMcCt3Ptjs1",
        quantity: 1,
      },
    ],
    success_url: "https://dlcm.app/payment/success",
    cancel_url: "https://dlcm.app/payment/cancelled",
  })

  res.redirect(stripeSession.url)
}

export default handler
