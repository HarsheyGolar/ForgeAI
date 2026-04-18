// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { motion } from "framer-motion"
// import { Eye, EyeOff, Mail } from "lucide-react"
// import { ForgeLogo } from "@/components/forge-logo"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { api } from "@/lib/api"
// import { setToken } from "@/lib/auth"

// export default function SignInPage() {
//   const router = useRouter()
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//         const res = await api.login({
//             email: formData.email,
//             password: formData.password,
//         })

//         if (res.access_token) {
//             // Token save karo
//             localStorage.setItem("forgeai_token", res.access_token)

//             // Cookie manually set karo
//             document.cookie = `forgeai_token=${res.access_token}; path=/; max-age=86400; SameSite=Lax`

//             // 500ms wait karo cookie set hone ke liye
//             await new Promise(resolve => setTimeout(resolve, 500))

//             // Hard redirect — router.push nahi
//             window.location.href = "/chat"
//         } else {
//             alert(res.detail || "Failed to sign in")
//             setIsLoading(false)
//         }
//     } catch (e: any) {
//         alert("Invalid email or password")
//       alert("Failed to get Google auth URL")
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
//       {/* Animated gradient mesh background */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse-glow" />
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="relative z-10 w-full max-w-md"
//       >
//         {/* Glass card */}
//         <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-2xl">
//           {/* Logo */}
//           <div className="flex justify-center mb-8">
//             <ForgeLogo size="lg" />
//           </div>

//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
//             <p className="mt-2 text-muted-foreground">
//               Sign in to continue building with ForgeAI
//             </p>
//           </div>

//           {/* Google OAuth */}
//           <Button
//             variant="outline"
//             className="w-full h-12 text-base"
//             onClick={handleGoogleSignIn}
//             disabled={isLoading}
//           >
//             <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
//               <path
//                 fill="currentColor"
//                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//               />
//               <path
//                 fill="currentColor"
//                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//               />
//               <path
//                 fill="currentColor"
//                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//               />
//               <path
//                 fill="currentColor"
//                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//               />
//             </svg>
//             Continue with Google
//           </Button>

//           {/* Divider */}
//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-border" />
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-4 bg-card text-muted-foreground">or continue with email</span>
//             </div>
//           </div>

//           {/* Email form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   id="email"
//                   type="email"
//                   name="email"
//                   autoComplete="email"
//                   placeholder="you@example.com"
//                   className="pl-10 h-12"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="password">Password</Label>
//                 <Link
//                   href="/forgot-password"
//                   className="text-sm text-primary hover:text-primary/80"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   autoComplete="current-password"
//                   placeholder="Enter your password"
//                   className="pr-10 h-12"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full h-12 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
//               disabled={isLoading}
//             >
//               {isLoading ? "Signing in..." : "Sign In"}
//             </Button>
//           </form>

//           {/* Sign up link */}
//           <p className="mt-6 text-center text-sm text-muted-foreground">
//             New to ForgeAI?{" "}
//             <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
//               Create account →
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail } from "lucide-react"
import { ForgeLogo } from "@/components/forge-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { setToken } from "@/lib/auth"

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await api.login({
        email: formData.email,
        password: formData.password,
      })

      if (res.access_token) {
        // FIXED: Use centralized auth logic
        setToken(res.access_token)

        // Wait slightly for cookie persistence
        await new Promise(resolve => setTimeout(resolve, 500))

        // Hard redirect to refresh React Server Component State
        window.location.href = "/chat"
      } else {
        alert(res.detail || "Failed to sign in")
        setIsLoading(false)
      }
    } catch (e: any) {
      alert("Invalid email or password")
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://forge-ai-kohl.vercel.app/auth/callback"
        }
      })

      if (error) {
        alert("Google login failed!")
        setIsLoading(false)
      }
      // Supabase automatically redirect karega
    } catch (e) {
      alert("Failed!")
      setIsLoading(false)
    }
  }

  // NOTE: The rest of your UI JSX code remains EXACTLY the same here.
  // ... (Paste your exact existing return JSX here)
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glass card */}
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <ForgeLogo size="lg" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to continue building with ForgeAI
            </p>
          </div>

          {/* Google OAuth */}
          <Button
            variant="outline"
            className="w-full h-12 text-base"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="pl-10 h-12"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="pr-10 h-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to ForgeAI?{" "}
            <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
              Create account →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
