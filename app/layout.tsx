import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from '@/shared/components/providers';

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
  display: "swap",
  weight: ["400", "500",  "600", "700", "800", "900"],
 });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" data-rt="true" href="/logo.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        </body>
    </html>
  );
}
