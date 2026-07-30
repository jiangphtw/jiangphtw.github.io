import type { Metadata } from "next";
import "./globals.css";

const courseBasePath = "/course/data-science";

export const metadata: Metadata = {
  metadataBase: new URL("https://jiangphtw.github.io"),
  title: "AI 資料科學家・完整學習地圖",
  description:
    "從零基礎到 AI 產品上線：24 週、40 支中英 YouTube 教材、20 組理論導讀與課後練習。",
  icons: {
    icon: `${courseBasePath}/favicon.svg`,
    shortcut: `${courseBasePath}/favicon.svg`,
  },
  alternates: { canonical: `${courseBasePath}/` },
  openGraph: {
    title: "AI 資料科學家・完整學習地圖",
    description: "24 週 · 40 支雙語教材 · 20 組課後練習 · 12 個作品",
    type: "website",
    url: `${courseBasePath}/`,
    images: [
      {
        url: `${courseBasePath}/og-light.png`,
        width: 1734,
        height: 909,
        alt: "AI 資料科學家完整學習地圖課程封面",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 資料科學家・完整學習地圖",
    description: "24 週 · 40 支雙語教材 · 20 組課後練習 · 12 個作品",
    images: [`${courseBasePath}/og-light.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
