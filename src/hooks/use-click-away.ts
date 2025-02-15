import { useEffect, useRef } from "react"

export function useClickAway<T extends HTMLElement>(
    handler: (event: MouseEvent | TouchEvent) => void
) {
    const ref = useRef<T>(null)

    useEffect(() => {
        const handleClick = (event: MouseEvent | TouchEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler(event)
            }
        }

        document.addEventListener("mousedown", handleClick)
        document.addEventListener("touchstart", handleClick)

        return () => {
            document.removeEventListener("mousedown", handleClick)
            document.removeEventListener("touchstart", handleClick)
        }
    }, [handler])

    return ref
} 