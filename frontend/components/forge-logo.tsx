"use client"

import { cn } from "@/lib/utils"

interface ForgeLogoProps {
  className?: string
  showWordmark?: boolean
  size?: "sm" | "md" | "lg"
}

export function ForgeLogo({ className, showWordmark = true, size = "md" }: ForgeLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }
  
  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Forge hammer + AI spark icon */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="forgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main icon background */}
          <rect
            x="2"
            y="2"
            width="28"
            height="28"
            rx="8"
            fill="url(#forgeGradient)"
          />
          
          {/* Forge "F" with spark */}
          <path
            d="M10 8h12v3h-9v4h7v3h-7v6h-3V8z"
            fill="white"
            filter="url(#glow)"
          />
          
          {/* AI Spark */}
          <circle cx="24" cy="8" r="2" fill="white" opacity="0.9" />
          <path
            d="M23 6l1-2 1 2M26 7l2 1-2 1M23 10l1 2 1-2"
            stroke="white"
            strokeWidth="0.75"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </div>
      
      {showWordmark && (
        <span className={cn("font-semibold tracking-tight text-foreground", textSizes[size])}>
          Forge<span className="text-primary">AI</span>
        </span>
      )}
    </div>
  )
}

export function ForgeIcon({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 sm:w-5 sm:h-5"
      >
        <path
          d="M6 4h20v5H11v6h12v5H11v10H6V4z"
          fill="white"
        />
      </svg>
    </div>
  )
}
