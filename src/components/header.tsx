"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon, Github, Linkedin, Mail, Languages } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Profile } from "@/types"
import profileData from "@/data/profile.json"
import { usePathname } from "next/navigation"
import { useTranslations } from "@/components/language-provider"

const NAV_ITEMS = [
  { labelKey: "nav.home", href: "#hero" },
  { labelKey: "nav.experience", href: "#experience" },
  { labelKey: "nav.projects", href: "#projects" },
  { labelKey: "nav.stack", href: "#tech" },
  { labelKey: "nav.contact", href: "#contact" },
]

const profile = profileData as Profile

export function Header() {
  const { t, locale, setLocale } = useTranslations()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Hide header on admin pages
  if (pathname?.startsWith("/admin")) return null

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setIsScrolled(window.scrollY > 30)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 theme-transition",
        isScrolled
          ? "bg-bg-primary/80 backdrop-blur-xl border-b border-theme"
          : "bg-transparent"
      )}
    >
      <div className="container-custom flex items-center justify-between h-16 md:h-20">        {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 group"
          >
            <div
              className={cn(
                "relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center border shadow-sm",
                profile.headerImage
                  ? "bg-bg-elevated border-theme"
                  : "bg-accent-crimson border-transparent"
              )}
            >
              {profile.headerImage ? (
                <Image
                  src={profile.headerImage}
                  alt={profile.name}
                  width={36}
                  height={36}
                  className="object-contain p-1"
                />
              ) : (
                <span className="text-white font-bold text-sm relative z-10">
                  {profile.initials}
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-ember/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-semibold text-sm hidden sm:block text-primary">
              {profile.name}
            </span>
          </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors rounded-lg hover:bg-bg-elevated"
            >
              {t(item.labelKey)}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Social - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-bg-elevated transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-bg-elevated transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4.5 h-4.5" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-bg-elevated transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4.5 h-4.5" />
            </a>
          </div>

          {/* Language Switcher */}
          {mounted && (
            <button
              onClick={() => setLocale(locale === "es" ? "en" : "es")}
              className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-bg-elevated transition-colors text-xs font-medium"
              aria-label="Toggle language"
            >
              <Languages className="w-4.5 h-4.5" />
              <span className="sr-only">{locale === "es" ? "EN" : "ES"}</span>
            </button>
          )}

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-bg-elevated transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5 text-accent-ember" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5 text-accent-crimson" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-secondary hover:text-primary hover:bg-bg-elevated transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-theme bg-bg-primary/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="block w-full text-left px-4 py-3 text-secondary hover:text-primary hover:bg-bg-elevated rounded-lg transition-colors text-sm font-medium"
                >
                  {t(item.labelKey)}
                </button>
              ))}
              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-theme">
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-bg-elevated text-secondary hover:text-primary transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-sm">GitHub</span>
                </a>
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-bg-elevated text-secondary hover:text-primary transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
