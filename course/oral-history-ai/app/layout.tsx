import type { Metadata } from "next";
import "./globals.css";

const courseBasePath = "/course/oral-history-ai";

export const metadata: Metadata = {
  metadataBase: new URL("https://jiangphtw.github.io"),
  title: "留下人的聲音｜AI 時代口述歷史方法與實作",
  description: "8 單元互動課程：從方法、倫理、訪談與錄音，到 AI 轉錄稽核、保存與公共敘事，完成一份可查核的口述史專案包。",
  alternates: { canonical: `${courseBasePath}/` },
  openGraph: {
    title: "留下人的聲音｜AI 時代口述歷史方法與實作",
    description: "方法 × 倫理 × 訪談 × AI 稽核 × 保存，完成一份尊重敘事者的口述史專案。",
    type: "website",
    url: `${courseBasePath}/`,
    images: [{ url: `${courseBasePath}/og.svg`, width: 1600, height: 900, alt: "AI 時代口述歷史方法與實作課程封面" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "留下人的聲音｜AI 時代口述歷史方法與實作",
    description: "8 單元，完成可查核、可保存、可交還的口述史專案包。",
    images: [`${courseBasePath}/og.svg`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
