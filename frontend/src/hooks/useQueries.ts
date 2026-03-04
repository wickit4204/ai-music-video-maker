import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { VideoRecord, UploadResult } from '../backend';
import { ExternalBlob } from '../backend';

export function useUploadAudio() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<UploadResult, Error, { id: string; audioFile: File; onProgress?: (percentage: number) => void }>({
    mutationFn: async ({ id, audioFile, onProgress }) => {
      if (!actor) throw new Error('Actor not initialized');

      const arrayBuffer = await audioFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      let blob = ExternalBlob.fromBytes(uint8Array);
      if (onProgress) {
        blob = blob.withUploadProgress(onProgress);
      }

      return await actor.uploadAudio(id, blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

export function useGetAllVideos() {
  const { actor, isFetching } = useActor();

  return useQuery<VideoRecord[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getAllVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVideo(id: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<VideoRecord | null>({
    queryKey: ['video', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return await actor.getVideo(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}
