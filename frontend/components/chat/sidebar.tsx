"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Pencil, Trash2, Settings, Moon, Sun, LogOut, PanelLeft } from "lucide-react"
import { useTheme } from "next-themes"
import { ForgeLogo } from "@/components/forge-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChatStore, groupChatsByDate } from "@/lib/chat-store"
import { cn } from "@/lib/utils"
import {useAuth} from "@/hooks/useAuth"

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  onToggle: () => void
  onOpenSettings: () => void
}

export function ChatSidebar({ isOpen, onClose, onToggle, onOpenSettings }: ChatSidebarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  const {
    chats,
    currentChatId,
    createChat,
    setCurrentChat,
    deleteChat,
    updateChatTitle
  } = useChatStore()

  const filteredChats = searchQuery
    ? chats.filter((chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : chats

  const groupedChats = groupChatsByDate(filteredChats)

  const handleNewChat = () => {
    createChat()
    onClose()
  }

  const handleSelectChat = (id: string) => {
    setCurrentChat(id)
    onClose()
  }

  const handleStartEdit = (id: string, title: string) => {
    setEditingId(id)
    setEditTitle(title)
  }

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      updateChatTitle(id, editTitle.trim())
    }
    setEditingId(null)
  }

  // Antigravity Hydration Match
  useEffect(() => {
    setMounted(true)
  }, [])

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("forgeai_user") || "{}") : {}
  const userName = mounted ? (user?.full_name || user?.email || "User") : "User"
  const userEmail = mounted ? (user?.email || "user@forgeai.com") : "user@forgeai.com"

  return (
    <>
      {/* Mobile overlay - dark backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50",
          "bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden",
          "transition-[width,transform] duration-300 ease-out",
          // Mobile state overrides
          "w-[85vw] max-w-[280px]",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop state overrides
          isOpen ? "lg:w-[260px]" : "lg:w-[56px]"
        )}
      >
        {/* Header Toggle Row */}
        <div className="flex items-center p-4 border-b border-sidebar-border min-h-[60px] relative">
          <div className={cn("absolute inset-y-0 left-4 right-14 flex items-center justify-between transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <ForgeLogo size="sm" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded hidden sm:inline">v1.0</span>
            </div>
          </div>

          {/* Antigravity SVG replacement constraint */}
          <button
            className={cn("absolute right-4 p-1 text-[#8B8BA7] hover:text-[#F8F8FF] transition-colors touch-manipulation flex-shrink-0 z-10", !isOpen && "right-auto")}
            onClick={onToggle}
            style={!isOpen ? { left: '16px' } : undefined}
          >
            <PanelLeft className="h-6 w-6" />
          </button>
        </div>

        {/* Content Wrapper constrained via masking */}
        <div className={cn("flex flex-col flex-1 overflow-y-auto overflow-x-hidden min-w-[260px] transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
          {/* New Chat Button */}
          <div className="p-3">
            <Button
              onClick={handleNewChat}
              className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 h-11 touch-manipulation"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Search */}
          <div className="px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                className="pl-9 h-10 bg-sidebar-accent text-base touch-manipulation"
                style={{ fontSize: "16px" }} // Prevent iOS zoom
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-2 [-webkit-overflow-scrolling:touch]">
            {groupedChats.map((group) => (
              <div key={group.label} className="mb-4">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  {group.label}
                </div>
                <div className="space-y-1">
                  {group.chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={cn(
                        "group flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors touch-manipulation",
                        currentChatId === chat.id
                          ? "bg-sidebar-accent border-l-2 border-primary"
                          : "hover:bg-sidebar-accent/50 active:bg-sidebar-accent"
                      )}
                      onClick={() => handleSelectChat(chat.id)}
                      style={{ minHeight: "44px" }}
                    >
                      {editingId === chat.id ? (
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleSaveEdit(chat.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(chat.id)
                            if (e.key === "Escape") setEditingId(null)
                          }}
                          className="h-8 text-sm"
                          style={{ fontSize: "16px" }}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <>
                          <span className="flex-1 text-sm truncate text-sidebar-foreground">
                            {chat.title}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-2 -m-1 text-muted-foreground hover:text-foreground touch-manipulation"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStartEdit(chat.id, chat.title)
                              }}
                              style={{ minWidth: "36px", minHeight: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              className="p-2 -m-1 text-muted-foreground hover:text-destructive touch-manipulation"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteChat(chat.id)
                              }}
                              style={{ minWidth: "36px", minHeight: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredChats.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                {searchQuery ? "No chats found" : "No chats yet. Start a new conversation!"}
              </div>
            )}
          </div>

          {/* User Panel */}
          <div className="border-t border-sidebar-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary-foreground">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 justify-start gap-2 h-10 touch-manipulation"
                onClick={onOpenSettings}
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 touch-manipulation"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {!mounted ? <div className="h-4 w-4 opacity-0" /> : (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground hover:text-destructive touch-manipulation"
                onClick={() => {
        localStorage.clear()
        document.cookie = "forgeai_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        window.location.href = "/signin"
    }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
