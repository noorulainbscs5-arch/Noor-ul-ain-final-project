import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PrepIQ — AI Study & Quiz Generator',
  description:
    'Turn your lecture notes into instant quizzes. Generate study questions, test yourself, and get AI-powered explanations with your personal PrepIQ Tutor.',
  applicationName: 'PrepIQ',
  authors: [{ name: 'PrepIQ' }],
  keywords: [
    'AI quiz generator',
    'study tool',
    'flashcards',
    'exam prep',
    'AI tutor',
    'PrepIQ',
  ],
  openGraph: {
    title: 'PrepIQ — AI Study & Quiz Generator',
    description:
      'Turn your lecture notes into instant quizzes with an AI tutor by your side.',
    type: 'website',
  },
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
