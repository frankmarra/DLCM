import { Html, Head, Main, NextScript } from "next/document"
import { clashDisplay, archivo } from "@/utils/fonts"
import { setInitialTheme } from "@/utils/theme"
import cn from "classnames"

export default function Document() {
  return (
    <Html lang="en" className={cn(clashDisplay.variable, archivo.variable)}>
      <Head>
        <meta property="og:image" content="/DLCM_OG_IMAGE.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
