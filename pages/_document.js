import { Html, Head, Main, NextScript } from "next/document"
import Script from "next/script"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta property="og:image" content="/DLCM_OG_IMAGE.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script src="/theme.js" strategy="beforeInteractive" />
      </body>
    </Html>
  )
}
