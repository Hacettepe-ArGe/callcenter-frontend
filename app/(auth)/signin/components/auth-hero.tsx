import Link from "next/link";
import Image from "next/image";
export function AuthHero() {
    return (
        <div className="hidden md:flex md:w-1/2 lg:w-7/12 bg-sage flex-col p-10 text-forest justify-between">
            <div className="flex items-center gap-2">
                <Link href="/">
                    <span className="font-bold">
                        <Image src="/logo.png" alt="carbonbusters" width={100} height={100} />
                    </span>
                </Link>
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-text">
                    Create an account and start calculating your carbon footprint
                </h2>
                <p className="text-lg text-white/60">
                    Track and reduce your environmental impact with our carbon footprint calculator. Join our community and make a difference with your business today.
                </p>
            </div>
        </div>
    )
} 