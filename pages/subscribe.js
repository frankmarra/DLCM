import Script from "next/script"

export default function subscribe() {
  return (
    <>
      <script async src="https://js.stripe.com/v3/pricing-table.js"></script>

      <stripe-pricing-table
        pricing-table-id="prctbl_1N4qtHJSrZPUTrMcsHWioXkw"
        publishable-key={process.env.NEXT_PUBLIC_STRIP_SHAREABLE_KEY}
      ></stripe-pricing-table>
    </>
  )
}
