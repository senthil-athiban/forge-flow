import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PublicRoute from "@/routes/PublicRoute";
import { Toaster } from "sonner";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://forge-flow.live"),
  title: {
    default: "ForgeFlow - Automation Made Simple",
    template: "%s | ForgeFlow"
  },
  description: "Connect and automate your apps without code. Build powerful workflows in minutes with ForgeFlow's intuitive no-code automation platform.",
  applicationName: "ForgeFlow",
  keywords: [
    "no-code automation", 
    "workflow builder", 
    "app integration", 
    "productivity tool", 
    "workflow automation",
    "no-code platform"
  ],
  authors: [{ name: "ForgeFlow Team" }],
  creator: "ForgeFlow",
  publisher: "ForgeFlow",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://forge-flow.live",
    title: "ForgeFlow - Automation Made Simple",
    description: "Connect and automate your apps without code. Build powerful workflows in minutes.",
    siteName: "ForgeFlow",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ForgeFlow - No-Code Automation Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ForgeFlow - Automation Made Simple",
    description: "Connect and automate your apps without code. Build powerful workflows in minutes.",
    site: "@forgeflow",
    creator: "@forgeflow",
    images: ["/og-image.png"]
  },
  alternates: {
    canonical: "https://forge-flow.live"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100`}>
        <Toaster />
        <PublicRoute>
          {children}
        </PublicRoute>
      </body>
    </html>
  );
}
