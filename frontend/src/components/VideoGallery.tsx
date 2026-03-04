import { Film, Music2, Clock, Heart, Download, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllVideos } from '../hooks/useQueries';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function VideoGallery() {
  const { data: videos, isLoading, error } = useGetAllVideos();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Your Music Videos</h2>
          <p className="text-lg text-muted-foreground">Browse and download your generated videos</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load videos: {error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Your Music Videos</h2>
        <p className="text-lg text-muted-foreground">
          {videos && videos.length > 0
            ? `${videos.length} video${videos.length === 1 ? '' : 's'} in your collection`
            : 'No videos yet. Upload your first song to get started!'}
        </p>
      </div>

      {videos && videos.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Film className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Upload your first audio file to start creating amazing AI-generated music videos
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos?.map((video) => (
            <Card key={video.id} className="group overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-1">
                    {video.id.split('_').slice(1).join('_')}
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {video.analysis.genre}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Music2 className="h-3 w-3" />
                  {video.analysis.emotion} • {video.analysis.rhythm}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="relative aspect-video rounded-lg bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 overflow-hidden">
                  {video.videoFile ? (
                    <video
                      src={video.videoFile.getDirectURL()}
                      controls
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
                      <div className="rounded-full bg-background/80 p-4">
                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Video Not Generated</p>
                        <p className="text-xs text-muted-foreground">
                          Backend video generation pending
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{video.analysis.tempo} BPM</span>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Heart className="h-3 w-3" />
                      {video.analysis.emotion}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={!video.audioFile}
                      onClick={async () => {
                        if (video.audioFile) {
                          const url = video.audioFile.getDirectURL();
                          window.open(url, '_blank');
                        }
                      }}
                    >
                      <Music2 className="h-4 w-4 mr-2" />
                      Audio
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      disabled={!video.videoFile}
                      onClick={async () => {
                        if (video.videoFile) {
                          const url = video.videoFile.getDirectURL();
                          window.open(url, '_blank');
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Video
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
