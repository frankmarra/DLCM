import Link from "next/link"
import styles from "@/styles/Pricing.module.css"
import cn from "classnames"
import SEO from "@/components/SEO/SEO"

export default function Pricing() {
  return (
    <>
      <SEO title="Pricing"></SEO>
      <section
        className="stack inline-max"
        style={{ "--max-inline-size": "65ch" }}
      >
        <h1 className={styles.title}>Pricing</h1>
        <div className={cn(styles.plans, "flex-grid")}>
          <section className={cn(styles.plan, styles.free, "stack container")}>
            <h2 className="text-3">Free Plan</h2>
            <div className={styles.perks}>
              <ul role="list">
                <li>Two Releases</li>
                <li>Unlimited Codes</li>
                <li>Copy and Paste Code Upload</li>
                <li>Public Profile Page</li>
                <li>Dedicated Release Pages</li>
              </ul>
            </div>
          </section>

          <section
            className={cn(styles.plan, styles.pro, "container", "stack")}
          >
            <h2 className="text-3">Pro Plan</h2>
            <div className={cn(styles.cost, "flex-grid")}>
              <p className={styles.priceTag}>
                <span>
                  <sup>$</sup>5
                </span>{" "}
                monthly
              </p>
              <p className={styles.priceTag}>
                <span>
                  <sup>$</sup>50
                </span>{" "}
                yearly
                <br />
                <small>Save $10</small>
              </p>
            </div>
            <div className={styles.perks}>
              <ul role="list">
                <li>Unlimited Releases</li>
                <li>Password Protected Pages</li>
                <li>Custom URLs for Profile and Releases</li>
                <li>Add Copy to Release Pages</li>
                <li>Make Releases Active/Inactive</li>
                <li>Bandcamp CSV Code Upload</li>
                <li>Social/Streaming Links</li>
              </ul>
            </div>
          </section>
        </div>

        <div className={cn(styles.ctaSection, "stack")}>
          <h2 className="text-3">Ready to get started?</h2>
          <div className={cn(styles.actions, "cluster")}>
            <Link
              className={cn(styles.subscribe, "button")}
              data-variant="primary"
              href="/signup"
            >
              Create an account
            </Link>
            <Link href="/about">Learn more</Link>
          </div>
        </div>
      </section>
    </>
  )
}
