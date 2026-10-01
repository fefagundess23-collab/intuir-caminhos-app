import { Practice } from '../types';

/**
 * Provedor de mídia para o aplicativo Saindo do Estado de Alerta.
 * 
 * Permite que arquivos de áudio e vídeo sejam carregados de:
 * 1. Pasta local: /public/audio/ (ex: '/audio/pratica-dia-1.mp3' ou '/audio/pratica-dia-1.wav')
 * 2. URLs remotas: Firebase Storage, Amazon S3, Cloudflare R2 ou CDN dedicado
 * 3. Base URL configurável via variável de ambiente VITE_MEDIA_BASE_URL
 */
export const mediaService = {
  /**
   * Resolve a URL final do arquivo de áudio da prática.
   * Não fixa o áudio no código-fonte, permitindo migração suave para Firebase Storage.
   */
  resolveAudioUrl(practice: Practice): string {
    const rawUrl = practice.arquivoAudio || practice.audioUrl;

    if (!rawUrl) {
      return '/audio/pratica-dia-1.wav';
    }

    // Se já for uma URL absoluta completa (ex: Firebase Storage ou CDN externo)
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
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
