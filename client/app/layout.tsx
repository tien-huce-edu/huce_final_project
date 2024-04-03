'use client'
import { ThemeProvider } from "./utils/theme-provider";
import { Josefin_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="./LOGO_DHXD.png" />
      </Head>
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat dark:bg-gradient-to-b  dark:from-gray-900 dark:to-black duration-300`}
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
