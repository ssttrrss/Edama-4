"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface AnimatedContainerProps {
  children: ReactNode
  animation: "fadeIn" | "slideUp" | "slideIn" | "scale" | "bounce"
  duration?: number
  delay?: number
  className?: string
}

export function AnimatedContainer({
  children,
  animation,
  duration = 0.5,
  delay = 0,
  className = "",
}: AnimatedContainerProps) {
  // Define animation variants
  const variants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration, delay } },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration, delay } },
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0, transition: { duration, delay } },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1, transition: { duration, delay } },
    },
    bounce: {
      initial: { opacity: 0, y: 20 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          duration,
          delay,
          type: "spring",
          stiffness: 300,
          damping: 15,
        },
      },
    },
  }

  const selectedVariant = variants[animation]

  return (
    <motion.div initial={selectedVariant.initial} animate={selectedVariant.animate} className={className}>
      {children}
    </motion.div>
  )
}
