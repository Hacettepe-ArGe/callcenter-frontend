import { NextAuthOptions, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
    interface User {
        user: {
            id: number;
            name: string;
            email: string;
            createdAt: string;
            totalCarbon: number;
            token: string;
            points: number;
        };
        token: string;
        message: string;
    }

    interface Session {
        user: {
            id: number;
            name: string;
            email: string;
            createdAt: string;
            totalCarbon: number;
            token: string;
            points: number;
        }
        expires: string;
    }

    interface JWT {
        user: Session['user']
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter your email and password")
                }
                
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                        method: 'POST',
                        body: JSON.stringify(credentials),
                        headers: { "Content-Type": "application/json" }
                    })
                    
                    const userData = await res.json()

                    if (res.ok && userData) {
                        return {
                            ...userData,
                            user: {
                                ...userData.user,
                                token: userData.token
                            }
                        }
                    }

                    if (!res.ok) {
                        throw new Error(userData.message || "Invalid credentials")
                    }
                    
                    throw new Error("Invalid credentials")
                } catch (error: any) {
                    throw new Error(error.message || "Authentication failed")
                }
            }
        })
    ],
    pages: {
        signIn: '/signin',
        error: '/auth/error',
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    debug: process.env.NODE_ENV === 'development',
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user.user;
                token.accessToken = user.user.token;
            }
            return token;
        },
        async session({ session, token }) {
            if ('user' in token) {
                session.user = token.user as Session['user'];
                session.user.token = token.accessToken as string;
            }
            return session;
        },
    }
} 