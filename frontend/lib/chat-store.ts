// import { create } from "zustand"
// import type { Chat, Message, Model } from "./types"

// interface ChatState {
//   chats: Chat[]
//   currentChatId: string | null
//   selectedModel: Model
//   webSearchEnabled: boolean
//   isTyping: boolean
  
//   // Actions
//   createChat: () => string
//   deleteChat: (id: string) => void
//   setCurrentChat: (id: string | null) => void
//   addMessage: (chatId: string, message: Message) => void
//   updateChatTitle: (id: string, title: string) => void
//   setSelectedModel: (model: Model) => void
//   setWebSearchEnabled: (enabled: boolean) => void
//   setIsTyping: (isTyping: boolean) => void
//   getCurrentChat: () => Chat | undefined
// }

// const generateId = () => Math.random().toString(36).substring(2, 15)

// export const useChatStore = create<ChatState>((set, get) => ({
//   chats: [],
//   currentChatId: null,
//   selectedModel: "forgeai-auto",
//   webSearchEnabled: false,
//   isTyping: false,

//   createChat: () => {
//     const id = generateId()
//     const newChat: Chat = {
//       id,
//       title: "New Chat",
//       messages: [],
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }
//     set((state) => ({
//       chats: [newChat, ...state.chats],
//       currentChatId: id,
//     }))
//     return id
//   },

//   deleteChat: (id) => {
//     set((state) => {
//       const newChats = state.chats.filter((chat) => chat.id !== id)
//       return {
//         chats: newChats,
//         currentChatId: state.currentChatId === id 
//           ? (newChats.length > 0 ? newChats[0].id : null) 
//           : state.currentChatId,
//       }
//     })
//   },

//   setCurrentChat: (id) => {
//     set({ currentChatId: id })
//   },

//   addMessage: (chatId, message) => {
//     set((state) => ({
//       chats: state.chats.map((chat) =>
//         chat.id === chatId
//           ? {
//               ...chat,
//               messages: [...chat.messages, message],
//               updatedAt: new Date(),
//               // Update title based on first user message
//               title: chat.messages.length === 0 && message.role === "user"
//                 ? message.content.slice(0, 40) + (message.content.length > 40 ? "..." : "")
//                 : chat.title,
//             }
//           : chat
//       ),
//     }))
//   },

//   updateChatTitle: (id, title) => {
//     set((state) => ({
//       chats: state.chats.map((chat) =>
//         chat.id === id ? { ...chat, title } : chat
//       ),
//     }))
//   },

//   setSelectedModel: (model) => {
//     set({ selectedModel: model })
//   },

//   setWebSearchEnabled: (enabled) => {
//     set({ webSearchEnabled: enabled })
//   },

//   setIsTyping: (isTyping) => {
//     set({ isTyping })
//   },

//   getCurrentChat: () => {
//     const state = get()
//     return state.chats.find((chat) => chat.id === state.currentChatId)
//   },
// }))

// // Helper to group chats by date
// export function groupChatsByDate(chats: Chat[]) {
//   const now = new Date()
//   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
//   const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
//   const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
//   const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

//   const groups: { label: string; chats: Chat[] }[] = [
//     { label: "Today", chats: [] },
//     { label: "Yesterday", chats: [] },
//     { label: "Last 7 Days", chats: [] },
//     { label: "Last 30 Days", chats: [] },
//     { label: "Older", chats: [] },
//   ]

//   chats.forEach((chat) => {
//     const chatDate = new Date(chat.updatedAt)
//     if (chatDate >= today) {
//       groups[0].chats.push(chat)
//     } else if (chatDate >= yesterday) {
//       groups[1].chats.push(chat)
//     } else if (chatDate >= lastWeek) {
//       groups[2].chats.push(chat)
//     } else if (chatDate >= lastMonth) {
//       groups[3].chats.push(chat)
//     } else {
//       groups[4].chats.push(chat)
//     }
//   })

//   return groups.filter((group) => group.chats.length > 0)
// }

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Chat, Message, Model } from "./types"

interface ChatState {
  chats: Chat[]
  currentChatId: string | null
  selectedModel: Model
  webSearchEnabled: boolean
  isTyping: boolean
  
  createChat: () => string
  deleteChat: (id: string) => void
  setCurrentChat: (id: string | null) => void
  addMessage: (chatId: string, message: Message) => void
  updateChatTitle: (id: string, title: string) => void
  setSelectedModel: (model: Model) => void
  setWebSearchEnabled: (enabled: boolean) => void
  setIsTyping: (isTyping: boolean) => void
  getCurrentChat: () => Chat | undefined
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,
      selectedModel: "forgeai-auto",
      webSearchEnabled: false,
      isTyping: false,

      createChat: () => {
        const id = generateId()
        const newChat: Chat = {
          id,
          title: "New Chat",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: id,
        }))
        return id
      },

      deleteChat: (id) => {
        set((state) => {
          const newChats = state.chats.filter((chat) => chat.id !== id)
          return {
            chats: newChats,
            currentChatId: state.currentChatId === id
              ? (newChats.length > 0 ? newChats[0].id : null)
              : state.currentChatId,
          }
        })
      },

      setCurrentChat: (id) => set({ currentChatId: id }),

      addMessage: (chatId, message) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, message],
                  updatedAt: new Date(),
                  title: chat.messages.length === 0 && message.role === "user"
                    ? message.content.slice(0, 40) + (message.content.length > 40 ? "..." : "")
                    : chat.title,
                }
              : chat
          ),
        }))
      },

      updateChatTitle: (id, title) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === id ? { ...chat, title } : chat
          ),
        }))
      },

      setSelectedModel: (model) => set({ selectedModel: model }),
      setWebSearchEnabled: (enabled) => set({ webSearchEnabled: enabled }),
      setIsTyping: (isTyping) => set({ isTyping }),

      getCurrentChat: () => {
        const state = get()
        return state.chats.find((chat) => chat.id === state.currentChatId)
      },
    }),
    {
      name: "forgeai-chats", // localStorage key
      partialize: (state) => ({
        // Sirf ye save karo — isTyping save mat karo
        chats: state.chats,
        currentChatId: state.currentChatId,
        selectedModel: state.selectedModel,
      }),
    }
  )
)

// Helper to group chats by date
export function groupChatsByDate(chats: Chat[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const groups: { label: string; chats: Chat[] }[] = [
    { label: "Today", chats: [] },
    { label: "Yesterday", chats: [] },
    { label: "Last 7 Days", chats: [] },
    { label: "Last 30 Days", chats: [] },
    { label: "Older", chats: [] },
  ]

  chats.forEach((chat) => {
    const chatDate = new Date(chat.updatedAt)
    if (chatDate >= today) {
      groups[0].chats.push(chat)
    } else if (chatDate >= yesterday) {
      groups[1].chats.push(chat)
    } else if (chatDate >= lastWeek) {
      groups[2].chats.push(chat)
    } else if (chatDate >= lastMonth) {
      groups[3].chats.push(chat)
    } else {
      groups[4].chats.push(chat)
    }
  })

  return groups.filter((group) => group.chats.length > 0)
}