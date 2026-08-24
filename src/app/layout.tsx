import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "آینه | فروشگاه محصولات آرایشی بهداشتی و مراقبت از پوست - نمایندگی تراست",
  description: "فروشگاه اینترنتی آینه، مرجع تخصصی محصولات آرایشی بهداشتی، سرم تراست، کرم تراست، ضد آفتاب تراست، عطر تراست و محصولات مراقبت از پوست و مو با ضمانت اصالت کالا.",
  keywords: [
    "آینه",
    "ayeneh",
    "Ayeneh",
    "Ayene",
    "ayene",
    "تراست",
    "تر است",
    "trust",
    "trast",
    "trest",
    "trst",
    "محصولات آرایشی بهداشتی",
    "مراقبت از پوست",
    "مراقبت از مو",
    "روتین پوستی",
    "سرم تراست",
    "کرم تراست",
    "ضد آفتاب تراست",
    "عطر تراست",
    "شوینده تراست",
    "Trust skincare",
    "فروشگاه آینه",
    "خرید آنلاین لوازم آرایشی",
    "محصولات سلامت",
  ],
  authors: [{ name: "Ayeneh Shop" }],
  openGraph: {
    title: "آینه | فروشگاه محصولات آرایشی بهداشتی - نمایندگی تراست",
    description: "مرجع تخصصی محصولات آرایشی بهداشتی و مراقبت از پوست با برندهای معتبر جهانی",
    type: "website",
    locale: "fa_IR",
  },
};

// ✅ اصلاح شد: استفاده از React.ReactNode به جای LayoutProps اشتباه
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd />
        <AuthProvider>{children}</AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
