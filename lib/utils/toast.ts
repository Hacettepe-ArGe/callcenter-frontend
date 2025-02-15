import { toast } from "sonner"

export const notify = {
    success: (message: string) => {
        toast.success(message, {
            className: 'bg-mint border-sage text-forest',
            position: 'top-right',
        })
    },
    error: (message: string) => {
        toast.error(message, {
            className: 'bg-mint border-sage text-forest',
            position: 'top-right',
        })
    },
    info: (message: string) => {
        toast.info(message, {
            className: 'bg-mint border-sage text-forest',
            position: 'top-right',
        })
    }
} 