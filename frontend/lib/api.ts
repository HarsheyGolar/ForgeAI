// import { getToken } from "./auth"

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://forgeai-em4m.onrender.com"

// async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
//     const token = getToken()
//     const headers = new Headers(options.headers || {})

//     if (token && !headers.has("Authorization")) {
//         headers.set("Authorization", `Bearer ${token}`)
//     }

//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//         ...options,
//         headers,
//     })

//     // Optional: Add global error handling here if unauthorized (401)
//     // if (response.status === 401) {
//     //   removeToken();
//     //   window.location.href = '/signin';
//     // }

//     return response
// }

// export const api = {
//     // Auth
//     async signup(data: any) {
//         const res = await fetch(`${BASE_URL}/auth/signup`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data),
//         })
//         return res.json()
//     },

//     async login(data: any) {
//         const res = await fetch(`${BASE_URL}/auth/login`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data),
//         })
//         return res.json()
//     },

//     async getGoogleAuthUrl() {
//         const res = await fetch(`${BASE_URL}/auth/google`)
//         return res.json()
//     },

//     async getMe() {
//         const res = await fetchWithAuth("/auth/me")
//         if (!res.ok) throw new Error("Invalid token")
//         return res.json()
//     },

//     // Chat
//     async chat(message: string) {
//         const res = await fetchWithAuth("/chat", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ message }),
//         })
//         return res.json() // { reply: string }
//     },

//     // OCR
//     async ocr(formData: FormData) {
//         const res = await fetchWithAuth("/ocr", {
//             method: "POST",
//             body: formData, // FormData doesn't need Content-Type header
//         })
//         return res.json()
//     },

//     // Generate Image
//     async generateImage(message: string) {
//         const res = await fetchWithAuth("/generate-image", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ message }),
//         })
//         return res.json() // { image_url: string, prompt: string, status: string }
//     },
// }

import { getToken } from "./auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://forgeai-em4m.onrender.com"

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = getToken()
    const headers: Record<string, string> = {}

    // Existing headers copy karo
    if (options.headers) {
        const existingHeaders = new Headers(options.headers)
        existingHeaders.forEach((value, key) => {
            headers[key] = value
        })
    }

    // Token safely encode karke set karo
    if (token) {
        try {
            // Token clean karo — sirf ASCII characters
            const cleanToken = token.trim().replace(/[^\x00-\x7F]/g, "")
            headers["Authorization"] = `Bearer ${cleanToken}`
        } catch (e) {
            console.error("Token encoding error:", e)
        }
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    })

    return response
}

export const api = {
    async signup(data: any) {
        const res = await fetch(`${BASE_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        return res.json()
    },

    async login(data: any) {
        // ✅ JSON — kyunki tera FastAPI Pydantic model use karta hai
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password
            }),
        })
        return res.json()
    },

    async getGoogleAuthUrl() {
        const res = await fetch(`${BASE_URL}/auth/google`)
        return res.json()
    },

    async getMe() {
        const res = await fetchWithAuth("/auth/me")
        if (!res.ok) throw new Error("Invalid token")
        return res.json()
    },

    async chat(message: string) {
        const res = await fetchWithAuth("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        })
        return res.json()
    },

    async ocr(formData: FormData) {
        const res = await fetchWithAuth("/ocr", {
            method: "POST",
            body: formData,
        })
        return res.json()
    },

    async generateImage(message: string) {
        const res = await fetchWithAuth("/generate-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        })
        return res.json()
    }
}

