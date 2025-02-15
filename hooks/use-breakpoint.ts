import { useState, useEffect } from 'react'
import { breakpoints } from '@/lib/constants/breakpoints'

type Breakpoint = keyof typeof breakpoints

export function useBreakpoint() {
    const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null)

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            
            if (width < parseInt(breakpoints.sm)) {
                setBreakpoint(null)
            } else if (width < parseInt(breakpoints.md)) {
                setBreakpoint('sm')
            } else if (width < parseInt(breakpoints.lg)) {
                setBreakpoint('md')
            } else if (width < parseInt(breakpoints.xl)) {
                setBreakpoint('lg')
            } else if (width < parseInt(breakpoints['2xl'])) {
                setBreakpoint('xl')
            } else {
                setBreakpoint('2xl')
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return breakpoint
} 