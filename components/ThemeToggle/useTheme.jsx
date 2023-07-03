import { useEffect, useState } from "react"

const useTheme = () => {
  const [theme, setTheme] = useState()

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme")
    setTheme(localTheme ?? "system")
  }, [])

  useEffect(() => {
    if (!theme) {
      return
    }

    if (theme === "dark") {
      window.localStorage.setItem("theme", "dark")
      document.documentElement.setAttribute("data-theme", "dark")
    } else if (theme === "light") {
      window.localStorage.setItem("theme", "light")
      document.documentElement.setAttribute("data-theme", "light")
    } else {
      window.localStorage.removeItem("theme")
      document.documentElement.removeAttribute("data-theme")
    }
  }, [theme])

  return { theme, setTheme }
}

export default useTheme
