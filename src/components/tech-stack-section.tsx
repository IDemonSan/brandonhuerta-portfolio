"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Server, Monitor, Database, Wrench, Layout, ArrowRight } from "lucide-react"
import { techIcons } from "@/lib/tech-icons"
import { cn } from "@/lib/utils"
import type { TechCategory } from "@/types"
import techStackData from "@/data/tech-stack.json"
import { useTranslations } from "@/components/language-provider"

const techStack = techStackData as TechCategory[]

const categoryIcons: Record<string, React.ElementType> = {
  server: Server,
  monitor: Monitor,
  database: Database,
  wrench: Wrench,
  layout: Layout,
}

const techIconMap: Record<string, React.ElementType> = {
  Java: techIcons.SiOpenjdk,
  "Spring Boot": techIcons.SiSpringboot,
  "C#": techIcons.SiSharp,
  "ASP.NET MVC": techIcons.SiDotnet,
  Python: techIcons.SiPython,
  Flask: techIcons.SiFlask,
  JavaScript: techIcons.SiJavascript,
  TypeScript: techIcons.SiTypescript,
  React: techIcons.SiReact,
  "Next.js": techIcons.SiNextdotjs,
  "React Native": techIcons.SiReact,
  PostgreSQL: techIcons.SiPostgresql,
  PostGIS: techIcons.SiPostgresql,
  "SQL Server": techIcons.SiMysql,
  MySQL: techIcons.SiMysql,
  Git: techIcons.SiGit,
  Docker: techIcons.SiDocker,
  "Visual Studio": techIcons.SiVscodium,
  Leaflet: techIcons.SiLeaflet,
  FastAPI: techIcons.SiFastapi,
  "Node.js": techIcons.SiNodedotjs,
  Angular: techIcons.SiAngular,
  Vue: techIcons.SiVuedotjs,
}

export function TechStackSection() {
  const { t } = useTranslations()
  const [activeCategory, setActiveCategory] = useState(techStack[0].category)

  return (
    <section id="tech" className="section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">{t("tech.title")}</h2>
          <p className="section-subtitle">{t("tech.subtitle")}</p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {techStack.map((category) => {
            const Icon = categoryIcons[category.icon] || Server
            const isActive = activeCategory === category.category

            return (
              <button
                key={category.category}
                onClick={() => setActiveCategory(category.category)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-accent-crimson text-white shadow-[0_0_16px_rgba(220,38,38,0.3)]"
                    : "text-secondary hover:text-primary hover:bg-bg-elevated border border-theme"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{category.category}</span>
              </button>
            )
          })}
        </div>

        {/* Tech Grid */}
        <AnimatePresence mode="wait">
          {techStack.map((category) =>
            activeCategory === category.category ? (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl"
              >
                {category.items.map((tech, index) => {
                  const TechIcon = techIconMap[tech.name]
                  return (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="glass-card px-4 py-3.5 flex items-center gap-3 group hover:border-accent-crimson/20 transition-all duration-200 cursor-default"
                    >
                      {TechIcon ? (
                        <TechIcon className="w-5 h-5 text-accent-crimson/60 group-hover:text-accent-crimson transition-colors flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded bg-accent-crimson/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[0.5rem] font-bold text-accent-crimson">
                            {tech.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-primary group-hover:text-accent-crimson transition-colors">
                        {tech.name}
                      </span>
                    </motion.div>
                  )
                })}
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() =>
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors group"
          >
            {t("tech.cta")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
