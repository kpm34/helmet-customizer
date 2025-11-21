import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Helmet Customizer R3F",
  description: "React Three Fiber self-hosted helmet customizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
