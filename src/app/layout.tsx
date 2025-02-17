import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import "./app.css";

export const metadata: Metadata = {
  title: "Jeu Fanorona",
  description: "Bienvenue au jeu fanorona",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
