import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { TravelProvider } from "@/context/TravelContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AuraTravel | Immersive 3D Nature & Luxury Travel Ecosystem",
  description: "Experience premium eco-tourism. Walk through lush forest canopies, flowing waterfalls, and misty peaks with our immersive 3D travel experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden transition-all duration-300">
        <ThemeProvider>
          <TravelProvider>
            {children}
          </TravelProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
