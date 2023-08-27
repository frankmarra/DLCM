import Head from "next/head"

const metadata = {
  title: "DLCM",
  description: "The definitive solution for download code management.",
  ogImage: `${process.env.NEXT_PUBLIC_DLCM_URL}og-image.png`,
}

export default function SEO({ title, description }) {
  const pageTitle = (title ? `${title} | ` : "") + metadata.title

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description || metadata.description} />
      <meta property="og:title" content={pageTitle} key="title" />
      <meta
        property="og:description"
        content={description || metadata.description}
        key="description"
      />
      <meta property="og:image" content={metadata.ogImage} key="ogImage" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta
        name="twitter:description"
        content={description || metadata.description}
      />
      <meta name="twitter:image" content={metadata.ogImage} />
    </Head>
  )
}
