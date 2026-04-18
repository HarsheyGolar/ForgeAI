"use client"

import { useRef, useEffect, useState, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ThumbsUp, ThumbsDown, Copy, RefreshCw, Pencil, Share2, Check, FileText, Globe } from "lucide-react"
import { ForgeIcon } from "@/components/forge-logo"
import { Button } from "@/components/ui/button"
import type { Message, FileAttachment, ImageAttachment } from "@/lib/types"
import { formatFileSize } from "@/lib/types"
import { cn } from "@/lib/utils"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessagesProps {
  messages: Message[]
  isTyping: boolean
  isSearchingWeb?: boolean
  isGeneratingImage?: boolean
}

export function ChatMessages({ messages, isTyping, isSearchingWeb, isGeneratingImage }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [messages.length, isTyping])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 scroll-smooth [-webkit-overflow-scrolling:touch]"
      style={{
        // Maintain legacy scrollbar aesthetics
        scrollbarGutter: "stable",
      }}
    >
      <div className="max-w-3xl w-full mx-auto flex flex-col space-y-4 sm:space-y-6 pb-8">
        {messages.map((message) => {
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0 }}
              className={cn("flex w-full", message.role === "user" ? "justify-end" : "justify-start")}
            >
              {message.role === "user" ? (
                <MemoizedUserMessage
                  content={message.content}
                  files={message.files}
                  images={message.images}
                  webSearchUsed={message.webSearchUsed}
                />
              ) : (
                <MemoizedAssistantMessage content={message.content} />
              )}
            </motion.div>
          )
        })}

        {isSearchingWeb && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full justify-start"
          >
            <WebSearchIndicator />
          </motion.div>
        )}

        {isTyping && !isSearchingWeb && !isGeneratingImage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full justify-start"
          >
            <TypingIndicator />
          </motion.div>
        )}

        {isGeneratingImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex w-full justify-start"
          >
            <ImageGeneratingIndicator />
          </motion.div>
        )}
      </div>
    </div>
  )
}

interface UserMessageProps {
  content: string
  files?: FileAttachment[]
  images?: ImageAttachment[]
  webSearchUsed?: boolean
}

function UserMessage({ content, files, images, webSearchUsed }: UserMessageProps) {
  return (
    <div className="flex gap-2 sm:gap-3 justify-end">
      <div className="bg-forge-user-bubble rounded-2xl rounded-br-md px-3 sm:px-4 py-2.5 sm:py-3 max-w-[85%] sm:max-w-[70%]">
        {/* Web search badge */}
        {webSearchUsed && (
          <div className="flex items-center gap-1 mb-2 text-xs text-primary">
            <Globe className="h-3 w-3" />
            <span>Web search enabled</span>
          </div>
        )}

        {/* Images */}
        {images && images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((image) => (
              <picture key={image.id}>
                <source srcSet={image.url} type="image/avif" />
                <source srcSet={image.url} type="image/webp" />
                <img
                  src={image.url}
                  alt={image.name}
                  decoding="async"
                  className="max-w-50 max-h-50 rounded-lg object-cover"
                />
              </picture>
            ))}
          </div>
        )}

        {/* Files */}
        {files && files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-1.5 px-2 py-1 bg-background/50 rounded-md text-xs"
              >
                <FileText className="h-3 w-3 text-primary" />
                <span className="truncate max-w-25">{file.name}</span>
                <span className="text-muted-foreground">{formatFileSize(file.size)}</span>
              </div>
            ))}
          </div>
        )}

        {content && (
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{content}</p>
        )}
      </div>
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
        <span className="text-[10px] sm:text-xs font-bold text-white">H</span>
      </div>
    </div>
  )
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-3 rounded-lg overflow-hidden bg-forge-code-bg border border-border">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-muted/30 border-b border-border">
        <span className="text-xs text-muted-foreground">{lang || "code"}</span>
        <button
          className={cn(
            "text-xs flex items-center gap-1 transition-colors duration-200",
            copied ? "text-green-500" : "text-muted-foreground hover:text-foreground"
          )}
          onClick={handleCopy}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="copied"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                <span className="hidden sm:inline">Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
      <pre className="p-3 sm:p-4 overflow-x-auto">
        <code className="text-xs sm:text-sm font-mono text-foreground">{code.trim()}</code>
      </pre>
    </div>
  )
}

