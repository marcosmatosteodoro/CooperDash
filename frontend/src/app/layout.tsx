import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReduxProvider, LayoutProvider } from '@/providers/'
import { Header, Footer, PageHeader } from '@/components';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Novo front",
  description: "Teste Unicred",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <LayoutProvider>
            <div id="main-content" className="d-flex flex-column min-vh-100">
              <Header />
              <main className="flex-grow-1 container py-4 mt-5 pt-5">
                <PageHeader />

                <div className="card shadow-sm">
                  <div className="card-body">
                    { children }
                  </div>
                </div>

              </main>
              <Footer />
            </div>
          </LayoutProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
