"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Paperclip, ImageIcon, Globe, ChevronDown, Mic, Send, Bot, X, FileText, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useChatStore } from "@/lib/chat-store"
import { modelLabels, type Model, type FileAttachment, type ImageAttachment, formatFileSize, acceptedFileTypes, acceptedImageTypes } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string, files?: FileAttachment[], images?: ImageAttachment[], webSearch?: boolean) => void
  disabled?: boolean
}

const models: Model[] = ["forgeai-auto", "gpt-4o", "claude-3.5", "gemini-1.5", "llama-3.1"]

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")
  // Uncontrolled high-priority visual reference
  const messageRef = useRef("")
  const [files, setFiles] = useState<FileAttachment[]>([])
  const [images, setImages] = useState<ImageAttachment[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const { selectedModel, setSelectedModel, webSearchEnabled, setWebSearchEnabled } = useChatStore()

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px"
    }
  }, [message])

  // Handle paste for images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.startsWith("image/") && acceptedImageTypes.includes(item.type)) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) {
            handleImageFile(file)
          }
          break
        }
      }
    }

    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [])

  const handleImageFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newImage: ImageAttachment = {
        id: Math.random().toString(36).substring(2, 15),
        name: file.name,
        size: file.size,
        type: file.type,
        url: e.target?.result as string,
      }
      setImages(prev => [...prev, newImage])
    }
    reader.readAsDataURL(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return

    Array.from(selectedFiles).forEach(file => {
      const newFile: FileAttachment = {
        id: Math.random().toString(36).substring(2, 15),
        name: file.name,
        size: file.size,
        type: file.type,
      }
      setFiles(prev => [...prev, newFile])
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return

    Array.from(selectedFiles).forEach(file => {
      if (acceptedImageTypes.includes(file.type)) {
        handleImageFile(file)
      }
    })

    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(i => i.id !== id))
  }

  const handleSubmit = () => {
    const rawValue = messageRef.current || message
    if ((rawValue.trim() || files.length > 0 || images.length > 0) && !disabled) {
      onSend(rawValue.trim(), files.length > 0 ? files : undefined, images.length > 0 ? images : undefined, webSearchEnabled)
      setMessage("")
      messageRef.current = ""
      if (textareaRef.current) {
        textareaRef.current.value = ""
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real app, this would start/stop voice recording
  }

  const hasContent = messageRef.current.trim() || message.trim() || files.length > 0 || images.length > 0

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-3xl mx-auto px-2 py-1 sm:p-4">
        {/* Attachment previews */}
        <AnimatePresence>
          {(files.length > 0 || images.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-2 px-1"
            >
              {/* File chips */}
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-card border border-primary/30 rounded-full text-sm"
                >
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span className="text-foreground max-w-[120px] truncate">{file.name}</span>
                  <span className="text-muted-foreground text-xs">{formatFileSize(file.size)}</span>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-0.5 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </motion.div>
              ))}

              {/* Image previews */}
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative w-15 h-15 rounded-lg overflow-hidden border border-primary/30"
                >
                  <picture>
                    <source srcSet={image.url} type="image/avif" />
                    <source srcSet={image.url} type="image/webp" />
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </picture>
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Web Search active badge */}
        <AnimatePresence>
          {webSearchEnabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-1.5 mb-2 px-1"
            >
              <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 border border-primary/30 rounded-full text-xs text-primary">
                <Globe className="h-3 w-3" />
                <span>Web Search On</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={cn(
          "bg-card rounded-2xl border shadow-lg transition-all",
          isFocused ? "border-primary/50 ring-2 ring-primary/20" : "border-border"
        )}>
          {/* Top toolbar */}
          <div className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 pt-1.5 sm:pt-3 pb-1.5 sm:pb-2 border-b border-border/50 overflow-x-auto scrollbar-hide">
            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFileTypes.join(",")}
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              ref={imageInputRef}
              type="file"
              accept={acceptedImageTypes.join(",")}
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />

            <Button
              variant="ghost"
              size="sm"
              className="h-7 sm:h-8 px-1.5 sm:px-2 text-muted-foreground hover:text-foreground flex-shrink-0 min-w-[36px] sm:min-w-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
              <span className="ml-1.5 text-xs hidden sm:inline">Attach</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 sm:h-8 px-1.5 sm:px-2 text-muted-foreground hover:text-foreground flex-shrink-0 min-w-[36px] sm:min-w-0"
              onClick={() => imageInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4" />
              <span className="ml-1.5 text-xs hidden sm:inline">Image</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 sm:h-8 px-1.5 sm:px-2 flex-shrink-0 min-w-[36px] sm:min-w-0 transition-all",
                webSearchEnabled
                  ? "text-primary bg-primary/10 hover:bg-primary/20 shadow-[0_0_10px_rgba(124,58,237,0.3)]"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              title={webSearchEnabled ? "ForgeAI will search the internet" : "Enable web search"}
            >
              <Globe className="h-4 w-4" />
              <span className="ml-1.5 text-xs hidden sm:inline">Web</span>
            </Button>

            <div className="h-5 w-px bg-border mx-0.5 sm:mx-1 flex-shrink-0" />

            {/* Model selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 sm:h-8 px-1.5 sm:px-2 text-muted-foreground hover:text-foreground flex-shrink-0 min-w-[36px] sm:min-w-0">
                  <Bot className="h-4 w-4" />
                  <span className="ml-1.5 text-xs hidden sm:inline">{modelLabels[selectedModel]}</span>
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {models.map((model) => (
                  <DropdownMenuItem
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className={cn(
                      "cursor-pointer flex items-center justify-between",
                      selectedModel === model && "bg-primary/10 text-primary"
                    )}
                  >
                    <span>{modelLabels[model]}</span>
                    {selectedModel === model && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Input area */}
          <div className="flex items-end gap-2 px-2 py-1 sm:p-3">
            <textarea
              ref={textareaRef}
              defaultValue={""}
              onChange={(e) => {
                messageRef.current = e.target.value
                // Antigravity optimization: yield main thread, background sync
                if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                  requestIdleCallback(() => setMessage(e.target.value))
                } else {
                  setTimeout(() => setMessage(e.target.value), 0)
                }
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Message ForgeAI..."
              className="flex-1 bg-transparent resize-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[32px] sm:min-h-[44px] max-h-[200px] py-1.5 sm:py-2.5 leading-relaxed"
              style={{ fontSize: "16px" }} // Prevent iOS zoom
              rows={1}
              disabled={disabled}
            />

            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 sm:h-9 sm:w-9 transition-all relative",
                  isRecording
                    ? "text-destructive"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={toggleRecording}
              >
                {isRecording && (
                  <span className="absolute inset-0 rounded-lg border-2 border-destructive animate-ping opacity-30" />
                )}
                <Mic className="h-4 w-4" />
              </Button>

              <motion.div
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="icon"
                  className={cn(
                    "h-8 w-8 sm:h-9 sm:w-9 rounded-lg transition-all",
                    hasContent
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                  onClick={handleSubmit}
                  disabled={!hasContent || disabled}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <div className="mt-1 sm:mt-3 text-center">
          <p className="text-xs text-muted-foreground">
            ForgeAI may make mistakes. Verify important info.
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1 hidden sm:block">
            Developed by Harshey Golar
          </p>
        </div>
      </div>
    </div>
  )
}
