import type { Metadata } from "next";
import "./globals.css";

const courseBasePath = "/course/design-thinking";

export const metadata: Metadata = {
  metadataBase: new URL("https://jiangphtw.github.io"),
  title: "設計思考｜從洞察到可測試的解法",
  description:
    "6 週、12 單元的設計思考實作課：研究真實需求、定義問題、發想、製作原型、測試並完成可展示的服務提案。",
  alternates: { canonical: `${courseBasePath}/` },
  openGraph: {
    title: "設計思考｜從洞察到可測試的解法",
    description: "6 週 · 12 單元 · 中英文精選影音 · 完整實作路徑",
    type: "website",
    url: `${courseBasePath}/`,
    images: [
      {
        url: `${courseBasePath}/og.png`,
        width: 1733,
        height: 909,
        alt: "設計思考線上課程封面",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "設計思考｜從洞察到可測試的解法",
    description: "6 週 · 12 單元 · 中英文精選影音 · 完整實作路徑",
    images: [`${courseBasePath}/og.png`],
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
