import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { User } from "@/lib/types/user"

declare module "next-auth" {
    interface Session {
        user: User
    }
    interface JWT {
        user: User
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    // For development purposes, allow specific dev login
                    if (credentials.email === "admin@dev.com") {
                        return {
                            email: "admin@dev.com",
                            role: "admin",
                        } as User
                    }

                    // Your normal authentication logic here
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(credentials),
                    });

                    const user = await response.json();
                    
                    if (user) {
                        return user as User;
                    }
                    return null;
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
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
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user as User;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        },
    }
})

export { handler as GET, handler as POST } 