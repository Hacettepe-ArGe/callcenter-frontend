import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    user: {
      id: number
      name: string
      email: string
      createdAt: string
      totalCarbon: number
      token: string
      points: number
    }
    token: string
    message: string
  }

  interface Session {
    user: {
      id: number
      name: string
      email: string
      createdAt: string
      totalCarbon: number
      token: string
      points: number
    }
    expires: string
  }

  interface JWT {
    user: Session['user']
    accessToken: string
  }
} 