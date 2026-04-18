"use client"

import { useState, useCallback, useEffect } from "react"
import { PanelLeft, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChatSidebar } from "@/components/chat/sidebar"
import { ChatMessages } from "@/components/chat/messages"
import { ChatInput } from "@/components/chat/input"
import { EmptyState } from "@/components/chat/empty-state"
import { SettingsModal } from "@/components/chat/settings-modal"
import { ForgeLogo } from "@/components/forge-logo"
import { useChatStore } from "@/lib/chat-store"
import type { Message, FileAttachment, ImageAttachment } from "@/lib/types"
import { api } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

// Removed simulated AI responses

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }, [])

  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin")
    }
  }, [user, authLoading, router])

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isSearchingWeb, setIsSearchingWeb] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const {
    currentChatId,
    createChat,
    addMessage,
    setIsTyping,
    isTyping,
    getCurrentChat
  } = useChatStore()

  const currentChat = getCurrentChat()
  const messages = currentChat?.messages || []

  //   const handleSendMessage = useCallback(async (
  //     content: string,
  //     files?: FileAttachment[],
  //     images?: ImageAttachment[],
  //     webSearch?: boolean
  //   ) => {
  //     let chatId = currentChatId

  //     // Create a new chat if none exists
  //     if (!chatId) {
  //       chatId = createChat()
  //     }

  //     // Add user message
  //     const userMessage: Message = {
  //       id: Math.random().toString(36).substring(2, 15),
  //       role: "user",
  //       content,
  //       timestamp: new Date(),
  //       files,
  //       images,
  //       webSearchUsed: webSearch,
  //     }
  //     addMessage(chatId, userMessage)

  //     // Simulate web search if enabled
  //     if (webSearch) {
  //       setIsSearchingWeb(true)
  //     }

  //     setIsTyping(true)

  //     try {
  //       let aiResponseText = ""

  //       // if (files?.length || images?.length) {
  //       //   const fileObj = files?.[0] || images?.[0]
  //       //   if (fileObj?.url) {
  //       //     const blob = await fetch(fileObj.url).then(r => r.blob())
  //       //     const formData = new FormData()
  //       //     formData.append("file", blob, fileObj.name)
  //       //     const res = await api.ocr(formData)
  //       //     aiResponseText = res.extracted_text || "Found no text in this document."
  //       //   }
  //       // } else {
  //       //   const res = await api.chat(content)
  //       //   aiResponseText = res?.reply || res?.message || "Response not found..."
  //       // }

  //       if (files?.length || images?.length) {
  //     const fileObj = files?.[0] || images?.[0]
  //     if (fileObj?.url) {
  //         const blob = await fetch(fileObj.url).then(r => r.blob())
  //         const formData = new FormData()
  //         formData.append("file", blob, fileObj.name)
  //         const res = await api.ocr(formData)

  //         if (res.extracted_text) {
  //             aiResponseText = `📄 **File: ${fileObj.name}**\n\n${res.extracted_text}`
  //         } else if (res.detail) {
  //             aiResponseText = ` Error: ${res.detail}`
  //         } else {
  //             aiResponseText = "File padh nahi paya — sirf image/PDF supported hai!"
  //         }
  //     }
  // }


  //       if (aiResponseText?.startsWith("https://image.pollinations.ai")) {
  //         // Embed the image in markdown so standard renderers can potentially catch it
  //         // Or inject as image attachment
  //         const aiMessage: Message = {
  //           id: Math.random().toString(36).substring(2, 15),
  //           role: "assistant",
  //           content: aiResponseText, // the ChatMessages component will just render this string unless we store it elsewhere
  //           timestamp: new Date(),
  //         }
  //         addMessage(chatId, aiMessage)
  //         // Store as generated image globally in our UI for explicit rendering
  //         setGeneratedImage(aiResponseText)
  //       } else {
  //         setGeneratedImage(null)
  //         const aiMessage: Message = {
  //           id: Math.random().toString(36).substring(2, 15),
  //           role: "assistant",
  //           content: aiResponseText,
  //           timestamp: new Date(),
  //         }
  //         addMessage(chatId, aiMessage)
  //       }
  //     } catch (e) {
  //       console.error(e)
  //       const aiMessage: Message = {
  //         id: Math.random().toString(36).substring(2, 15),
  //         role: "assistant",
  //         content: "Sorry, I encountered an error. Please try again.",
  //         timestamp: new Date(),
  //       }
  //       addMessage(chatId, aiMessage)
  //     } finally {
  //       setIsTyping(false)
  //       setIsSearchingWeb(false)
  //     }
  //   }, [currentChatId, createChat, addMessage, setIsTyping])

  const handleSendMessage = useCallback(async (
    content: string,
    files?: FileAttachment[],
    images?: ImageAttachment[],
    webSearch?: boolean
  ) => {
    let chatId = currentChatId

    // Create a new chat if none exists
    if (!chatId) {
      chatId = createChat()
    }

    // --- Prepare the actual prompt for the LLM ---
    let finalPrompt = content
    let userMessageDisplayContent = content

    // Handle file OCR if a file is attached
    let extractedText = ""
    let fileName = ""

    if (files?.length || images?.length) {
      const fileObj = files?.[0] || images?.[0]
      if (fileObj?.url) {
        fileName = fileObj.name
        try {
          const blob = await fetch(fileObj.url).then(r => r.blob())
          const formData = new FormData()
          formData.append("file", blob, fileObj.name)
          const res = await api.ocr(formData)

          if (res.extracted_text) {
            extractedText = res.extracted_text
            // Build a meaningful prompt for the LLM
            finalPrompt = content
              ? `${content}\n\n---\n📄 File content (${fileName}):\n${extractedText}`
              : `📄 File: ${fileName}\n\n${extractedText}`
            // Display message shows the file was uploaded and maybe truncated text
            userMessageDisplayContent = content
              ? `${content}\n\n[File: ${fileName} uploaded]`
              : `[File uploaded: ${fileName}]`
          } else if (res.detail) {
            finalPrompt = `Error reading file: ${res.detail}`
            userMessageDisplayContent = `[File upload failed: ${res.detail}]`
          } else {
            finalPrompt = "File padh nahi paya — sirf image/PDF supported hai!"
            userMessageDisplayContent = finalPrompt
          }
        } catch (ocrError) {
          console.error("OCR failed:", ocrError)
          finalPrompt = "Sorry, I couldn't read that file."
          userMessageDisplayContent = finalPrompt
        }
      }
    }

    // Add user message (what the user sees in the chat UI)
    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 15),
      role: "user",
      content: userMessageDisplayContent,
      timestamp: new Date(),
      files,
      images,
      webSearchUsed: webSearch,
    }
    addMessage(chatId, userMessage)

    if (webSearch) setIsSearchingWeb(true)

    const isImagePrompt = content.toLowerCase().includes("generate") ||
      content.toLowerCase().includes("image") ||
      content.toLowerCase().includes("create")

    if (isImagePrompt) {
      setIsGeneratingImage(true)
    } else {
      setIsTyping(true)
    }

    try {
      // NOW call the AI with the final prompt (which includes OCR text)
      const chatResponse = await api.chat(finalPrompt)

      const aiReply = chatResponse?.reply || chatResponse?.message || "No response."

      // Check if the response is an image URL from Pollinations
      if (aiReply.startsWith("https://image.pollinations.ai")) {
        setGeneratedImage(aiReply)
      } else {
        setGeneratedImage(null)
      }

      // Add assistant message
      const aiMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        role: "assistant",
        content: aiReply,
        timestamp: new Date(),
      }
      addMessage(chatId, aiMessage)

    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      addMessage(chatId, errorMessage)
    } finally {
      setIsTyping(false)
      setIsSearchingWeb(false)
      setIsGeneratingImage(false)
    }
  }, [currentChatId, createChat, addMessage, setIsTyping])

  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleNewChat = () => {
    createChat()
  }

  return (
    <div className="h-dvh flex bg-background overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header - fixed */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-3 h-14 border-b border-border bg-background/95 backdrop-blur-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-[#8B8BA7]"
            onClick={() => setSidebarOpen(true)}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ForgeLogo size="sm" />
          </motion.div>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={handleNewChat}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </header>

        {/* Spacer for fixed header on mobile */}
        <div className="h-14 lg:hidden shrink-0" />

        {/* Chat content */}
        {messages.length === 0 ? (
          <EmptyState onSuggestionClick={(msg) => handleSendMessage(msg)} />
        ) : (
          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            isSearchingWeb={isSearchingWeb}
            isGeneratingImage={isGeneratingImage}
          />
        )}

        {/* Custom Generated Image Layout */}
        {generatedImage && (
          <div className="mx-auto max-w-3xl w-full px-4 mb-4">
            <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center border border-border">
              <img src={generatedImage} alt="Generated" className="max-w-xs md:max-w-md rounded-lg shadow-sm" />
              <div className="flex gap-4 mt-4">
                <Button onClick={() => {
                  const a = document.createElement("a")
                  a.href = generatedImage
                  a.download = "generated-image.jpg"
                  a.target = "_blank"
                  a.click()
                }}>Download</Button>
                <Button variant="outline" onClick={() => {
                  navigator.clipboard.writeText(generatedImage)
                }}>Copy URL</Button>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <ChatInput
          onSend={handleSendMessage}
          disabled={isTyping || isSearchingWeb}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </div>
  )
}
