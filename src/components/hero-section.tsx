"use client"

import { motion, type Variants } from "framer-motion"
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react"
import type { Profile } from "@/types"
import profileData from "@/data/profile.json"
import { useTranslations } from "@/components/language-provider"

const profile = profileData as Profile

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export function HeroSection() {
  const { t } = useTranslations()
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Layers for depth */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary to-bg-secondary" />
        <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-accent-crimson/5 blur-[120px]" />
        <div className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] rounded-full bg-accent-ember/5 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(to right, #EDEDF0 1px, transparent 1px),
                              linear-gradient(to bottom, #EDEDF0 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 via-transparent to-bg-primary/20" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-theme bg-bg-card/50 backdrop-blur-sm">
              <span className="relative flex w-2.5 h-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-crimson opacity-75" />
                <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-accent-crimson" />
              </span>
              <span className="text-sm font-medium text-secondary">
                {profile.subtitle}
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
              <span className="text-primary">{profile.name}</span>
              <br />
              <span className="bg-gradient-to-r from-accent-crimson via-accent-crimson-hover to-accent-ember bg-clip-text text-transparent">
                {profile.title}
              </span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-secondary max-w-xl mx-auto mb-12 leading-relaxed"
          >
            {profile.tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <button
              onClick={() => scrollTo("#experience")}
              className="btn-crimson group text-base"
            >
              {t("hero.cta.experience")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href={profile.resumeUrl}
              download
              className="btn-outline group"
            >
              <Download className="w-4 h-4" />
              {t("hero.cta.cv")}
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
            {[
              { href: profile.social.github, icon: Github, label: "GitHub" },
              { href: profile.social.linkedin, icon: Linkedin, label: "LinkedIn" },
              { href: `mailto:${profile.email}`, icon: Mail, label: "Email" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="p-3.5 rounded-xl border border-theme bg-bg-card/50 hover:bg-accent-crimson-subtle hover:border-accent-crimson/30 text-secondary hover:text-accent-crimson transition-all duration-200 hover:-translate-y-0.5"
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
    </section>
  )
}
