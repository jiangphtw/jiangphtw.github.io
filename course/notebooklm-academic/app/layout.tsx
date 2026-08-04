import type { Metadata } from "next";
import "./globals.css";

const courseBasePath = "/course/notebooklm-academic";

export const metadata: Metadata = {
  metadataBase: new URL("https://jiangphtw.github.io"),
  title: "Gemini Notebook 學術研究實戰｜從文獻到可複核的研究輸出",
  description:
    "7 週、14 單元的免費實作課：研究問題、來源策略、證據矩陣、批判綜整、引用查證、Zotero 知識庫與結業研究作品。",
  alternates: { canonical: `${courseBasePath}/` },
  openGraph: {
    title: "Gemini Notebook 學術研究實戰",
    description: "不只整理資料：把 AI 筆記變成可追溯、可查證、可交付的研究流程。",
    type: "website",
    url: `${courseBasePath}/`,
    images: [{ url: `${courseBasePath}/og.svg`, width: 1600, height: 900, alt: "Gemini Notebook 學術研究實戰課程封面" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gemini Notebook 學術研究實戰",
    description: "7 週 × 14 單元 × 1 份可複核研究作品",
    images: [`${courseBasePath}/og.svg`],
  },
  icons: { icon: `${courseBasePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
