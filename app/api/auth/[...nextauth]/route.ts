import NextAuth from "next-auth/next"
import { NextAuthOptions, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { User } from "@/lib/types/user"

declare module "next-auth" {
    interface User {
        user: {
            id: number;
            name: string;
            email: string;
            createdAt: string;
            totalCarbon: number;
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
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(credentials),
                    })
                    
                    const user = await res.json()
                    
                    if (res.ok && user) {
                        return user
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
                token.user = {
                    ...user.user,
                    token: user.token
                };
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as Session['user'];
            return session;
        },
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 