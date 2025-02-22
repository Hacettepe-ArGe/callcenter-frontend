import type { Metadata } from "next";
import { Khand, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { UserProvider } from "@/components/providers/user-provider"

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const khand = Khand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-khand',
});

export const metadata: Metadata = {
  title: "Carbonbusters",
  description: "Track your CO₂ emissions and reduce your carbon footprint.",
  icons: {
    icon: '/logo.svg',
  },
};





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${khand.variable} font-poppins antialiased bg-cream text-forest`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
