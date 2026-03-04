import { Music, Upload, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeTab: 'upload' | 'gallery';
  onTabChange: (tab: 'upload' | 'gallery') => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg">
              <Music className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AI Music Video Maker</h1>
              <p className="text-sm text-muted-foreground">Transform your music into cinematic visuals</p>
            </div>
          </div>

          <nav className="flex gap-2">
            <Button
              variant={activeTab === 'upload' ? 'default' : 'ghost'}
              onClick={() => onTabChange('upload')}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            <Button
              variant={activeTab === 'gallery' ? 'default' : 'ghost'}
              onClick={() => onTabChange('gallery')}
              className="gap-2"
            >
              <Film className="h-4 w-4" />
              Gallery
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
