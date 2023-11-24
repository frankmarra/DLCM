export default function InputIsActive({
  isActive,
  setIsActive,
  children,
  dispatch,
}) {
  return (
    <label className="label checkbox" htmlFor="isActive">
      <input
        className="input"
        id="isActive"
        type="checkbox"
        checked={isActive}
        onChange={() =>
          dispatch({
            type: "input",
            name: "isActive",
            value: !isActive,
          })
        }
      />
      {children}
    </label>
  )
}
