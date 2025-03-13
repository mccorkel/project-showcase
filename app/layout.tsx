import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import '@aws-amplify/ui-react/styles.css';
import { AuthProvider } from './contexts/AuthContext';
import AmplifyConfig from './components/AmplifyConfig';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Project Showcase',
  description: 'Student Project Showcase Application',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AmplifyConfig>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AmplifyConfig>
      </body>
    </html>
  );
} 