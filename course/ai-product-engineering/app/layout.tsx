import type { Metadata } from "next";
import "./globals.css";

const courseBasePath = "/course/ai-product-engineering";

export const metadata: Metadata = {
  metadataBase: new URL("https://jiangphtw.github.io"),
  title: "AI 產品工程｜從想法、程式到可靠上線",
  description:
    "12 單元、24 支雙語影音與一個可公開驗收的 AI 產品。補齊規格、評測、安全、測試、可觀測性與部署能力。",
  icons: { icon: `${courseBasePath}/favicon.svg` },
  alternates: { canonical: `${courseBasePath}/` },
  openGraph: {
    title: "AI 產品工程",
    description: "不只叫 AI 寫出 Demo，而是把產品做對、驗收、守住並可靠上線。",
    type: "website",
    locale: "zh_TW",
    url: `${courseBasePath}/`,
    images: [{ url: `${courseBasePath}/og.svg`, width: 1600, height: 900, alt: "AI 產品工程課程地圖" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
