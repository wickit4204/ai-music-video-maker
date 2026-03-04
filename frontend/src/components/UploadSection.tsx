import { useState, useCallback } from 'react';
import { Upload, Music, Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useUploadAudio } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function UploadSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const uploadMutation = useUploadAudio();

  const handleFileSelect = useCallback((file: File) => {
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|aac)$/i)) {
      toast.error('Invalid file type. Please upload an audio file (MP3, WAV, OGG, AAC).');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 50MB.');
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    const id = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    uploadMutation.mutate(
      {
        id,
        audioFile: selectedFile,
        onProgress: (percentage) => {
          setUploadProgress(percentage);
        },
      },
      {
        onSuccess: (result) => {
          toast.success('Audio uploaded successfully!', {
            description: `Analysis complete: ${result.analysis.emotion} ${result.analysis.genre} at ${result.analysis.tempo} BPM`,
          });
          setSelectedFile(null);
          setUploadProgress(0);
        },
        onError: (error) => {
          toast.error('Upload failed', {
            description: error.message,
          });
          setUploadProgress(0);
        },
      }
    );
  };

  const isUploading = uploadMutation.isPending;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Create Your Music Video
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your finished song and let AI analyze its rhythm, tempo, and emotion to generate a stunning photorealistic video
        </p>
      </div>

      <Card className="border-2 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Upload Audio File
          </CardTitle>
          <CardDescription>
            Supported formats: MP3, WAV, OGG, AAC (max 50MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              relative rounded-lg border-2 border-dashed p-12 text-center transition-all
              ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-accent/5'}
              ${isUploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
            `}
            onClick={() => {
              if (!isUploading) {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'audio/*,.mp3,.wav,.ogg,.aac';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFileSelect(file);
                };
                input.click();
              }
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-6">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              
              {selectedFile ? (
                <div className="space-y-2">
                  <p className="text-lg font-semibold">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-semibold">
                    Drop your audio file here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop or click to select a file from your computer
                  </p>
                </div>
              )}
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <Alert className="bg-accent/50 border-accent">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> The backend currently performs basic music analysis but does not generate actual videos. 
              Video generation functionality is pending implementation.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 gap-2 h-12 text-base"
              size="lg"
            >
              <Sparkles className="h-5 w-5" />
              {isUploading ? 'Uploading...' : 'Upload & Analyze'}
            </Button>
            
            {selectedFile && !isUploading && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  setUploadProgress(0);
                }}
                className="h-12"
                size="lg"
              >
                Clear
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t">
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-primary">AI</div>
              <div className="text-xs text-muted-foreground">Analysis</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-primary">Auto</div>
              <div className="text-xs text-muted-foreground">Generation</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-primary">HD</div>
              <div className="text-xs text-muted-foreground">Quality</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-primary">Fast</div>
              <div className="text-xs text-muted-foreground">Processing</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
