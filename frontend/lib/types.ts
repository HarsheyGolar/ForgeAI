export interface FileAttachment {
  id: string
  name: string
  size: number
  type: string
  url?: string // for preview
}

export interface ImageAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string // data URL for preview
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  files?: FileAttachment[]
  images?: ImageAttachment[]
  webSearchUsed?: boolean
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export type Model = "forgeai-auto" | "gpt-4o" | "claude-3.5" | "gemini-1.5" | "llama-3.1"

export const modelLabels: Record<Model, string> = {
  "forgeai-auto": "ForgeAI Auto",
  "gpt-4o": "GPT-4o",
  "claude-3.5": "Claude 3.5 Sonnet",
  "gemini-1.5": "Gemini 1.5 Pro",
  "llama-3.1": "Llama 3.1",
}

export const acceptedFileTypes = [
  ".pdf",
  ".txt",
  ".csv",
  ".js",
  ".ts",
  ".py",
  ".json",
  ".md",
]

export const acceptedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}
