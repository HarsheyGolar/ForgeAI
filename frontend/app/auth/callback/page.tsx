// // "use client"

// // import { useEffect } from "react"
// // import { useRouter } from "next/navigation"

// // export default function AuthCallbackPage() {
// //     const router = useRouter()

// //     useEffect(() => {
// //         if (typeof window !== "undefined" && window.location.hash) {
// //             const hash = window.location.hash.substring(1)
// //             const params = new URLSearchParams(hash)
// //             const accessToken = params.get("access_token")

// //             if (accessToken) {
// //                 // FIXED: Use centralized auth logic if possible, or replicate correctly
// //                 localStorage.setItem("forgeai_token", accessToken)
// //                 document.cookie = `forgeai_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`

// //                 // Save user info by calling GET /auth/me with token
// //                 fetch("https://forgeai-em4m.onrender.com/auth/me", {
// //                     headers: {
// //                         Authorization: `Bearer ${accessToken}`
// //                     }
// //                 })
// //                     .then(res => res.json())
// //                     .then(user => {
// //                         localStorage.setItem("forgeai_user", JSON.stringify(user))

// //                         // FIXED: Wait for cookie persistence and hard redirect
// //                         setTimeout(() => {
// //                             window.location.href = "/chat"
// //                         }, 500)
// //                     })
// //                     .catch(err => {
// //                         console.error(err)
// //                         setTimeout(() => {
// //                             window.location.href = "/signin"
// //                         }, 500)
// //                     })
// //             } else {
// //                 window.location.href = "/signin"
// //             }
// //         } else {
// //             router.push("/signin")
// //         }
// //     }, [router])

// //     return (
// //         <div className="min-h-screen flex items-center justify-center bg-background flex-col gap-4">
// //             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
// //             <p className="text-muted-foreground text-sm">Authenticating...</p>
// //         </div>
// //     )
// // }

// "use client"

// import { useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { createClient } from "@supabase/supabase-js"

// export default function AuthCallbackPage() {
//     const router = useRouter()

//     useEffect(() => {
//         const handleCallback = async () => {
//             try {
//                 const supabase = createClient(
//                     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//                     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//                 )

//                 const { data, error } = await supabase.auth.exchangeCodeForSession(
//                     window.location.href
//                 )

//                 if (error || !data.session) {
//                     console.error("Auth error:", error)
//                     router.replace("/signin")
//                     return
//                 }

//                 const token = data.session.access_token

//                 localStorage.setItem("forgeai_token", token)
//                 document.cookie = `forgeai_token=${token}; path=/; max-age=86400; SameSite=Lax`

//                 if (data.user) {
//                     localStorage.setItem("forgeai_user", JSON.stringify({
//                         id: data.user.id,
//                         email: data.user.email,
//                         full_name: data.user.user_metadata?.full_name || data.user.email
//                     }))
//                 }

//                 router.replace("/chat")

//             } catch (err) {
//                 console.error("Callback error:", err)
//                 router.replace("/signin")
//             }
//         }

//         handleCallback()
//     }, [router])

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-background">
//             <div className="text-center space-y-4">
//                 <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
//                 <p className="text-muted-foreground">Signing you in...</p>
//             </div>
//         </div>
//     )
// }
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthCallbackPage() {
    const router = useRouter()

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const hash = window.location.hash.substring(1)
                const params = new URLSearchParams(hash)
                const access_token = params.get("access_token")

                if (access_token) {
                    // Token save karo
                    localStorage.setItem("forgeai_token", access_token)
                    document.cookie = `forgeai_token=${access_token}; path=/; max-age=86400; SameSite=Lax`

                    // User info save karo
                    try {
                        const res = await fetch("https://forgeai-em4m.onrender.com/auth/me", {
                            headers: {
                                Authorization: `Bearer ${access_token}`
                            }
                        })
                        const user = await res.json()
                        localStorage.setItem("forgeai_user", JSON.stringify(user))
                    } catch (e) {
                        console.log("User fetch failed, continuing...")
                    }

                    router.replace("/chat")
                } else {
                    router.replace("/signin")
                }
            } catch (err) {
                console.error("Callback error:", err)
                router.replace("/signin")
            }
        }

        handleCallback()
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground">Signing you in...</p>
            </div>
        </div>
    )
}