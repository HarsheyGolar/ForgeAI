"use client"

import { motion } from "framer-motion"
import { Code, Search, FileText, Palette } from "lucide-react"
import { ForgeLogo } from "@/components/forge-logo"

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void
}

const suggestions = [
  {
    icon: Code,
    title: "Write me a full-stack app",
    description: "Build a complete application with frontend and backend",
  },
  {
    icon: Search,
    title: "Search the web for latest AI news",
    description: "Find current information from across the internet",
  },
  {
    icon: FileText,
    title: "Analyze this document",
    description: "Extract insights from PDFs, images, or code files",
  },
  {
    icon: Palette,
    title: "Help me design a system",
    description: "Create architecture diagrams and technical designs",
  },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8 overflow-y-auto [-webkit-overflow-scrolling:touch]">
      <div className="max-w-2xl w-full text-center">
        {/* Logo with pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <div className="relative">
            <div className="absolute -inset-3 sm:-inset-4 bg-primary/20 rounded-full blur-xl animate-pulse-glow" />
            <div className="w-14 h-14 sm:w-20 sm:h-20">
              <ForgeLogo size="lg" showWordmark={false} />
            </div>
          </div>
        </motion.div>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-balance">
            {getGreeting()}, Harshey.
          </h1>
          <p className="mt-1.5 sm:mt-2 text-sm sm:text-lg text-muted-foreground">
            What shall we build today?
          </p>
        </motion.div>

        {/* Suggestion cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
        >
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestionClick(suggestion.title)}
              className="group flex items-start gap-3 p-3 sm:p-4 bg-card rounded-xl border border-border text-left transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 touch-manipulation"
              style={{ minHeight: "72px" }}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <suggestion.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-sm leading-tight">{suggestion.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{suggestion.description}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
