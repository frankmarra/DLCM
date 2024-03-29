import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import Stripe from "stripe"

const handler = async (req, res) => {
  // const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)
  const stripe = Stripe(process.env.STRIPE_LIVE_SECRET_KEY)
  const supabase = createPagesServerClient({ req, res })

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

  const stripeSession = await stripe.billingPortal.sessions.create({
    customer: stripe_customer_id,
    return_url: "https://dlcm.app/",
  })

  res.redirect(stripeSession.url)
}

export default handler