function AssistantMessage({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)
  const [displayedContent, setDisplayedContent] = useState("")
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (!content) return
    setDisplayedContent("")
    setIsAnimating(true)

    const words = content.split(" ")
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedContent(prev =>
          prev + (currentIndex === 0 ? "" : " ") + words[currentIndex]
        )
        currentIndex++
      } else {
        setIsAnimating(false)
        clearInterval(interval)
      }
    }, 25) // Smooth 25ms word-by-word delay

    return () => clearInterval(interval)
  }, [content])

  //  const isImageUrl = content?.startsWith("https://image.pollinations.ai")
  // const isImageUrl = content?.includes("https://image.pollinations.ai")
  // const imageUrl = content?.match(/https:\/\/image\.pollinations\.ai[^\s]*/)?.[0]
  const isImageUrl = content?.includes("pollinations.ai") ||
    content?.includes("localhost:8000/images")
  const imageUrl = content?.match(/(https?:\/\/[^\s]+)/)?.[0] || content

  if (isImageUrl) {
    return (
      <div className="flex gap-2 sm:gap-3">
        <ForgeIcon className="shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
        <div className="flex-1 min-w-0">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">🎨 Image Generated</p>
            <img
              src={imageUrl}
              alt="Generated"
              referrerPolicy="no-referrer"
              className="rounded-xl max-w-sm w-full border border-border shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
            <div className="flex gap-2">
              <Button size="sm" variant="outline"
                onClick={() => {
                  const a = document.createElement("a")
                  a.href = imageUrl || content
                  a.target = "_blank"
                  a.click()
                }}
              >
                Download
              </Button>
              <Button size="sm" variant="outline"
                onClick={() => navigator.clipboard.writeText(content)}
              >
                Copy URL
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-2 sm:gap-3">
      <ForgeIcon className="shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
      <div className="flex-1 min-w-0">
        <div className="prose prose-invert max-w-none text-sm text-foreground leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {isAnimating ? displayedContent : content}
          </ReactMarkdown>
          {isAnimating && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-[2px] h-[1.1em] bg-primary relative top-[2px] ml-1"
            />
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-0.5 sm:gap-1 mt-2 sm:mt-3">
          <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-7 sm:w-auto sm:px-2 p-0 text-muted-foreground hover:text-foreground">
            <ThumbsUp className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-7 sm:w-auto sm:px-2 p-0 text-muted-foreground hover:text-foreground">
            <ThumbsDown className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 sm:h-7 sm:w-auto sm:px-2 p-0 text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-7 sm:w-auto sm:px-2 p-0 text-muted-foreground hover:text-foreground">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-7 sm:w-auto sm:px-2 p-0 text-muted-foreground hover:text-foreground hidden sm:flex">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-7 sm:w-auto sm:px-2 p-0 text-muted-foreground hover:text-foreground hidden sm:flex">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Memoized components for Antigravity Protocol Phase 4 Streaming Re-render Isolation
const MemoizedUserMessage = memo(UserMessage, (prev, next) =>
  prev.content === next.content &&
  prev.webSearchUsed === next.webSearchUsed
)

const MemoizedAssistantMessage = memo(AssistantMessage, (prev, next) =>
  prev.content === next.content
)

function WebSearchIndicator() {
  return (
    <div className="flex gap-2 sm:gap-3">
      <ForgeIcon className="shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
      <div className="flex flex-col gap-1">
        <div className="bg-muted rounded-2xl rounded-bl-md px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-muted-foreground">Searching the web...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-2 sm:gap-3">
      <ForgeIcon className="shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
      <div className="flex flex-col gap-1">
        <div className="bg-muted rounded-2xl rounded-bl-md px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-muted-foreground/50 rounded-full typing-dot" />
            <span className="w-2 h-2 bg-muted-foreground/50 rounded-full typing-dot" />
            <span className="w-2 h-2 bg-muted-foreground/50 rounded-full typing-dot" />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">ForgeAI is thinking...</span>
      </div>
    </div>
  )
}

function ImageGeneratingIndicator() {
  return (
    <div className="flex gap-2 sm:gap-3">
      <ForgeIcon className="shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
      <div className="relative overflow-hidden rounded-2xl rounded-bl-md 
                      border border-violet-500/50 bg-card px-4 py-3
                      shadow-[0_0_15px_rgba(124,58,237,0.3)]">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] 
                        bg-gradient-to-r from-transparent via-violet-500/10 to-transparent" />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-lg">🎨</span>
          <span className="text-muted-foreground">Generating your image...</span>
        </div>
        <div className="flex gap-1 mt-2">
          <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
