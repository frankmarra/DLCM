import Link from "next/link"

export default function About() {
  return (
    <section
      className="stack inline-max center-stage"
      style={{ "--max-inline-size": "65ch" }}
    >
      <h1>About</h1>
      <p>
        DLCM is your solution for managing Bandcamp (and any other) download
        codes. No more sending out random lists of codes - your listeners can
        generate their own unique code and know that it will work! No more
        checking to see who took what.
      </p>
      <ul>
        <li>
          <a href="#get-started">How do I get started managing my codes?</a>
        </li>
        <li>
          <a href="#free-account">What do I get with a free account?</a>
        </li>
        <li>
          <a href="#subscribe">What do I get with a pro account?</a>
        </li>
        <li>
          <a href="#unsubscribe">What happens if I cancel my pro account?</a>
        </li>
      </ul>

      <h2 id="get-started" style={{ "--stack-space": "var(--size-8)" }}>
        How do I get started managing my codes?
      </h2>
      <p>
        Getting started is easy. First, go to our{" "}
        <Link href="/signup">signup page</Link> and create a new account. Enter
        your email and choose a password. This is how you will log in to DLCM in
        the future.
      </p>
      <p>
        Next, choose what type of account you would like to have, either an
        artist or a label. You will notice that as you begin to fill in your
        artist/label name, the field below it also starts to fill in. This field
        is your artist/label slug, and that represents your public-facing
        profile on DLCM.
      </p>
      <p>
        For example, I just started a label named after my dogs, Franny and Rool
        Records. When I enter that into the label name field, the label slug
        auto-fills to franny-and-rool-records, and directly underneath that will
        be what your address on DLCM is -
        https://dlcm.app/franny-and-rool-records
      </p>
      <p>
        We will let you know if that URL is available, or if somebody has
        already claimed that name. If that&apos;s the case, you can keep Franny
        and Rool Records as your label name, and edit your slug to something
        like franny-and-rool-records-2, or franny-and-rool-records-llc. And
        don&apos;t worry about proper formatting, the slug field will do that
        for you automatically.
      </p>
      <p>
        Then click the signup button, and that&apos;s it! Welcome to the club.
      </p>

      <h2 id="free-account" style={{ "--stack-space": "var(--size-8)" }}>
        What do I get with a free account?
      </h2>
      <p>
        A free account sets you up with a public page and the ability to upload
        two releases. A release can be anything from a single to an LP. You are
        also able to upload as many codes as you want for both of those
        releases, as well as upload the artwork for each. (Artwork must be less
        than 1MB)
      </p>

      <h2 id="subscribe" style={{ "--stack-space": "var(--size-8)" }}>
        What do I get with a pro account?
      </h2>
      <p>
        A pro account gives you access to a few features in addition to the free
        stuff. First, you aren&apos;t limited to just two releases, you can have
        as many as you like. You also get to display any other services you or
        the release is on, such as bandcamp/spotify/apple music/etc. You also
        are able to set those releases to inactive, meaning that they won&apos;t
        show up if a user goes to your artist/label page, and will say that
        there are no codes available on the releases page. In addition to
        setting active/inactive, you are also able to password-protect these
        pages.
      </p>
      <p>
        Another feature included with a pro account is the ability to change
        your public profile address or slug. However, changing this will make
        the previous address show a page not found error. Make sure you tell all
        of your fans before making this change.
      </p>
      <p>
        The last feature of the pro account is the ability to upload bandcamp
        .csv files for code upload instead of copying and pasting. Please be
        advised that this only works with .csv files provided by bandcamp, and
        other .csv files will result in an error.
      </p>

      <h2 id="unsubscribe" style={{ "--stack-space": "var(--size-8)" }}>
        What happens if I cancel my pro account?
      </h2>
      <p>
        We would be very sad, but if you decide that the pro account is not for
        you, you will keep the service until the end of your billing cycle.
        After that, your two newest releases will be saved, while all other
        releases and codes associated with them will be removed from our system.
        You will also no longer have any of the other perks that come with a pro
        account.
      </p>
    </section>
  )
}
