import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  RotateCw,
  Sparkles,
  Upload,
  CheckCircle,
} from 'lucide-react';
import { Practice } from '../types';
import { soundService } from '../services/soundService';
import { mediaService } from '../services/mediaService';

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dedicated self-contained audio practice (contains full voice, background, and pauses)
  const isDedicatedAudio =
    practice.id === 'dia-1' ||
    Boolean(practice.arquivoAudio && practice.arquivoAudio.includes('estou-acelerado'));

  // Audio & playback state - Starts FALSE to enforce user-gesture playback (NO AUTOPLAY)
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(() => practice.durationMinutes * 60 || 389);
  const [audioError, setAudioError] = useState(false);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [localFileName, setLocalFileName] = useState<string | null>(null);

  // Ambient sound and UX state (for traditional practices)
  const [ambientSoundActive, setAmbientSoundActive] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Check if user previously loaded a local voice file for this practice in IndexedDB
  useEffect(() => {
    let isMounted = true;
    mediaService.loadLocalAudioBlobUrl(practice.id).then((blobUrl) => {
      if (isMounted && blobUrl) {
        setCustomAudioUrl(blobUrl);
        setLocalFileName('Arquivo pessoal carregado');
      }
    });
    return () => {
      isMounted = false;
    };
  }, [practice.id]);

  // Audio source URL
  const resolvedAudioSrc = customAudioUrl || mediaService.resolveAudioUrl(practice);

  const phrases =
    practice.instrucoes && practice.instrucoes.length > 0
      ? practice.instrucoes
      : practice.guidedPhrases && practice.guidedPhrases.length > 0
      ? practice.guidedPhrases
      : [
          'Chegue ao seu corpo exatamente como você está agora.',
          'Perceba sua respiração natural fluindo.',
          'Perceba os apoios do corpo.',
          'Observe onde existe esforço desnecessário.',
          'Não tente mudar nada imediatamente.',
          'Sinta o peso dos seus pés e a sustentação do solo.',
          'Apenas observe com acolhimento.',
        ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundService.stopAmbient();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Update current guidance phrase based on time progression (for non-dedicated practices)
  useEffect(() => {
    if (isDedicatedAudio || duration <= 0) return;
    const progressRatio = currentTime / duration;
    const phraseIndex = Math.min(
      Math.floor(progressRatio * phrases.length),
      phrases.length - 1
    );
    setCurrentPhraseIndex(phraseIndex);
  }, [currentTime, duration, phrases.length, isDedicatedAudio]);

  // Audio element event handlers
  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
      setAudioError(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (!isDedicatedAudio) {
      soundService.playBell();
    }
    setTimeout(() => {
      onFinish();
    }, 800);
  };

  const handleAudioError = () => {
    console.warn(`Aviso ao carregar áudio em: ${resolvedAudioSrc}`);
    setAudioError(true);
  };

  // Primary user-gesture trigger to start playback: NO AUTOPLAY
  const handleStartPractice = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasStarted(true);
    if (!isDedicatedAudio) {
      soundService.playBell();
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setAudioError(false);
        })
        .catch((err) => {
          console.warn('Erro ao tocar áudio no clique:', err);
          setIsPlaying(false);
        });
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!hasStarted) {
      handleStartPractice();
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn('Audio play error:', e);
          setIsPlaying(false);
        });
    }
  };

  // Ambient sound toggle for traditional practices
  const toggleAmbient = () => {
    const next = !ambientSoundActive;
    setAmbientSoundActive(next);
    soundService.toggleAmbient(next);
  };

  // Scrub / seek
  const seekTo = (seconds: number) => {
    const safeTime = Math.max(0, Math.min(duration, seconds));
    if (audioRef.current) {
      audioRef.current.currentTime = safeTime;
    }
    setCurrentTime(safeTime);
  };

  const skipBackward = () => {
    seekTo(currentTime - 15);
  };

  const skipForward = () => {
    seekTo(currentTime + 15);
  };

  // Format mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Handle local user file selection (IndexedDB persistence)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const blobUrl = await mediaService.saveLocalAudioFile(practice.id, file);
        setCustomAudioUrl(blobUrl);
        setLocalFileName(file.name);
        setAudioError(false);
        if (audioRef.current) {
          audioRef.current.src = blobUrl;
          audioRef.current.load();
        }
      } catch (err) {
        console.error('Erro ao salvar áudio local:', err);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#F7F5F0] text-[#292623] px-6 py-6 overflow-hidden select-none">
      {/* Real HTML5 Audio Element - No Autoplay, PlaysInline for mobile Safari/PWA */}
      <audio
        ref={audioRef}
        src={resolvedAudioSrc}
        preload="auto"
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleAudioError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Hidden file input for loading real audio file in preview */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.m4a,.wav"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#E5ECE4]/70 blur-3xl pointer-events-none" />

      {/* Top Header Controls */}
      <div className="relative z-10 flex items-center justify-between pt-safe">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#6E685F] hover:bg-[#EDE7DC] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Encerrar</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[11px] uppercase tracking-wider text-[#BA6640] font-semibold">
            {practice.dayNumber ? `Dia ${practice.dayNumber}` : 'Prática Guiada'}
          </span>
          <span className="text-[10px] text-[#8C857B]">
            {practice.duracao || practice.durationDisplay || '6 min'}
          </span>
        </div>

        {!isDedicatedAudio ? (
          <button
            onClick={toggleAmbient}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              ambientSoundActive
                ? 'bg-[#20362E] text-[#F7F5F0]'
                : 'text-[#6E685F] border border-[#DDD4C4] hover:bg-[#EDE7DC]'
            }`}
            title="Som ambiente somático de fundo"
          >
            {ambientSoundActive ? (
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>Ambiente</span>
          </button>
        ) : (
          <div className="w-16" />
        )}
      </div>

      {/* Center Somatic Arena: Breathing Orb & Contemplative State */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center px-2 py-4">
        {/* Practice Title */}
        <h2 className="font-serif text-2xl sm:text-3xl text-[#20362E] tracking-tight font-normal max-w-xs">
          {practice.titulo || practice.title}
        </h2>

        {practice.focusArea && (
          <p className="text-xs text-[#6E685F] mt-1 font-light tracking-wide">
            {practice.focusArea}
          </p>
        )}

        {/* Visual Playback Indicator: Waveform bars */}
        <div className="flex items-center gap-1.5 mt-3 h-5">
          <span
            className={`w-1 bg-[#20362E] rounded-full transition-all duration-300 ${
              isPlaying ? 'h-4 animate-pulse' : 'h-1.5 opacity-40'
            }`}
          />
          <span
            className={`w-1 bg-[#BA6640] rounded-full transition-all duration-300 ${
              isPlaying ? 'h-5 animate-bounce' : 'h-1.5 opacity-40'
            }`}
            style={{ animationDelay: '120ms' }}
          />
          <span
            className={`w-1 bg-[#20362E] rounded-full transition-all duration-300 ${
              isPlaying ? 'h-3 animate-pulse' : 'h-1.5 opacity-40'
            }`}
            style={{ animationDelay: '240ms' }}
          />
          <span
            className={`w-1 bg-[#95A593] rounded-full transition-all duration-300 ${
              isPlaying ? 'h-4.5 animate-bounce' : 'h-1.5 opacity-40'
            }`}
            style={{ animationDelay: '360ms' }}
          />
          <span className="text-[11px] text-[#6E685F] ml-1.5 font-medium">
            {!hasStarted
              ? 'Pronto para iniciar'
              : isPlaying
              ? 'Prática em andamento'
              : 'Prática pausada'}
          </span>
        </div>

        {/* Breathing Orb Visualization */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-6 flex items-center justify-center">
          {/* Subtle Outer Pulsing Wave */}
          <div
            className={`absolute inset-0 rounded-full border border-[#95A593]/40 ${
              isPlaying ? 'animate-breathe-glow' : 'opacity-20'
            }`}
          />
          <div
            className={`absolute inset-6 rounded-full border border-[#20362E]/20 ${
              isPlaying ? 'animate-breathe' : 'opacity-30'
            }`}
          />
          <div
            className={`absolute inset-12 rounded-full bg-[#EDE7DC]/70 backdrop-blur-xs flex items-center justify-center transition-transform duration-1000 ${
              isPlaying ? 'scale-100' : 'scale-95'
            }`}
          >
            {/* Center Core Button */}
            {!hasStarted ? (
              <button
                onClick={handleStartPractice}
                className="w-24 h-24 rounded-full bg-[#20362E] text-[#F7F5F0] flex flex-col items-center justify-center shadow-xl shadow-[#20362E]/25 hover:bg-[#2E4B40] active:scale-95 transition-all cursor-pointer group"
                aria-label="Começar prática"
              >
                <Play className="w-9 h-9 ml-1 fill-current group-hover:scale-105 transition-transform" />
                <span className="text-[10px] uppercase tracking-wider font-semibold mt-1">Iniciar</span>
              </button>
            ) : (
              <button
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-[#20362E] text-[#F7F5F0] flex flex-col items-center justify-center shadow-lg shadow-[#20362E]/20 hover:bg-[#2E4B40] active:scale-95 transition-all cursor-pointer"
                aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Instructions / Contemplative feedback */}
        {!isDedicatedAudio ? (
          <>
            <div className="min-h-[72px] flex items-center justify-center max-w-sm px-4">
              <p
                key={currentPhraseIndex}
                className="font-serif text-lg sm:text-xl text-[#20362E] leading-relaxed italic transition-all duration-700 animate-in fade-in"
              >
                "{phrases[currentPhraseIndex]}"
              </p>
            </div>
            <p className="mt-2 text-[11px] text-[#8C857B] tracking-wide">
              Instrução {currentPhraseIndex + 1} de {phrases.length}
            </p>
          </>
        ) : (
          <div className="min-h-[44px] flex flex-col items-center justify-center max-w-xs px-4">
            <p className="text-xs text-[#8C857B] tracking-wide font-light">
              {!hasStarted
                ? 'Toque em Começar Prática para ouvir a condução.'
                : isPlaying
                ? 'Apenas perceba o corpo e acompanhe o áudio.'
                : 'Áudio pausado • Toque para continuar'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Real Audio Player Controls & Scrub Bar */}
      <div className="relative z-10 max-w-md w-full mx-auto pb-safe pt-2">
        {/* Progress Bar & Timers */}
        <div className="space-y-2">
          {/* Custom scrub bar with touch/drag support */}
          <div
            className="relative w-full h-3 bg-[#E4DCD0] rounded-full cursor-pointer overflow-hidden touch-none"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              seekTo(ratio * duration);
            }}
          >
            <div
              className="h-full bg-[#20362E] rounded-full transition-all duration-150 relative"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Scrub thumb head */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#BA6640] shadow-xs" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6E685F] font-mono tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Primary Playback Controls */}
        <div className="mt-4 flex items-center justify-center gap-6 sm:gap-8">
          {/* Rewind / Restart practice from 0:00 */}
          <button
            onClick={() => {
              seekTo(0);
              if (audioRef.current && !isPlaying) {
                audioRef.current.play().then(() => setIsPlaying(true));
              }
            }}
            className="p-3 rounded-full text-[#6E685F] hover:bg-[#EDE7DC] active:scale-95 transition-all flex flex-col items-center gap-0.5 cursor-pointer"
            title="Reiniciar prática do início"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-[9px] font-mono font-medium">Reiniciar</span>
          </button>

          {/* Big Play / Pause / Start Button */}
          {!hasStarted ? (
            <button
              onClick={handleStartPractice}
              className="px-6 h-14 rounded-full bg-[#20362E] text-[#F7F5F0] flex items-center justify-center gap-2 shadow-xl shadow-[#20362E]/25 hover:bg-[#2E4B40] active:scale-95 transition-all cursor-pointer font-medium text-xs tracking-wider"
              aria-label="Começar prática"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>COMEÇAR PRÁTICA</span>
            </button>
          ) : (
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-[#20362E] text-[#F7F5F0] flex items-center justify-center shadow-xl shadow-[#20362E]/25 hover:bg-[#2E4B40] active:scale-95 transition-all cursor-pointer"
              aria-label={isPlaying ? 'Pausar prática' : 'Continuar prática'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7" />
              ) : (
                <Play className="w-7 h-7 ml-1" />
              )}
            </button>
          )}

          {/* Forward 15s */}
          <button
            onClick={skipForward}
            className="p-3 rounded-full text-[#6E685F] hover:bg-[#EDE7DC] active:scale-95 transition-all flex flex-col items-center gap-0.5 cursor-pointer"
            title="Avançar 15 segundos"
          >
            <RotateCw className="w-5 h-5" />
            <span className="text-[9px] font-mono font-medium">+15s</span>
          </button>
        </div>

        {/* Local audio file loader (for instant testing with the user's real recording) */}
        {isDedicatedAudio && (
          <div className="mt-3 text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-[11px] text-[#8C857B] hover:text-[#20362E] transition-colors cursor-pointer"
              title="Carregar seu arquivo estou-acelerado.mp3 para tocar com sua voz real neste aparelho"
            >
              <Upload className="w-3 h-3" />
              <span>
                {localFileName ? `Áudio carregado: ${localFileName}` : 'Carregar arquivo estou-acelerado.mp3 deste aparelho'}
              </span>
            </button>
          </div>
        )}

        {/* Finish button directly */}
        <div className="mt-2 text-center">
          <button
            onClick={onFinish}
            className="text-xs text-[#8C857B] hover:text-[#20362E] transition-colors underline underline-offset-4 cursor-pointer"
          >
            Concluir agora e ir para reflexão
          </button>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[#F7F5F0] p-6 shadow-2xl border border-[#EDE7DC]">
            <h3 className="font-serif text-xl text-[#20362E]">
              Deseja pausar ou encerrar a prática?
            </h3>
            <p className="mt-2 text-xs text-[#5A544C] leading-relaxed">
              Você pode voltar a qualquer momento. Se preferir, sua pausa já conta como um momento de presença.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#6E685F] hover:bg-[#EDE7DC] transition-colors cursor-pointer"
              >
                Continuar prática
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-full bg-[#BA6640] text-[#F7F5F0] text-xs font-medium hover:bg-[#A85834] transition-colors cursor-pointer"
              >
                Encerrar por agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
