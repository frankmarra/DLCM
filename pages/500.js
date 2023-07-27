export default function Custom500() {
  return (
    <div
      className="intrinsic-center inline-max stack"
      style={{ "--max-inline-size": "50ch" }}
    >
      <h1 className="text-3">500 internal server error</h1>
      <p>
        The server encountered an unexpected hiccup and could not complete this
        particular request. Please try again later.
      </p>
    </div>
  )
}
