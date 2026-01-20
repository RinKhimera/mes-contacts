import { Variants, Transition } from "framer-motion"

// Transitions réutilisables
export const easeOutTransition: Transition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1],
}

// Variants réutilisables
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeOutTransition,
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: easeOutTransition,
  },
}

export const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-8, 0, -8],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

export const floatDelayed: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1,
    },
  },
}

// Container avec stagger pour les enfants
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

// Dots avec apparition dispersée
export const scatteredDots: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: [0.3, 0.6, 0.4, 0.5, 0.35][i % 5],
    scale: 1,
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
}
