import { DashboardNavbar } from "@/components/dashboard/navbar"
import { Container } from "@/components/ui/container"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DashboardNavbar />
      <main className="pt-[var(--navbar-height)] relative">
        <Container className="">
          {children}
        </Container>
      </main>
    </>
  )
} 