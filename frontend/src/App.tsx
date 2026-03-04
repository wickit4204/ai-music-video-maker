import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import UploadSection from './components/UploadSection';
import VideoGallery from './components/VideoGallery';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload');

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-accent/5">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          {activeTab === 'upload' ? <UploadSection /> : <VideoGallery />}
        </main>

        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
