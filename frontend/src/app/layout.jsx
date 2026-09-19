import '../styles/globals.css';
import { DataStoreProvider } from '@/lib/dataStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Toast from '@/components/ui/Toast';

export const metadata = {
  title: 'VICEVERSE // THE ULTIMATE INNOVATION HEIST',
  description: 'Full-stack cyber-heist event management, judging, live scoring and multi-agent coordination platform.',
  keywords: 'hackathon, ideathon, judging platform, live scoring, multi-agent, cyber heist, rubric scoring',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050505] text-white min-h-screen flex flex-col font-sans selection:bg-[var(--primary)] selection:text-black">
        <DataStoreProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Toast />
          <Footer />
        </DataStoreProvider>
      </body>
    </html>
  );
}
