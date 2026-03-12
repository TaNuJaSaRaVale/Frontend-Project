/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      document.documentElement.classList.add("dark")
      setDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)

    if (next) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 py-2 text-sm shadow"
    >
      {dark ? "Light" : "Dark"}
    </motion.button>
  )
}