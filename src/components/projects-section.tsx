"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github, ArrowRight, Map, Smartphone, Image, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Project } from "@/types"
import projectsData from "@/data/projects.json"

const projects = projectsData as Project[]

const projectIcons: Record<string, React.ElementType> = {
  "pos-copycenter": Smartphone,
  urbanview: Map,
  "pdf-converter": Image,
  "medical-system": Shield,
  "geoportal-seguridad": Map,
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Icon = projectIcons[project.id] || Shield

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="glass-card group overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-accent-crimson-subtle text-accent-crimson group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {project.badges?.map((badge) => (
              <span
                key={badge}
                className={cn(
                  "badge text-[0.65rem]",
                  badge === "En Desarrollo" && "badge-amber",
                  badge === "Conceptual" && "badge-outline",
                  (!badge.includes("Desarrollo") && !badge.includes("Conceptual")) && ""
                )}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-crimson transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-secondary mb-4 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Problem & Solution */}
      <div className="px-6 pb-4 space-y-3 flex-1">
        <div>
          <span className="text-[0.65rem] font-semibold text-muted uppercase tracking-widest">
            Problema
          </span>
          <p className="text-sm text-secondary mt-1 leading-relaxed">
            {project.problem}
          </p>
        </div>
        <div>
          <span className="text-[0.65rem] font-semibold text-muted uppercase tracking-widest">
            Solución
          </span>
          <p className="text-sm text-secondary mt-1 leading-relaxed">
            {project.solution}
          </p>
        </div>
      </div>

      {/* Technologies */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 5).map((tech) => (
            <span key={tech} className="tech-tag text-[0.65rem]">
              {tech}
            </span>
          ))}
          {project.technologies.length > 5 && (
            <span className="tech-tag text-[0.65rem]">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      {project.links && (
        <div className="px-6 pb-6 pt-4 border-t border-theme mt-auto">
          <div className="flex items-center gap-3">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex-1 justify-center py-2.5 text-sm"
              >
                <Github className="w-4 h-4" />
                Código
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-crimson flex-1 justify-center py-2.5 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Demo
              </a>
            )}
            {!project.links.github && !project.links.demo && (
              <span className="flex-1 text-center text-xs text-muted py-2.5">
                {project.badges?.includes("Conceptual")
                  ? "Proyecto conceptual — disponible bajo solicitud"
                  : "En proceso — pronto disponible"}
              </span>
            )}
          </div>
        </div>
      )}
    </motion.article>
  )
}

export function ProjectsSection() {
  return (
    <section id="projects" className="section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">Proyectos</h2>
          <p className="section-subtitle">
            Una mezcla de proyectos reales en producción y conceptos arquitectónicos.
            Cada uno resolviendo un problema concreto con un enfoque práctico.
          </p>
        </motion.div>

        {/* Featured Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects
            .filter((p) => p.featured)
            .map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </div>

        {/* Other Projects */}
        {projects.filter((p) => !p.featured).length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold text-primary">Otros Proyectos</h3>
              <div className="section-divider mt-4" />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects
                .filter((p) => !p.featured)
                .map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index + projects.filter((p) => p.featured).length}
                  />
                ))}
            </div>
          </>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/IDemonSan"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline group"
          >
            <Github className="w-4 h-4" />
            Ver más en GitHub
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
