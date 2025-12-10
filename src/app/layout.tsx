import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "K12Path - Your Family's 24/7 Education Consultant",
  description: "Empowering immigrant families to navigate the K-12 education system with confidence. Bilingual resources, school finder, vocabulary builder, and more.",
  keywords: ["K-12 education", "immigrant families", "Chinese education", "SSAT prep", "school finder", "bilingual education"],
  authors: [{ name: "K12Path" }],
  openGraph: {
    title: "K12Path - Your Family's 24/7 Education Consultant",
    description: "Empowering immigrant families to navigate the K-12 education system with confidence.",
    url: "https://k12path.com",
    siteName: "K12Path",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "K12Path - Your Family's 24/7 Education Consultant",
    description: "Empowering immigrant families to navigate the K-12 education system with confidence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-white text-gray-900">
        <LanguageProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
