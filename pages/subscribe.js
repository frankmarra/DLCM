import Head from "next/head"

export default function subscribe() {
  return (
    <>
      <Head>
        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      </Head>
      <stripe-pricing-table
        pricing-table-id="prctbl_1N4qtHJSrZPUTrMcsHWioXkw"
        publishable-key="pk_test_51MoTOyJSrZPUTrMczIx91DS34IuEUTkJt1I42uLAArpBIS8uWzxznXXzyHucjWgmtwdkSOSVWg7P6J6zVdR9iWZv00NDrR6sU9"
      ></stripe-pricing-table>
    </>
  )
}
