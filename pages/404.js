export default function Custom404() {
  return (
    <div
      className="intrinsic-center inline-max stack"
      style={{ "--max-inline-size": "50ch" }}
    >
      <h1 className="text-3">This page does not exist</h1>
      <p>
        Be sure to check that the URL has been entered correctly. It&rsquo;s
        possible that this content has been removed permanently or maybe it
        never existed in the first place...
      </p>
    </div>
  )
}
