import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Concessionária de Veículos',
  description: 'Sistema de gerenciamento de veículos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}