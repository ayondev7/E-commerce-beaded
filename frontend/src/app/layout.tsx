import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beaded — Fine Jewellery from Bangladesh",
  description:
    "Beaded is a Bangladesh-based e-commerce platform offering handcrafted jewellery, wedding sets, and contemporary accessories made with love and local craftsmanship.",
  keywords: [
    "jewellery",
    "Bangladesh",
    "beaded",
    "handcrafted jewelry",
    "wedding jewelry",
    "gold",
    "silver",
    "beads",
  ],
  authors: [{ name: "Beaded", url: "https://yourdomain.example" }],
  openGraph: {
    title: "Beaded — Fine Jewellery from Bangladesh",
    description:
      "Discover handcrafted jewellery from Bangladesh. Shop wedding sets, everyday pieces, and custom designs at Beaded.",
    url: "https://yourdomain.example",
    siteName: "Beaded",
    images: [
      {
        url: "https://yourdomain.example/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Beaded — handcrafted jewellery",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beaded — Fine Jewellery from Bangladesh",
    description:
      "Shop handcrafted jewellery from Bangladesh — wedding sets, everyday pieces, and custom designs.",
    creator: "@beaded",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
