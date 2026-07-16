import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wichtelorganisator",
  description: "Hier organisieren sich die Wichtel vom Weihnachtsgrinch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} antialiased dark`}
    >
      <body className="min-h-screen flex flex-col bg-neutral-950 text-neutral-50 font-sans selection:bg-neutral-800">
        <div className="fixed inset-0 -z-10 h-full w-full bg-neutral-950"></div>
        {children}
      </body>
    </html>
  );
}
