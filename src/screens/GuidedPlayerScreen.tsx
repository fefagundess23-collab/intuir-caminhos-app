import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, RefreshCw } from 'lucide-react';
import { Practice } from '../types';

interface GuidedPlayerScreenProps {
  practice: Practice;
  onFinish: () => void;
  onCancel: () => void;
}

export const GuidedPlayerScreen: React.FC<GuidedPlayerScreenProps> = ({
  practice,
  onFinish,
  onCancel,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Diagnostic states updated in real-time
  const [diag, setDiag] = useState({
    src: '',
    currentSrc: '',
    readyState: 0,
    networkState: 0,
    duration: 0,
    currentTime: 0,
    paused: true,
    muted: false,
    volume: 1,
    errorCode: null as number | null,
    errorMessage: null as string | null,
    mediaElementsCount: 0,
    otherElements: [] as string[],
  });

  const updateDiagnostics = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Check for any other <audio> or <video> elements on the entire document
    const allMedia = Array.from(document.querySelectorAll('audio, video'));
    const otherElements = allMedia
      .filter((el) => el !== audio)
      .map((el) => `${el.tagName.toLowerCase()} (src: ${(el as HTMLMediaElement).currentSrc || (el as HTMLMediaElement).src || 'sem src'})`);

    const info = {
      src: audio.src,
      currentSrc: audio.currentSrc,
      readyState: audio.readyState,
      networkState: audio.networkState,
      duration: audio.duration,
      currentTime: audio.currentTime,
      paused: audio.paused,
      muted: audio.muted,
      volume: audio.volume,
      errorCode: audio.error ? audio.error.code : null,
      errorMessage: audio.error ? audio.error.message : null,
      mediaElementsCount: allMedia.length,
      otherElements,
    };

    setDiag(info);

    // Register requested properties in console
    console.log('[Diagnóstico de Áudio do Navegador]', {
      'audio.currentSrc': audio.currentSrc,
      'audio.src': audio.src,
      'audio.duration': audio.duration,
      'audio.readyState': audio.readyState,
      'audio.networkState': audio.networkState,
      'audio.error': audio.error,
      'totalMediaElementsNaPagina': allMedia.length,
      'outrosElementosMedia': otherElements,
    });
  };

  useEffect(() => {
    updateDiagnostics();
    const interval = setInterval(updateDiagnostics, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F7F5F0] text-[#292623] p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#6E685F] hover:bg-[#EDE7DC] cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        <button
          type="button"
          onClick={updateDiagnostics}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-[#6E685F] bg-[#EDE7DC] hover:bg-[#E2DACB] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Atualizar Diagnóstico</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-full text-[#6E685F] hover:bg-[#EDE7DC] cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-xl w-full mx-auto my-auto flex flex-col gap-6">
        <div className="text-center">
          <span className="text-xs uppercase tracking-wider text-[#8A847A] font-semibold">
            Diagnóstico de Requisição Real
          </span>
          <h1 className="text-2xl font-serif text-[#292623] mt-1 mb-1">
            {practice.titulo}
          </h1>
          <p className="text-xs text-[#6E685F]">
            Somente o elemento &lt;audio controls&gt; nativo. Sem áudio secundário, sem ambiente, sem música.
          </p>
        </div>

        {/* 1. Native Audio Controls pointing directly to /audio/estou-acelerado-v2.mp3 */}
        <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-[#E8E3D9]">
          <label className="block text-xs font-semibold text-[#6E685F] mb-2 uppercase tracking-wide">
            Elemento &lt;audio controls&gt; nativo
          </label>
          <audio
            ref={audioRef}
            controls
            src="/audio/estou-acelerado-web.m4a"
            preload="auto"
            className="w-full"
            style={{ width: '100%' }}
            onPlay={updateDiagnostics}
            onPause={updateDiagnostics}
            onTimeUpdate={updateDiagnostics}
            onLoadedMetadata={updateDiagnostics}
            onCanPlay={updateDiagnostics}
            onError={updateDiagnostics}
          >
            Seu navegador não suporta o elemento de áudio nativo.
          </audio>
        </div>

        {/* 2. Real-time Diagnostic Panel requested by user */}
        <div className="w-full bg-[#292623] text-[#EDE7DC] p-5 rounded-2xl font-mono text-xs shadow-md border border-[#3E3935] space-y-2">
          <div className="text-xs font-bold text-[#E5ECE4] border-b border-[#3E3935] pb-2 mb-3">
            PAINEL DE INSPEÇÃO DO NAVEGADOR
          </div>
          <div>
            <span className="text-[#9E978E]">Audio source: </span>
            <span className="text-[#A3B899] break-all">{diag.currentSrc || diag.src || '/audio/estou-acelerado-web.m4a'}</span>
          </div>
          <div>
            <span className="text-[#9E978E]">Audio readyState: </span>
            <span className="text-white font-bold">{diag.readyState}</span>
            <span className="text-[#8A847A] ml-2 text-[10px]">
              (0=HAVE_NOTHING, 1=HAVE_METADATA, 2=HAVE_CURRENT_DATA, 3=HAVE_FUTURE_DATA, 4=HAVE_ENOUGH_DATA)
            </span>
          </div>
          <div>
            <span className="text-[#9E978E]">Audio networkState: </span>
            <span className="text-white font-bold">{diag.networkState}</span>
            <span className="text-[#8A847A] ml-2 text-[10px]">
              (0=EMPTY, 1=IDLE, 2=LOADING, 3=NO_SOURCE)
            </span>
          </div>
          <div>
            <span className="text-[#9E978E]">Audio duration: </span>
            <span className="text-white font-bold">{diag.duration ? `${diag.duration.toFixed(2)}s` : 'carregando...'}</span>
          </div>
          <div>
            <span className="text-[#9E978E]">Audio currentTime: </span>
            <span className="text-white font-bold">{diag.currentTime.toFixed(2)}s</span>
          </div>
          <div>
            <span className="text-[#9E978E]">Audio paused: </span>
            <span className={diag.paused ? 'text-[#E0A899] font-bold' : 'text-[#A3B899] font-bold'}>
              {String(diag.paused)}
            </span>
          </div>
          <div>
            <span className="text-[#9E978E]">Audio muted: </span>
            <span className={diag.muted ? 'text-[#E0A899] font-bold' : 'text-white'}>
              {String(diag.muted)}
            </span>
          </div>
          <div>
            <span className="text-[#9E978E]">Audio volume: </span>
            <span className="text-white font-bold">{diag.volume}</span>
          </div>
          {diag.errorCode && (
            <div className="text-[#FF6B6B] border-t border-[#3E3935] pt-2 mt-2">
              Audio error code: {diag.errorCode} {diag.errorMessage ? `(${diag.errorMessage})` : ''}
            </div>
          )}
          <div className="border-t border-[#3E3935] pt-2 mt-2">
            <span className="text-[#9E978E]">Elementos &lt;audio&gt; / &lt;video&gt; montados no DOM: </span>
            <span className="text-white font-bold">{diag.mediaElementsCount}</span>
            {diag.otherElements.length > 0 && (
              <div className="text-[#E0A899] text-[11px] mt-1">
                Outros elementos detectados: {diag.otherElements.join(', ')}
              </div>
            )}
            {diag.mediaElementsCount === 1 && (
              <div className="text-[#A3B899] text-[11px] mt-1">
                ✓ Apenas 1 elemento de áudio montado na página. Nenhum outro áudio secundário.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-xl w-full mx-auto flex gap-3">
        <button
          type="button"
          onClick={onFinish}
          className="flex-1 py-3 px-4 rounded-xl bg-[#5B7059] text-white text-sm font-medium hover:bg-[#4E614C] cursor-pointer"
        >
          Concluir Diagnóstico
        </button>
      </div>
    </div>
  );
};
