import NextAuth from "next-auth/next"
import { NextAuthOptions } from "next-auth"
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

interface ExtendedToken {
    id: number;
    name: string;
    email: string;
    token: string;
    points: number;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) return null
                
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
                    return null
                } catch (error) {
                    console.error('Auth error:', error)
                    return null
                }
            }
        })
    ],
    pages: {
        signIn: '/signin',
        // signOut: '/auth/signout',
        // error: '/auth/error',
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

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 