import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RouteHandler from "@/components/RouteHandler";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";

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
  title: "Web3 Wallet",
  description: "A modern and clean Web3 wallet",
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
        <ToastProvider>
          <RouteHandler>{children}</RouteHandler>
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  );
}
