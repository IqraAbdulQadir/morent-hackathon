import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "@/context/CartContext";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MORENT",
  description: "A car rental",
  icons: {
    icon: "/favicon.png", // Specify the favicon path here
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
