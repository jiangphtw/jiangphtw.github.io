import type { Metadata } from "next";
import "./globals.css";

const courseBasePath = "/course/operations-research";

export const metadata: Metadata = {
  metadataBase: new URL("https://jiangphtw.github.io"),
  title: "作業研究｜把限制條件變成更好的決策",
  description:
    "15 週、15 單元的作業研究線上課：從線性規劃、單體法、對偶與敏感度分析，一路完成運輸、網路與專案排程最佳化。",
  alternates: { canonical: `${courseBasePath}/` },
  openGraph: {
    title: "作業研究｜把限制條件變成更好的決策",
    description: "15 週 · 15 單元 · 王晉元老師 OCW 主軸 · 雙語影音與完整實作",
    type: "website",
    url: `${courseBasePath}/`,
    images: [
      {
        url: `${courseBasePath}/og.svg`,
        width: 1733,
        height: 909,
        alt: "作業研究線上課程封面",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "作業研究｜把限制條件變成更好的決策",
    description: "15 週 · 15 單元 · 王晉元老師 OCW 主軸 · 雙語影音與完整實作",
    images: [`${courseBasePath}/og.svg`],
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
