import type { Metadata } from "next";
import "./globals.css";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--raleway",
});

export const metadata: Metadata = {
  title: "MyDB",
  description: "Your readily-available storage solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} raleway antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
