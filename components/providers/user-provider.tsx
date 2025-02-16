"use client"

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"
import { createContext, useContext, useState, useEffect } from "react"
import { User, UserContextType } from "@/lib/types/user"
import { useRouter } from "next/navigation"
import { notify } from "@/lib/utils/toast"

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>
}

export function useUser() {
    const { data: session, status } = useSession()
    const router = useRouter()
    
    const user = session?.user as User | undefined

    const login = async (email: string, password: string) => {
        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                notify.error('Login failed')
                throw new Error(result.error)
            }

            notify.success('Successfully logged in!')
            router.push('/')
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    const setUser = async (userData: User) => {
        // For development purposes, we'll use a simplified login
        await login(userData.email, 'dummy-password')
    }

    const logout = async () => {
        await signOut({ redirect: false })
        notify.info('Logged out successfully')
        router.push('/signin')
    }

    return {
        user,
        setUser,
        login,
        logout,
        isAuthenticated: !!session?.user,
        isLoading: status === "loading"
    }
}

export function UserProviderOld({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check for existing session on mount
    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setIsLoading(false)
                return
            }

            // Here you would typically validate the token with your backend
            if (token === process.env.BYPASS_TOKEN) {
                setUser({
                    id: "1",
                    email: "admin@dev.com",
                })
            }
        } catch (error) {
            console.error('Auth check failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true)
            // Here you would typically make an API call to your backend
            // For now, we'll simulate a successful login
            const mockUser: User = {
                id: "1",
                email,
            }

            setUser(mockUser)
            notify.success('Successfully logged in!')
            router.push('/')
        } catch (error) {
            notify.error('Login failed')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        notify.info('Logged out successfully')
        router.push('/signin')
    }

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                isLoading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export function useUserOld() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
} 