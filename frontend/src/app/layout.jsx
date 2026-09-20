import '../styles/globals.css';
import { DataStoreProvider } from '@/lib/dataStore';

export const metadata = {
  title: 'IdeaJudge // Digitalized Ideathon Judging Suite',
  description: 'Official digitalized judging, timekeeping, and live evaluation scoring platform for technical events and ideathons.',
  keywords: 'ideathon, judging platform, live scoring, rubric scoring, evaluation chamber, coordinator timekeeper',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <DataStoreProvider>
          {children}
        </DataStoreProvider>
      </body>
    </html>
  );
}
