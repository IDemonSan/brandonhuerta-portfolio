/**
 * Lightweight i18n system without external dependencies.
 * Spanish is the default language. English translations provided.
 *
 * Usage:
 *   const { t } = useTranslations()
 *   <h1>{t('nav.home')}</h1>
 */

export type Locale = "es" | "en"

export const locales: Locale[] = ["es", "en"]
export const defaultLocale: Locale = "es"

type TranslationDict = Record<string, Record<Locale, string>>

export const dict: TranslationDict = {
  // Navigation
  "nav.home": { es: "Inicio", en: "Home" },
  "nav.experience": { es: "Trayectoria", en: "Experience" },
  "nav.projects": { es: "Proyectos", en: "Projects" },
  "nav.stack": { es: "Stack", en: "Stack" },
  "nav.contact": { es: "Contacto", en: "Contact" },

  // Hero section
  "hero.subtitle": { es: "Titulado por SENATI · RNP Activo para Consultorías del Estado Peruano", en: "SENATI Graduate · Active RNP for Peruvian Government Consulting" },
  "hero.cta.experience": { es: "Ver Trayectoria", en: "View Experience" },
  "hero.cta.cv": { es: "Descargar CV", en: "Download CV" },
  "hero.tagline": { es: "Código limpio, soluciones reales.", en: "Clean code, real solutions." },
  "hero.badge.subtitle": { es: "Titulado por SENATI · RNP Activo", en: "SENATI Graduate · Active RNP" },

  // About section
  "about.title": { es: "Sobre Mí", en: "About Me" },
  "about.subtitle": { es: "Desarrollador de Software titulado por SENATI, con experiencia construyendo sistemas para el sector público y privado. Esto es lo que hay detrás del código.", en: "Software Developer graduated from SENATI, experienced in building systems for the public and private sectors. Here's what's behind the code." },
  "about.skills": { es: "Tecnologías clave", en: "Key Technologies" },
  "about.education": { es: "Formación", en: "Education" },
  "about.showMore": { es: "más", en: "more" },
  "about.showLess": { es: "Mostrar menos", en: "Show less" },
  "about.metrics.exp": { es: "Experiencia Técnica", en: "Technical Experience" },
  "about.metrics.sectors": { es: "Sectores", en: "Sectors" },
  "about.metrics.stack": { es: "Stack Completo", en: "Full Stack" },
  "about.metrics.gis": { es: "Especialidad", en: "Specialty" },
  "about.metrics.arch": { es: "Arquitectura", en: "Architecture" },
  "about.exp.desc": { es: "Desarrollo profesional en sectores público y privado", en: "Professional development in public & private sectors" },
  "about.sectors.desc": { es: "Gubernamental y Corporativo", en: "Government & Corporate" },
  "about.stack.desc": { es: "Backend, Frontend y Bases de Datos", en: "Backend, Frontend & Databases" },
  "about.gis.desc": { es: "Sistemas de Información Geográfica y Analítica", en: "Geographic Information Systems & Analytics" },
  "about.arch.desc": { es: "Sistemas escalables orientados al negocio", en: "Scalable business-oriented systems" },

  // Experience section
  "experience.title": { es: "Trayectoria", en: "Experience" },
  "experience.subtitle": { es: "Experiencia real en sectores público y privado, construyendo sistemas que resuelven problemas concretos. Cada rol me ha enseñado algo distinto.", en: "Real experience in public and private sectors, building systems that solve concrete problems. Each role has taught me something different." },
  "experience.stack": { es: "Stack:", en: "Stack:" },
  "experience.cta": { es: "Descargar CV Completo", en: "Download Full CV" },

  // Projects section
  "projects.title": { es: "Proyectos", en: "Projects" },
  "projects.subtitle": { es: "Una mezcla de proyectos reales en producción y conceptos arquitectónicos. Cada uno resolviendo un problema concreto con un enfoque práctico.", en: "A mix of real production projects and architectural concepts. Each solving a concrete problem with a practical approach." },
  "projects.other": { es: "Otros Proyectos", en: "Other Projects" },
  "projects.problem": { es: "Problema", en: "Problem" },
  "projects.solution": { es: "Solución", en: "Solution" },
  "projects.code": { es: "Código", en: "Code" },
  "projects.demo": { es: "Demo", en: "Demo" },
  "projects.conceptual": { es: "Proyecto conceptual — disponible bajo solicitud", en: "Conceptual project — available upon request" },
  "projects.inProgress": { es: "En proceso — pronto disponible", en: "In progress — coming soon" },
  "projects.cta": { es: "Ver más en GitHub", en: "See more on GitHub" },

  // Tech Stack section
  "tech.title": { es: "Stack Técnico", en: "Tech Stack" },
  "tech.subtitle": { es: "Tecnologías con las que he trabajado en proyectos reales. Sin etiquetas de nivel — lo importante no es cuánto sabes, sino lo que puedes construir.", en: "Technologies I've worked with on real projects. No level labels — what matters isn't how much you know, but what you can build." },
  "tech.cta": { es: "¿Necesitas algo específico? Hablemos", en: "Need something specific? Let's talk" },

  // Contact section
  "contact.title": { es: "Contacto Profesional", en: "Professional Contact" },
  "contact.subtitle": { es: "Disponible para nuevos proyectos, consultorías y colaboraciones. Si tienes una idea o necesitas ayuda técnica, hablemos.", en: "Available for new projects, consulting, and collaborations. If you have an idea or need technical help, let's talk." },
  "contact.email.label": { es: "Correo Electrónico", en: "Email" },
  "contact.email.desc": { es: "Respuesta en menos de 24 horas", en: "Reply within 24 hours" },
  "contact.email.multiple": { es: "direcciones disponibles", en: "addresses available" },
  "contact.phone.label": { es: "Teléfono / WhatsApp", en: "Phone / WhatsApp" },
  "contact.phone.desc": { es: "Disponible para consultas rápidas", en: "Available for quick inquiries" },
  "contact.phone.multiple": { es: "números de contacto", en: "contact numbers" },
  "contact.location": { es: "Ubicación", en: "Location" },
  "contact.location.desc": { es: "Remoto · Híbrido · Presencial (Lima)", en: "Remote · Hybrid · On-site (Lima)" },
  "contact.ruc": { es: "RUC", en: "Tax ID" },
  "contact.rnp": { es: "RNP", en: "RNP" },
  "contact.rnp.active": { es: "Activo", en: "Active" },
  "contact.availability": { es: "Disponibilidad", en: "Availability" },
  "contact.info": { es: "Información Profesional", en: "Professional Info" },
  "contact.social": { es: "Redes Profesionales", en: "Professional Networks" },
  "contact.cta": { es: "Iniciar Conversación", en: "Start Conversation" },
  "contact.response": { es: "Respuesta garantizada en menos de 24 horas hábiles", en: "Guaranteed reply within 24 business hours" },
  "contact.github.desc": { es: "Código abierto y proyectos", en: "Open source & projects" },
  "contact.linkedin.desc": { es: "Perfil profesional y red", en: "Professional profile & network" },

  // Footer
  "footer.nav": { es: "Navegación", en: "Navigation" },
  "footer.connect": { es: "Conectar", en: "Connect" },
  "footer.rights": { es: "Todos los derechos reservados.", en: "All rights reserved." },
  "footer.madeWith": { es: "Hecho con", en: "Made with" },

  // Admin
  "admin.title": { es: "Admin", en: "Admin" },
  "admin.logout": { es: "Salir", en: "Logout" },
  "admin.saving": { es: "Guardando...", en: "Saving..." },
  "admin.save": { es: "Guardar", en: "Save" },
  "admin.new": { es: "+ Nuevo", en: "+ New" },
  "admin.delete": { es: "Eliminar", en: "Delete" },
  "admin.confirm": { es: "¿Eliminar", en: "Delete" },
  "admin.add": { es: "Agregar", en: "Add" },

  // GitHub integration
  "github.connect": { es: "Conectar con GitHub", en: "Connect with GitHub" },
  "github.connected": { es: "Conectado como", en: "Connected as" },
  "github.disconnect": { es: "Desconectar", en: "Disconnect" },
  "github.configure": { es: "Configurar Repositorio", en: "Configure Repository" },
  "github.owner": { es: "Owner (usuario o cuenta)", en: "Owner (user or org)" },
  "github.repo": { es: "Nombre del repositorio", en: "Repository name" },
  "github.branch": { es: "Rama (default: main)", en: "Branch (default: main)" },
  "github.noRepo": { es: "Sin configurar — los cambios se descargarán manualmente", en: "Not configured — changes will be downloaded manually" },
  "github.saving": { es: "Guardando...", en: "Saving..." },
  "github.saved": { es: "Guardado", en: "Saved" },
  "github.setup": { es: "Configuración de GitHub", en: "GitHub Setup" },
  "github.help.title": { es: "¿Cómo configurar GitHub?", en: "How to set up GitHub?" },
  "github.help.step1": { es: "1. Crea un OAuth App en GitHub Settings → Developer settings", en: "1. Create an OAuth App in GitHub Settings → Developer settings" },
  "github.help.step2": { es: "2. Copia el Client ID y genera un Client Secret", en: "2. Copy Client ID and generate a Client Secret" },
  "github.help.step3": { es: "3. Configúralos como variables de entorno en tu hosting:", en: "3. Set them as environment variables in your hosting:" },
  "github.help.step4": { es: "4. La URL de callback debe ser:", en: "4. The callback URL must be:" },
}

export function detectLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale
  const lang = navigator.language?.toLowerCase() || ""
  if (lang.startsWith("en")) return "en"
  return "es"
}

export function getTranslation(key: string, locale: Locale): string {
  const entry = dict[key]
  if (!entry) return key
  return entry[locale] || entry[defaultLocale] || key
}
