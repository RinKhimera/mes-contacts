import { dark } from "@clerk/themes"
import type { Appearance } from "@clerk/types"

// Couleurs pour le mode clair
const lightColors = {
  colorPrimary: "oklch(0.65 0.18 55)",
  colorBackground: "oklch(0.98 0.006 85)",
  colorInputBackground: "oklch(0.95 0.008 85)",
  colorInputText: "oklch(0.18 0.02 45)",
  colorText: "oklch(0.18 0.02 45)",
  colorTextSecondary: "oklch(0.45 0.02 45)",
  colorDanger: "oklch(0.55 0.22 25)",
}

// Couleurs pour le mode sombre
const darkColors = {
  colorPrimary: "oklch(0.75 0.16 65)",
  colorBackground: "oklch(0.18 0.02 155)",
  colorInputBackground: "oklch(0.22 0.03 155)",
  colorInputText: "oklch(0.95 0.008 85)",
  colorText: "oklch(0.95 0.008 85)",
  colorTextSecondary: "oklch(0.65 0.02 85)",
  colorDanger: "oklch(0.65 0.2 25)",
}

// Éléments communs aux deux thèmes (utilisent les CSS variables)
const commonElements = {
  card: "shadow-none bg-transparent",
  rootBox: "w-full",
  cardBox: "w-full shadow-none",
  formButtonPrimary:
    "bg-primary hover:bg-primary/90 text-primary-foreground font-medium",
  formFieldInput:
    "border-border bg-input focus:ring-primary focus:border-primary",
  footerActionLink: "text-primary hover:text-primary/80",
  headerTitle: "font-display",
  headerSubtitle: "text-muted-foreground",
  socialButtonsBlockButton:
    "border-border hover:bg-secondary/50 transition-colors",
  socialButtonsBlockButtonText: "font-medium",
  dividerLine: "bg-border",
  dividerText: "text-muted-foreground",
  formFieldLabel: "text-foreground font-medium",
  identityPreviewText: "text-foreground",
  identityPreviewEditButton: "text-primary hover:text-primary/80",
  otpCodeFieldInput: "border-border focus:border-primary",
  formResendCodeLink: "text-primary hover:text-primary/80",
  alert: "border-border",
  alertText: "text-foreground",
}

export function getClerkAppearance(resolvedTheme: string | undefined): Appearance {
  const isDark = resolvedTheme === "dark"

  return {
    baseTheme: isDark ? dark : undefined,
    variables: {
      ...(isDark ? darkColors : lightColors),
      borderRadius: "0.625rem",
      fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
    },
    elements: commonElements,
  }
}
