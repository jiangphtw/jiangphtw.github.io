import type { Metadata } from "next";
import "./globals.css";

const courseBasePath = "/course/ai-investment-research";

export const metadata: Metadata = {
  metadataBase: new URL("https://jiangphtw.github.io"),
  title: "AI 投資研究工程｜從資料、估值到可靠自動化",
  description: "8 單元、16 支雙語影音與一個可稽核 AI 投資研究助理。補齊來源查核、回測偏誤、風險、評測、安全與失效保護。",
  icons: { icon: `${courseBasePath}/favicon.svg` },
  alternates: { canonical: `${courseBasePath}/` },
  openGraph: {
    title: "AI 投資研究工程",
    description: "不讓 AI 替你假裝確定：打造會引用、會拒答、有人覆核、出錯能停的研究助理。",
    type: "website",
    locale: "zh_TW",
    url: `${courseBasePath}/`,
    images: [{ url: `${courseBasePath}/og.svg`, width: 1600, height: 900, alt: "AI 投資研究工程課程地圖" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
