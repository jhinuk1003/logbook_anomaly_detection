import type { Metadata, Viewport } from "next";
import { Cinzel, Playfair_Display, Crimson_Pro, Courier_Prime } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const crimson = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const courier = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "LogBook Anomaly Detection | Victorian Glassmorphic Telemetry Engine",
  description:
    "Intelligent Network & System Log Telemetry Diagnostic Engine. Real-time statistical time-series outlier detection, root cause heatmaps, and dynamic severity scoring.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${playfair.variable} ${crimson.variable} ${courier.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-parchment antialiased selection:bg-amber-800 selection:text-amber-100 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
