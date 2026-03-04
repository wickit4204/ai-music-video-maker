import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface VideoRecord {
    id: string;
    user: Principal;
    audioFile: ExternalBlob;
    videoFile?: ExternalBlob;
    analysis: MusicAnalysis;
}
export interface MusicAnalysis {
    tempo: bigint;
    emotion: string;
    genre: string;
    rhythm: string;
}
export interface UploadResult {
    id: string;
    audioFile: ExternalBlob;
    analysis: MusicAnalysis;
}
export interface backendInterface {
    getAllVideos(): Promise<Array<VideoRecord>>;
    getVideo(id: string): Promise<VideoRecord>;
    uploadAudio(id: string, audioFile: ExternalBlob): Promise<UploadResult>;
}
