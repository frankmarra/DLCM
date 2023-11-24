import { useEffect, useRef } from "react"

export default function InputPasswordProtect({
  id,
  children,
  isProtected,
  pagePassword,
  dispatch,
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
          onChange={() =>
            dispatch({
              type: "input",
              name: "isPasswordProtected",
              value: !isProtected,
            })
          }
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
            onChange={(e) =>
              dispatch({
                type: "input",
                name: "pagePassword",
                value: e.target.value,
              })
            }
          />
        </>
      ) : null}
    </>
  )
}
