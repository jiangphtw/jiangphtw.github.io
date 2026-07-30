import type { Metadata } from "next";
import "./globals.css";

const courseBasePath = "/course/stock-decision";

export const metadata: Metadata = {
  metadataBase: new URL("https://jiangphtw.github.io"),
  title: "股海判讀學｜從筆記到可複核的台股決策",
  description:
    "把財報、技術、新聞、風險與重大事件史整合成 9 單元台股研究實作課，含中英教學影片、案例、練習與本地進度追蹤。",
  icons: {
    icon: `${courseBasePath}/favicon.svg`,
    shortcut: `${courseBasePath}/favicon.svg`,
  },
  alternates: { canonical: `${courseBasePath}/` },
  openGraph: {
    title: "股海判讀學",
    description: "從筆記到可複核的台股決策",
    type: "website",
    locale: "zh_TW",
    url: `${courseBasePath}/`,
    images: [
      {
        url: `${courseBasePath}/og.png`,
        width: 1672,
        height: 939,
        alt: "股海判讀學課程封面",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "股海判讀學",
    description: "從筆記到可複核的台股決策",
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
