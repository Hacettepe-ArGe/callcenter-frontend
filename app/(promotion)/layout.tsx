import { Navbar } from "@/components/navbar"
import { Container } from "@/components/ui/container"

export default function PromotionLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 h-full min-h-screen-navbar flex justify-center items-center">
                <Container>
                    {children}
                </Container>
            </main>
        </div>
    )
} 