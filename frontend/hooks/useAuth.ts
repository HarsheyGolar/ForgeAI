// // import { useState, useEffect } from "react"
// // import { useRouter } from "next/navigation"
// // import { api } from "@/lib/api"
// // import { getToken, removeToken } from "@/lib/auth"

// // export function useAuth() {
// //     const router = useRouter()
// //     const [user, setUser] = useState<any>(null)
// //     const [isLoading, setIsLoading] = useState(true)

// //     useEffect(() => {
// //         const fetchUser = async () => {
// //             const token = getToken()
// //             if (!token) {
// //                 setIsLoading(false)
// //                 return
// //             }

// //             try {
// //                 const userData = await api.getMe()
// //                 setUser(userData)
// //             } catch (error) {
// //                 // Token invalid or expired
// //                 removeToken()
// //                 setUser(null)
// //             } finally {
// //                 setIsLoading(false)
// //             }
// //         }

// //         fetchUser()
// //     }, [])

// //     const logout = () => {
// //         removeToken()
// //         setUser(null)
// //         router.push("/signin")
// //     }

// //     return {
// //         user,
// //         isLoading,
// //         isAuthenticated: !!user,
// //         logout,
// //     }
// // }

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { api } from "@/lib/api"
// import { getToken, removeToken } from "@/lib/auth"

// export function useAuth() {
//     const router = useRouter()
//     const [user, setUser] = useState<any>(null)
//     const [isLoading, setIsLoading] = useState(true)

//     useEffect(() => {
//         const fetchUser = async () => {
//             const token = getToken()

//             // Token hi nahi hai
//             if (!token) {
//                 setIsLoading(false)
//                 return
//             }

//             try {
//                 const userData = await api.getMe()
//                 setUser(userData)
//             } catch (error) {
//                 console.error("getMe failed:", error)

//                 // ⚠️ Token remove mat karo — 
//                 // Sirf locally saved user check karo
//                 const savedUser = localStorage.getItem("forgeai_user")
//                 if (savedUser) {
//                     try {
//                         setUser(JSON.parse(savedUser))
//                     } catch {
//                         removeToken()
//                         setUser(null)
//                     }
//                 } else {
//                     // Last resort — token hai toh basic user banao
//                     setUser({ email: "user", id: "local" })
//                 }
//             } finally {
//                 setIsLoading(false)
//             }
//         }

//         fetchUser()
//     }, [])

//     const logout = () => {
//         removeToken()
//         localStorage.removeItem("forgeai_user")
//         setUser(null)
//         router.push("/signin")
//     }

//     return {
//         user,
//         isLoading,
//         isAuthenticated: !!user,
//         logout,
//     }
// }
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { getToken, removeToken } from "@/lib/auth"

export function useAuth() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            const token = getToken()

            if (!token) {
                // FIXED: Clear cookie if localStorage is completely absent to sever the loop totally
                removeToken()
                setIsLoading(false)
                return
            }

            try {
                const userData = await api.getMe()
                setUser(userData)
                // Cache user in localStorage to match the fallback expectation
                localStorage.setItem("forgeai_user", JSON.stringify(userData))
            } catch (error) {
                console.error("getMe failed:", error)

                const savedUser = localStorage.getItem("forgeai_user")
                if (savedUser) {
                    try {
                        setUser(JSON.parse(savedUser))
                    } catch {
                        removeToken()
                        setUser(null)
                    }
                } else {
                    // FIXED: Last resort — if both token fails and no cached user, log out thoroughly
                    removeToken()
                    setUser(null)
                }
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [])

    const logout = () => {
        removeToken()
        setUser(null)
        router.push("/signin")
    }

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
    }
}
