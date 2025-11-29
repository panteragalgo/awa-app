export interface EmailTemplateData {
  nombre: string
  confirmation_url?: string
  login_url?: string
  reset_password_url?: string
  user_type?: "cliente" | "proveedor"
}

export type EmailTemplate = "cliente-bienvenida" | "proveedor-bienvenida" | "cuenta-activada" | "recuperacion-password"

export function getEmailTemplate(template: EmailTemplate): string {
  const templates: Record<EmailTemplate, string> = {
    "cliente-bienvenida": "/emails/cliente-bienvenida.html",
    "proveedor-bienvenida": "/emails/proveedor-bienvenida.html",
    "cuenta-activada": "/emails/cuenta-activada.html",
    "recuperacion-password": "/emails/recuperacion-password.html",
  }

  return templates[template]
}

export function replaceTemplateVariables(html: string, data: EmailTemplateData): string {
  let result = html

  if (data.user_type === "proveedor") {
    // Change blue gradients to green for providers
    result = result.replace(
      /linear-gradient$$135deg, #3B82F6 0%, #06B6D4 100%$$/g,
      "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    )
    result = result.replace(
      /linear-gradient$$135deg, #3B82F6 0%, #2563EB 100%$$/g,
      "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    )
    result = result.replace(/#3B82F6/g, "#10B981")
    result = result.replace(/#1e40af/g, "#065f46")
    result = result.replace(/#eff6ff/g, "#ecfdf5")
  }

  // Replace all template variables
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g")
    result = result.replace(regex, value || "")
  })

  return result
}

export const emailSubjects: Record<EmailTemplate, string> = {
  "cliente-bienvenida": "¡Bienvenido a AWA! 💧 Confirmá tu cuenta",
  "proveedor-bienvenida": "¡Bienvenido a AWA! 🏪 Confirmá tu cuenta de proveedor",
  "cuenta-activada": "✅ Tu cuenta AWA está activada",
  "recuperacion-password": "🔐 Recuperá tu contraseña de AWA",
}
