export function AuthHero() {
    return (
        <div className="hidden md:flex md:w-1/2 lg:w-7/12 bg-sage flex-col p-10 text-forest justify-between">
            <div className="flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                <span className="font-bold">carbonbusters</span>
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