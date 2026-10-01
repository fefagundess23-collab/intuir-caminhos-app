import React from 'react';
import { Check, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { UserProgressData } from '../types';

interface ConclusionScreenProps {
  progress: UserProgressData;
  onGoHome: () => void;
  onGoJourney: () => void;
}

export const ConclusionScreen: React.FC<ConclusionScreenProps> = ({
  progress,
  onGoHome,
  onGoJourney,
}) => {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#292623] px-6 py-10 flex flex-col justify-between max-w-md mx-auto text-center">
      {/* Visual Affirmation */}
      <div className="my-auto py-6 flex flex-col items-center">
        {/* Animated checkmark ring */}
        <div className="w-20 h-20 rounded-full bg-[#E3ECE1] border-2 border-[#95A593]/40 flex items-center justify-center text-[#20362E] shadow-sm mb-6 animate-in zoom-in-50 duration-500">
          <Check className="w-10 h-10 stroke-[2.5]" />
        </div>

        <span className="text-xs uppercase tracking-[0.2em] text-[#BA6640] font-semibold">
          PRÁTICA CONCLUÍDA ✓
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl text-[#20362E] font-normal mt-3 leading-snug max-w-xs">
          Você acabou de criar um pequeno espaço entre o que estava acontecendo e sua próxima ação.
        </h1>

        {/* Milestone badge */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#EDE7DC] text-xs font-medium text-[#20362E] shadow-xs">
          <Sparkles className="w-4 h-4 text-[#BA6640]" />
          <span>+1 prática concluída</span>
          <span aria-hidden="true">·</span>
          <span>{progress.completedPracticesCount} no total</span>
        </div>

        {/* Journey Progress Mini Indicator */}
        <div className="mt-8 p-4 rounded-2xl bg-white/60 border border-[#EDE7DC] w-full max-w-xs text-left">
          <div className="flex items-center justify-between text-xs text-[#6E685F] mb-1.5">
            <span className="font-medium text-[#20362E]">Jornada de 21 Dias</span>
            <span className="font-mono tabular-nums">{progress.completedDayNumbers.length} / 21</span>
          </div>
          <div className="w-full h-2 bg-[#EDE7DC] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#20362E] rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (progress.completedDayNumbers.length / 21) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-2 text-[11px] text-[#8C857B] leading-relaxed">
            {progress.completedDayNumbers.length >= 7
              ? 'Você completou o ciclo inicial de 7 dias com consistência!'
              : `Faltam ${7 - progress.completedDayNumbers.length} dias para concluir o primeiro ciclo de 7 dias.`}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3 pb-safe pt-4 w-full">
        <button
          onClick={onGoHome}
          className="w-full h-14 rounded-2xl bg-[#20362E] text-[#F7F5F0] font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#2E4B40] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>VOLTAR AO INÍCIO</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onGoJourney}
          className="w-full h-12 rounded-xl border border-[#DDD4C4] text-[#4A453E] font-medium text-xs flex items-center justify-center gap-2 hover:bg-[#EDE7DC] transition-colors cursor-pointer"
        >
          <Compass className="w-4 h-4 text-[#BA6640]" />
          <span>VER MEU PERCURSO</span>
        </button>
      </div>
    </div>
  );
};
