"use client"

import Link from "next/link"
import { useUser } from "./providers/user-provider"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Container } from "./ui/container"
import { MenuIcon } from "./icons/menu"
import { Button } from "./ui/button"
import { useState } from "react"
import { useClickAway } from "@/hooks/use-click-away"

export function Navbar() {
    const { user, logout } = useUser()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const ref = useClickAway<HTMLDivElement>(() => setIsOpen(false))

    const navLinks = [
        {
            href: "/info",
            label: "INFO"
        },
        {
            href: "/facts",
            label: "FACTS"
        }
    ]

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-sm h-[var(--navbar-height)]">
            <Container>
                <div className="flex items-center justify-between h-full">
                    {/* Left side - Logo/Brand */}
                    <div className="flex-shrink-0">
                        <Link 
                            href="/" 
                            className={cn(
                                "text-forest hover:text-forest/80 font-medium",
                                pathname === "/" && "text-forest/80"
                            )}
                        >
                            Logo
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <Link 
                                key={link.href}
                                href={link.href} 
                                className={cn(
                                    "text-forest hover:text-forest/80 text-sm font-medium tracking-wide transition-colors",
                                    pathname === link.href && "text-forest/80"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user ? (
                            <Button
                                onClick={() => logout()}
                                className="bg-sage/20 hover:bg-sage/30 text-forest px-6 py-2 rounded-full text-sm font-medium transition-colors tracking-wide"
                            >
                                ÇIKIŞ YAP
                            </Button>
                        ) : (
                            <Link 
                                href="/signin"
                                className={cn(
                                    "bg-sage/20 hover:bg-sage/30 text-forest px-6 py-2 rounded-full text-sm font-medium transition-colors tracking-wide",
                                    pathname === "/signin" && "bg-sage/30"
                                )}
                            >
                                GİRİŞ YAP
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <MenuIcon className="h-6 w-6 text-forest" />
                    </button>
                </div>
            </Container>

            {/* Mobile Menu */}
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
                                        "text-forest hover:text-forest/80 text-sm font-medium tracking-wide transition-colors px-4 py-2",
                                        pathname === link.href && "text-forest/80 bg-sage/20"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {user ? (
                                <Button
                                    onClick={() => {
                                        logout()
                                        setIsOpen(false)
                                    }}
                                    className="bg-sage/20 hover:bg-sage/30 text-forest m-4 rounded-full text-sm font-medium transition-colors tracking-wide"
                                >
                                    ÇIKIŞ YAP
                                </Button>
                            ) : (
                                <Link 
                                    href="/signin"
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "bg-sage/20 hover:bg-sage/30 text-forest m-4 rounded-full text-sm font-medium transition-colors tracking-wide text-center py-2",
                                        pathname === "/signin" && "bg-sage/30"
                                    )}
                                >
                                    GİRİŞ YAP
                                </Link>
                            )}
                        </div>
                    </Container>
                </div>
            )}
        </nav>
    )
}
 