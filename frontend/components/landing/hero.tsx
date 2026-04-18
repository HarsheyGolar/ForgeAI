"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated gradient orb background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px]">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute inset-12 bg-primary/10 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-8"
          >
            <Sparkles className="h-4 w-4" />
            <span>Now with Web Search & File Analysis</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance"
          >
            The AI That Thinks,
            <br />
            <span className="text-primary">Builds</span>, and{" "}
            <span className="text-primary">Evolves</span> With You.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty"
          >
            ForgeAI is your intelligent workspace — chat, code, analyze, and create.
            Built for builders, thinkers, and makers.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg shadow-lg shadow-primary/25"
            >
              <Link href="/signup">
                Start for Free
                <span className="ml-2">→</span>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 text-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              See it in action
            </Button>
          </motion.div>

          {/* Chat Interface Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 md:mt-24 hidden sm:block"
          >
            <div className="relative mx-auto max-w-4xl">
              {/* Glow effect behind mockup */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-2xl" />
              
              {/* Mockup container */}
              <div className="relative bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
                {/* Window controls */}
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 text-center text-sm text-muted-foreground">ForgeAI</div>
                </div>
                
                {/* Chat content */}
                <div className="p-6 space-y-4">
                  {/* AI message */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary-foreground">F</span>
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-3 text-sm text-foreground max-w-md">
                      Hello! I&apos;m ForgeAI. How can I help you build something amazing today?
                    </div>
                  </div>
                  
                  {/* User message */}
                  <div className="flex gap-3 justify-end">
                    <div className="bg-forge-user-bubble rounded-lg px-4 py-3 text-sm text-foreground max-w-md">
                      Help me create a React dashboard with real-time analytics
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">H</span>
                    </div>
                  </div>
                  
                  {/* AI typing indicator */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary-foreground">F</span>
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full typing-dot" />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full typing-dot" />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full typing-dot" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Input bar mockup */}
                <div className="px-4 pb-4">
                  <div className="bg-muted/50 rounded-xl border border-border px-4 py-3 flex items-center gap-3">
                    <span className="text-muted-foreground text-sm">Message ForgeAI...</span>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <span className="text-primary text-lg">↑</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
