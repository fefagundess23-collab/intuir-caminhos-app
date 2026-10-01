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
  Music,
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

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(() => practice.durationMinutes * 60);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState(false);

  // Ambient sound and UX state
  const [ambientSoundActive, setAmbientSoundActive] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Resolved audio URL from media service (allows local or Firebase Storage)
  const resolvedAudioSrc = mediaService.resolveAudioUrl(practice);

  const phrases =
    (practice.instrucoes && practice.instrucoes.length > 0)
      ? practice.instrucoes
      : (practice.guidedPhrases && practice.guidedPhrases.length > 0)
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

  // Play opening bell chime on mount
  useEffect(() => {
    soundService.playBell();
    return () => {
      soundService.stopAmbient();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Try auto-play when audio is ready
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay was prevented by browser policy; user will tap Play
          setIsPlaying(false);
        });
    }
  }, [resolvedAudioSrc]);

  // Update current guidance phrase based on time progression
  useEffect(() => {
    if (duration <= 0) return;
    const progressRatio = currentTime / duration;
    const phraseIndex = Math.min(
      Math.floor(progressRatio * phrases.length),
      phrases.length - 1
    );
    setCurrentPhraseIndex(phraseIndex);
  }, [currentTime, duration, phrases.length]);

  // Audio event handlers
  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
      setIsAudioLoaded(true);
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
    soundService.playBell();
    setTimeout(() => {
      onFinish();
    }, 1200);
  };

  const handleAudioError = () => {
    console.warn('Could not load physical audio file; fallback timer in place.');
    setAudioError(true);
  };

  // Play / Pause toggle
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

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

  // Ambient sound toggle
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

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#F7F5F0] text-[#292623] px-6 py-6 overflow-hidden select-none">
      {/* Real HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={resolvedAudioSrc}
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleAudioError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
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
            {practice.duracao || practice.durationDisplay}
          </span>
        </div>

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
          <span>{ambientSoundActive ? 'Ambiente' : 'Ambiente'}</span>
        </button>
      </div>

      {/* Center Somatic Arena: Breathing Orb & Guidance Phrases */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center px-2 py-4">
        {/* Title */}
        <h2 className="font-serif text-2xl sm:text-3xl text-[#20362E] tracking-tight font-normal max-w-xs">
          {practice.titulo || practice.title}
        </h2>

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
            {isPlaying ? 'Reproduzindo áudio guiado' : 'Áudio pausado'}
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
          </div>
        </div>

        {/* Softly Fading Guidance Phrase / Instruction */}
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
          {/* Rewind 15s */}
          <button
            onClick={skipBackward}
            className="p-3 rounded-full text-[#6E685F] hover:bg-[#EDE7DC] active:scale-95 transition-all flex flex-col items-center gap-0.5 cursor-pointer"
            title="Voltar 15 segundos"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-[9px] font-mono font-medium">-15s</span>
          </button>

          {/* Big Play / Pause Button */}
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

        {/* Finish button directly */}
        <div className="mt-3 text-center">
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
            <h3 className="font-serif text-xl text-[#20362E] font-medium">
              Deseja interromper a prática?
            </h3>
            <p className="mt-2 text-sm text-[#5A544C] leading-relaxed">
              Você pode pausar e retornar quando quiser, ou registrar como se sente agora.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onFinish();
                }}
                className="w-full h-11 rounded-xl bg-[#20362E] text-[#F7F5F0] text-xs font-medium hover:bg-[#2E4B40] transition-colors cursor-pointer"
              >
                Concluir agora e registrar estado
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onCancel();
                }}
                className="w-full h-11 rounded-xl border border-[#DDD4C4] text-[#6E685F] text-xs font-medium hover:bg-[#EDE7DC] transition-colors cursor-pointer"
              >
                Sair sem salvar
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-2 text-xs text-[#8C857B] hover:text-[#20362E] cursor-pointer"
              >
                Voltar à prática
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
