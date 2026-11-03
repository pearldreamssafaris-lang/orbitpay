import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'OrbitPay | Global payments', description: 'One platform. Money without borders.' };
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body>{children}</body></html>;
}
