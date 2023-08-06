export default function InputIsActive({ isActive, setIsActive, children }) {
  return (
    <label className="label checkbox" htmlFor="isActive">
      <input
        className="input"
        id="isActive"
        type="checkbox"
        checked={isActive}
        onChange={() => setIsActive(!isActive)}
      />
      {children}
    </label>
  )
}
