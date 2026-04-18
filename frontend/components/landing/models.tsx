"use client"

import { motion } from "framer-motion"

const models = [
  { name: "GPT-4o", logo: "G" },
  { name: "Claude 3.5", logo: "C" },
  { name: "Gemini", logo: "G" },
  { name: "Llama", logo: "L" },
]

export function LandingModels() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-lg text-muted-foreground mb-10">
            Powered by the world&apos;s best AI models
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {models.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-3 text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-lg font-bold">{model.logo}</span>
                </div>
                <span className="text-lg font-medium">{model.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
