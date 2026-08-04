import type { Metadata, Viewport } from "next";
import "./globals.css";

const courseBasePath = "/course/sustainability";

export const metadata: Metadata = {
  metadataBase: new URL("https://jiangphtw.github.io"),
  title: "永續力｜從 SDGs 到求職作品",
  description:
    "給大學生的 8 週永續發展與 SDGs 線上課程：讀懂全球目標、國家政策、企業案例，完成可放入履歷與作品集的永續提案。",
  icons: { icon: `${courseBasePath}/favicon.svg` },
  alternates: { canonical: `${courseBasePath}/` },
  openGraph: {
    title: "永續力｜從 SDGs 到求職作品",
    description: "12 單元、24 支雙語影音、國家與企業案例，以及一份能被驗證的永續求職證據包。",
    type: "website",
    locale: "zh_TW",
    url: `${courseBasePath}/`,
    images: [{ url: `${courseBasePath}/og.svg`, width: 1600, height: 900, alt: "永續力課程地圖" }],
  },
};

export const viewport: Viewport = { themeColor: "#0b4938" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
