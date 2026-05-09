import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '美元基金实务札记 | 离岸基金合规专业指南',
    template: '%s | 美元基金实务札记',
  },
  description:
    '专注美元基金合规领域，提供系列化、系统化、场景化的实战内容。涵盖开曼/BVI/香港基金架构、CRS合规、反洗钱、税务合规等核心议题。',
  keywords: [
    '美元基金',
    '离岸基金',
    '开曼基金',
    'BVI基金',
    '香港基金',
    'CRS合规',
    '反洗钱',
    '税务合规',
    '基金合规',
    'OFAC制裁',
  ],
  authors: [{ name: '美元基金实务札记' }],
  openGraph: {
    title: '美元基金实务札记 | 离岸基金合规专业指南',
    description:
      '专注美元基金合规领域，提供系列化、系统化、场景化的实战内容。',
    url: 'https://example.com',
    siteName: '美元基金实务札记',
    locale: 'zh_CN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
