import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Car Consultancy | Expert Advice",
  description: "Get honest, unbiased car buying advice from experts.",
};

import { Navbar } from "@/components/ui/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fontSans.variable}>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
