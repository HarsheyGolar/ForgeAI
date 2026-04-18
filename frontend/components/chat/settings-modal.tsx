"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import {
  User,
  Palette,
  Bot,
  Shield,
  Keyboard,
  Key,
  Moon,
  Sun,
  Monitor,
  Trash2,
  Download,
  AlertTriangle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useChatStore } from "@/lib/chat-store"
import { modelLabels, type Model } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "ai", label: "AI Preferences", icon: Bot },
  { id: "privacy", label: "Privacy & Data", icon: Shield },
  { id: "shortcuts", label: "Keyboard Shortcuts", icon: Keyboard },
  { id: "api", label: "API Keys", icon: Key },
]

const shortcuts = [
  { keys: ["Ctrl", "N"], action: "New chat" },
  { keys: ["Ctrl", "K"], action: "Search chats" },
  { keys: ["Ctrl", "/"], action: "Toggle sidebar" },
  { keys: ["Ctrl", ","], action: "Open settings" },
  { keys: ["Shift", "Enter"], action: "New line in message" },
  { keys: ["Enter"], action: "Send message" },
]

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const { theme, setTheme } = useTheme()
  const { selectedModel, setSelectedModel, webSearchEnabled, setWebSearchEnabled, chats } = useChatStore()
  
  const [fontSize, setFontSize] = useState(16)
  const [bubbleStyle, setBubbleStyle] = useState("bubbles")
  const [responseStyle, setResponseStyle] = useState("balanced")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[85vh] md:h-[600px] p-0 gap-0 overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar - Hidden on mobile, shown as horizontal scroll */}
          <div className="hidden md:flex flex-col w-52 border-r border-border bg-muted/30 p-2">
            <DialogHeader className="px-3 py-4">
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile tabs */}
          <div className="md:hidden flex overflow-x-auto border-b border-border p-2 gap-1 absolute top-14 left-0 right-0 bg-background z-10 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs whitespace-nowrap transition-colors touch-manipulation",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                style={{ minHeight: "44px" }}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 md:pt-6 pt-24">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Profile</h3>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-foreground">H</span>
                    </div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input id="displayName" defaultValue="Harshey Golar" className="h-11" style={{ fontSize: "16px" }} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center gap-2">
                        <Input id="email" defaultValue="harshey@forgeai.com" disabled className="h-11" style={{ fontSize: "16px" }} />
                        <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded whitespace-nowrap">Verified</span>
                      </div>
                    </div>
                    
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>Theme</Label>
                      <div className="flex gap-2">
                        {[
                          { value: "dark", icon: Moon, label: "Dark" },
                          { value: "light", icon: Sun, label: "Light" },
                          { value: "system", icon: Monitor, label: "System" },
                        ].map((option) => (
                          <Button
                            key={option.value}
                            variant={theme === option.value ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setTheme(option.value)}
                          >
                            <option.icon className="h-4 w-4 mr-2" />
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Font Size: {fontSize}px</Label>
                      <Slider
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                        min={12}
                        max={20}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Small</span>
                        <span>Large</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Chat Bubble Style</Label>
                      <Select value={bubbleStyle} onValueChange={setBubbleStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bubbles">Bubbles</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">AI Preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>Default Model</Label>
                      <Select value={selectedModel} onValueChange={(v) => setSelectedModel(v as Model)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(modelLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Response Style</Label>
                      <Select value={responseStyle} onValueChange={setResponseStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="concise">Concise</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Web Search by Default</Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Automatically search the web for up-to-date information
                        </p>
                      </div>
                      <Switch
                        checked={webSearchEnabled}
                        onCheckedChange={setWebSearchEnabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Privacy & Data</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Chat History</h4>
                          <p className="text-sm text-muted-foreground">
                            You have {chats.length} conversations
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear All
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Export Data</h4>
                          <p className="text-sm text-muted-foreground">
                            Download all your data as JSON
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-3 text-destructive mb-3">
                        <AlertTriangle className="h-5 w-5" />
                        <h4 className="font-medium">Danger Zone</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="destructive" size="sm">Delete Account</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shortcuts" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
                  
                  <div className="space-y-2">
                    {shortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <span className="text-sm">{shortcut.action}</span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, i) => (
                            <span key={i}>
                              <kbd className="px-2 py-1 bg-background border border-border rounded text-xs font-mono">
                                {key}
                              </kbd>
                              {i < shortcut.keys.length - 1 && (
                                <span className="text-muted-foreground mx-1">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">API Keys</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="openaiKey">OpenAI API Key</Label>
                      <Input
                        id="openaiKey"
                        type="password"
                        placeholder="sk-..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="anthropicKey">Anthropic API Key</Label>
                      <Input
                        id="anthropicKey"
                        type="password"
                        placeholder="sk-ant-..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="googleKey">Google AI API Key</Label>
                      <Input
                        id="googleKey"
                        type="password"
                        placeholder="AIza..."
                      />
                    </div>
                    
                    <Button className="mt-4">Save API Keys</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
