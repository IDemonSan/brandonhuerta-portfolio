"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Github, Linkedin, CheckCircle, ArrowRight } from "lucide-react"
import type { Profile } from "@/types"
import profileData from "@/data/profile.json"
import { useTranslations } from "@/components/language-provider"

const profile = profileData as Profile

export function ContactSection() {
  const { t } = useTranslations()
  const emails = profile.emails?.length ? profile.emails : [profile.email]
  const phones = profile.phones?.length ? profile.phones : [profile.phone]

  const contactMethods = [
    {
      icon: Mail,
      label: t("contact.email.label"),
      value: emails[0],
      href: `mailto:${emails[0]}`,
      description: emails.length > 1 ? `${emails.length} ${t("contact.email.multiple")}` : t("contact.email.desc"),
    },
    {
      icon: Phone,
      label: t("contact.phone.label"),
      value: `+51 ${phones[0]}`,
      href: `https://wa.me/51${phones[0]}`,
      description: phones.length > 1 ? `${phones.length} ${t("contact.phone.multiple")}` : t("contact.phone.desc"),
    },
  ]

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: profile.social.github,
      description: t("contact.github.desc"),
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: profile.social.linkedin,
      description: t("contact.linkedin.desc"),
    },
  ]

  return (
    <section id="contact" className="section bg-bg-secondary/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">{t("contact.title")}</h2>
          <p className="section-subtitle">{t("contact.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Location - static card */}
            <div className="glass-card p-5 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-accent-crimson-subtle text-accent-crimson">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted mb-0.5">{t("contact.location")}</p>
                  <p className="font-medium text-primary">{profile.location}</p>
                  <p className="text-sm text-secondary mt-1">
                    {t("contact.location.desc")}
                  </p>
                </div>
              </div>
            </div>

            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <motion.a
                  key={method.label}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-5 group block hover:border-accent-crimson/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-accent-crimson-subtle text-accent-crimson group-hover:bg-accent-crimson group-hover:text-white transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted mb-0.5">{method.label}</p>
                      <p className="font-medium text-primary group-hover:text-accent-crimson transition-colors truncate">
                        {method.value}
                      </p>
                      <p className="text-sm text-secondary mt-1">{method.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted group-hover:text-accent-crimson group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100 self-center" />
                  </div>
                </motion.a>
              )
            })}
          </motion.div>

          {/* Professional Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Info Card */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-primary mb-4">{t("contact.info")}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-theme">
                  <span className="text-muted text-sm">{t("contact.ruc")}</span>
                  <span className="font-mono text-secondary text-sm">{profile.ruc}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-theme">
                  <span className="text-muted text-sm">{t("contact.rnp")}</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent-crimson-subtle text-accent-crimson border border-accent-crimson/20">
                    <CheckCircle className="w-3 h-3" />
                    {t("contact.rnp.active")}
                  </span>
                </div>
                <div className="py-3">
                  <span className="text-muted text-sm block mb-2">{t("contact.availability")}</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.availability.map((item) => (
                      <span key={item} className="badge badge-outline">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-primary mb-4">{t("contact.social")}</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center gap-3 p-4 rounded-xl border border-theme bg-bg-card/50 hover:bg-accent-crimson-subtle hover:border-accent-crimson/20 text-secondary hover:text-primary transition-all duration-200"
                    >
                      <Icon className="w-6 h-6" />
                      <div className="text-center">
                        <p className="font-medium text-sm">{social.label}</p>
                        <p className="text-xs text-muted">{social.description}</p>
                      </div>
                    </motion.a>
                  )
                })}
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <a
                href={`mailto:${profile.email}?subject=Contacto%20desde%20Portafolio`}
                className="btn-crimson w-full justify-center group text-base"
              >
                {t("contact.cta")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-center text-xs text-muted mt-3">
                {t("contact.response")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
