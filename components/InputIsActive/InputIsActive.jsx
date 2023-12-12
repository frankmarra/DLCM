export default function InputIsActive({
  isActive,
  setIsActive,
  children,
  onChange,
}) {
  return (
    <label className="label checkbox" htmlFor="isActive">
      <input
        className="input"
        id="isActive"
        type="checkbox"
        checked={isActive}
        onChange={() =>
          onChange({
            type: "change",
            name: "isActive",
            value: !isActive,
          })
        }
      />
      {children}
    </label>
  )
}
