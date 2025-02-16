"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"
import { useUser } from "@/components/providers/user-provider"
import { Button } from "@/components/ui/button"
import { HomeIcon, BarChart3Icon, UserIcon, Menu, UsersIcon } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useClickAway } from "@/hooks/use-click-away"
import Image from "next/image"
import { colors } from "@/lib/constants/colors"
const navLinks = [
  {
    href: "/dashboard/consumptions",
    label: "Consumptions",
    icon: <BarChart3Icon className="h-4 w-4" />,
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: <UserIcon className="h-4 w-4" />,
  },
  {
    href: "/dashboard/workers",
    label: "Workers",
    icon: <UsersIcon className="h-4 w-4" />,
  },
]

export function DashboardNavbar() {
  const pathname = usePathname()
  const { user, logout } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useClickAway<HTMLDivElement>(() => setIsOpen(false))

  return (
    <nav className="h-[var(--navbar-height)] bg-cream/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <Container className="flex items-center justify-between h-full">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Carbonbusters" width={50} height={50} />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-forest hover:text-forest/80 text-sm font-medium tracking-wide transition-colors flex items-center gap-2",
                  pathname === link.href && "text-forest/80 bg-sage/20 px-4 py-2 rounded-md"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-forest hover:text-forest/80 text-sm font-medium tracking-wide transition-colors flex items-center gap-2"
          >
            <HomeIcon className="h-4 w-4" />
            <span className="hidden md:inline">Return to Home</span>
          </Link>

          <Link
            href="/dashboard/profile"
            className="text-forest hover:text-forest/80 text-sm font-medium tracking-wide transition-colors hidden md:flex items-center gap-2"
          >
            <UserIcon className="h-4 w-4" />
            Profile
          </Link>

          <Button
            variant="ghost"
            onClick={logout}
            className="text-sm hidden md:flex"
          >
            Sign out
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </Container>

      {/* Mobile menu */}
      {isOpen && (
        <div 
          ref={ref}
          className="absolute top-[var(--navbar-height)] left-0 right-0 bg-cream/95 backdrop-blur-sm shadow-lg md:hidden"
        >
          <Container>
            <div className="py-4 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-forest hover:text-forest/80 text-sm font-medium tracking-wide transition-colors px-4 py-2 flex items-center gap-2",
                    pathname === link.href && "text-forest/80 bg-sage/20"
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <Link
                href="/"
                    className="text-forest hover:text-forest/80 text-sm font-medium tracking-wide transition-colors px-4 py-2 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <HomeIcon className="h-4 w-4" />
                Return to Home
              </Link>
              <Link
                href="/dashboard/profile"
                className="text-forest hover:text-forest/80 text-sm font-medium tracking-wide transition-colors px-4 py-2 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <UserIcon className="h-4 w-4" />
                Profile
              </Link>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-sm w-full justify-start px-4 hover:bg-sage/20"
              >
                Sign out
              </Button>
            </div>
          </Container>
        </div>
      )}
    </nav>
  )
} 