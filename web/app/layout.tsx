import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Petisco Brazil | Sabores brasileiros em Berlim',
  description: 'Encomende combos de salgados, doces e pão de queijo artesanais em Berlim.',
  openGraph: {
    title: 'Petisco Brazil',
    description: 'Sabores autênticos entregues em Berlim',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="min-h-screen bg-brand-green text-white antialiased">
        {children}
      </body>
    </html>
  );
}
