import { Practice } from '../types';
import { audioStorage } from './audioStorage';

/**
 * Provedor de mídia para o aplicativo Intuir Caminhos.
 * 
 * Permite que arquivos de áudio sejam carregados de:
 * 1. Pasta pública local: /public/audio/praticas/ (ex: '/audio/praticas/estou-acelerado.mp3')
 * 2. Arquivo local carregado no navegador pelo usuário (persistido via IndexedDB com URL Blob)
 * 3. URLs remotas: Netlify CDN, Firebase Storage, S3 ou CDN dedicado
 */
export const mediaService = {
  /**
   * Resolve a URL estática do arquivo de áudio da prática.
   */
  resolveAudioUrl(practice: Practice): string {
    const rawUrl = practice.arquivoAudio || practice.audioUrl;

    if (!rawUrl) {
      return '/audio/pratica-dia-1.wav';
    }

    // Se já for uma URL absoluta completa ou Blob local
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('blob:')) {
      return rawUrl;
    }

    // Se houver uma baseURL de bucket configurada no ambiente (ex: Firebase Storage)
    const remoteBase = (import.meta as unknown as { env?: { VITE_MEDIA_BASE_URL?: string } }).env?.VITE_MEDIA_BASE_URL;
    if (remoteBase) {
      const cleanBase = remoteBase.endsWith('/') ? remoteBase.slice(0, -1) : remoteBase;
      const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
      return `${cleanBase}${cleanPath}`;
    }

    // Padrão local: pasta pública
    return rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
  },

  /**
   * Tenta carregar o arquivo de áudio salvo no IndexedDB local do usuário.
   */
  async loadLocalAudioBlobUrl(practiceId: string): Promise<string | null> {
    const blob = await audioStorage.getAudioBlob(practiceId);
    if (blob) {
      return URL.createObjectURL(blob);
    }
    return null;
  },

  /**
   * Salva o arquivo de áudio enviado pelo usuário no navegador local e retorna uma URL Blob pronta.
   */
  async saveLocalAudioFile(practiceId: string, file: File): Promise<string> {
    await audioStorage.saveAudio(practiceId, file);
    return URL.createObjectURL(file);
  },

  /**
   * Remove o arquivo salvo localmente no navegador.
   */
  async removeLocalAudioFile(practiceId: string): Promise<void> {
    await audioStorage.removeAudio(practiceId);
  },

  /**
   * Resolve a URL de arquivo de vídeo opcional para o futuro.
   */
  resolveVideoUrl(practice: Practice): string | undefined {
    const rawUrl = practice.arquivoVideo || practice.videoUrl;
    if (!rawUrl) return undefined;

    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return rawUrl;
    }

    const remoteBase = (import.meta as unknown as { env?: { VITE_MEDIA_BASE_URL?: string } }).env?.VITE_MEDIA_BASE_URL;
    if (remoteBase) {
      const cleanBase = remoteBase.endsWith('/') ? remoteBase.slice(0, -1) : remoteBase;
      const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
      return `${cleanBase}${cleanPath}`;
    }

    return rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
  },
};
