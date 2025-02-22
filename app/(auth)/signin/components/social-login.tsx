import { Button } from "@/components/ui/button"
import { GoogleIcon } from "@/components/icons/google"

export function SocialLogin() {
    return (
        <>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            <Button variant="outline" className="w-full cursor-not-allowed">
                <GoogleIcon />
                Sign in with Google
            </Button>
        </>
    )
} 