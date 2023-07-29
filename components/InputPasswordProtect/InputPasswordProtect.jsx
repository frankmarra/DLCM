import { useEffect, useRef } from "react"

export default function InputPasswordProtect({
  id,
  children,
  isProtected,
  setIsProtected,
  pagePassword,
  setPagePassword,
}) {
  const pagePasswordInputRef = useRef(null)

  useEffect(() => {
    if (isProtected) {
      pagePasswordInputRef.current.focus()
    }
  }, [isProtected])

  return (
    <>
      <label className="label checkbox" htmlFor="isPasswordProtected">
        <input
          type="checkbox"
          id={id}
          checked={isProtected}
          onChange={setIsProtected}
        />
        {children}
      </label>

      {isProtected ? (
        <>
          <label className="label" htmlFor="pagePassword">
            Page password
          </label>
          <input
            ref={pagePasswordInputRef}
            className="input"
            id="pagePassword"
            type="password"
            value={pagePassword}
            onChange={setPagePassword}
          />
        </>
      ) : null}
    </>
  )
}
