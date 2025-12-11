import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K12Path - 陪伴孩子成长的每一步",
  description: "从出生到高中毕业，K12Path为您精选各年龄段的优质教育资源。陪伴移民家庭的K-12教育之路。",
  keywords: ["K-12教育", "移民家庭", "教育资源", "SSAT准备", "择校", "双语教育", "幼小衔接", "升学规划"],
  authors: [{ name: "K12Path" }],
  openGraph: {
    title: "K12Path - 陪伴孩子成长的每一步",
    description: "从出生到高中毕业，K12Path为您精选各年龄段的优质教育资源。",
    url: "https://k12path.com",
    siteName: "K12Path",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "K12Path - 陪伴孩子成长的每一步",
    description: "从出生到高中毕业，K12Path为您精选各年龄段的优质教育资源。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-sans bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
