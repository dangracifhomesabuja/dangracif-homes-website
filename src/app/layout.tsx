import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ConditionalFloatingChat } from "@/components/common/conditional-floating-chat";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dangracif Homes | High Quality & Affordable Options",
  description:
    "Secure, serviced living in the heart of Kubwa. 1 & 2-bedroom apartments and 4-bedroom terraces from ₦55.5M.",
  icons: {
    icon: [
      { url: "/images/logo.png" },
      { url: "/icon.png" },
    ],
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`bg-[#FAFCFE] ${poppins.variable}`}>
      <body className={`${poppins.className} bg-[#FAFCFE] text-zinc-900 antialiased min-h-screen`}>
        {children}
        <ConditionalFloatingChat />
      </body>
    </html>
  );
}
