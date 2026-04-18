// // export const setToken = (token: string) => {
// //     if (typeof window !== "undefined") {
// //         localStorage.setItem("token", token)
// //         document.cookie = `token=${token}; path=/; max-age=86400;`
// //     }
// // }

// // export const getToken = (): string | null => {
// //     if (typeof window !== "undefined") {
// //         return localStorage.getItem("token")
// //     }
// //     return null
// // }

// // export const removeToken = () => {
// //     if (typeof window !== "undefined") {
// //         localStorage.removeItem("token")
// //         document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
// //     }
// // }

// const TOKEN_KEY = "forgeai_token"

// export const setToken = (token: string) => {
//     if (typeof window !== "undefined") {
//         localStorage.setItem(TOKEN_KEY, token)
//         document.cookie = `forgeai_token=${token}; path=/; max-age=86400;`
//     }
// }

// export const getToken = (): string | null => {
//     if (typeof window !== "undefined") {
//         return localStorage.getItem(TOKEN_KEY)
//     }
//     return null
// }

// export const removeToken = () => {
//     if (typeof window !== "undefined") {
//         localStorage.removeItem(TOKEN_KEY)
//         document.cookie = "forgeai_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
//     }
// }
const TOKEN_KEY = "forgeai_token"

export const setToken = (token: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, token)
        document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400; SameSite=Lax`
    }
}

export const getToken = (): string | null => {
    if (typeof window !== "undefined") {
        let token = localStorage.getItem("forgeai_token")
        if (token) {
            // Token clean karo
            token = token.trim().replace(/[^\x00-\x7F]/g, "")
            return token || null
        }
        // Cookie fallback
        const match = document.cookie.match(
            new RegExp('(^| )forgeai_token=([^;]+)')
        )
        if (match) {
            token = match[2].trim()
            localStorage.setItem("forgeai_token", token)
            return token
        }
    }
    return null
}

export const removeToken = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem("forgeai_user") // Also clear the user caching properly
        document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
    }
}
