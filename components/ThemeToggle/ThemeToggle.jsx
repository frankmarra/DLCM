import { useState, useEffect } from "react"
import cn from "classnames"
import useTheme from "./useTheme"
import styles from "./ThemeToggle.module.css"

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <label className={styles.label}>
      Theme:
      <select
        className={cn(styles.select, "input", "select")}
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </label>
  )
}

export default ThemeSwitch
