import React from 'react';
import { ArrowRight, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
import { UserStateOption, UserProgressData, Practice } from '../types';
import { USER_STATE_OPTIONS, PRACTICES } from '../data/practicesData';

interface HomeScreenProps {
  progress: UserProgressData;
  onSelectState: (stateOption: UserStateOption) => void;
  onStartPractice: (practice: Practice) => void;
  onGoToJourney: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  onSelectState,
  onStartPractice,
  onGoToJourney,
}) => {
  // Find current next day in journey (first incomplete day between 1 and 7)
  const nextDayNumber =
    [1, 2, 3, 4, 5, 6, 7].find((d) => !progress.completedDayNumbers.includes(d)) || 1;
  const currentDayPractice = PRACTICES.find((p) => p.dayNumber === nextDayNumber);

  return (
    <div className="space-y-6 pb-24">
      {/* Editorial Header */}
      <div className="pt-2">
        <span className="text-xs uppercase tracking-widest text-[#BA6640] font-semibold">
          Check-in Somático
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#20362E] font-normal tracking-tight mt-1">
          Como você está agora?
        </h1>
        <p className="mt-2 text-sm text-[#5A544C] leading-relaxed">
          Escolha o que mais se aproxima do que está acontecendo com você neste momento.
        </p>
      </div>

      {/* 6 Large State Option Cards */}
      <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
        {USER_STATE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelectState(opt)}
            className="w-full text-left p-4 rounded-2xl bg-white/80 border border-[#EDE7DC] hover:border-[#DDD4C4] hover:bg-white active:scale-[0.985] transition-all shadow-xs flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-start gap-3.5 pr-3">
              <span
                className="text-2xl sm:text-3xl shrink-0 mt-0.5"
                role="img"
                aria-label={opt.label}
              >
                {opt.emoji}
              </span>
              <div>
                <h3 className="text-base font-medium text-[#20362E] group-hover:text-[#BA6640] transition-colors leading-snug">
                  {opt.label}
                </h3>
                <p className="text-xs text-[#6E685F] mt-0.5 leading-relaxed line-clamp-1 sm:line-clamp-none">
                  {opt.summary}
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#F7F5F0] border border-[#EDE7DC] flex items-center justify-center text-[#6E685F] group-hover:bg-[#20362E] group-hover:text-[#F7F5F0] group-hover:border-[#20362E] transition-all shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>

      {/* Current Journey Continuation Banner */}
      {currentDayPractice && (
        <div className="p-4.5 rounded-2xl bg-[#EDE7DC]/70 border border-[#DDD4C4] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#BA6640] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#20362E]">
                Seu percurso hoje • Dia {nextDayNumber}
              </span>
            </div>
            <button
              onClick={onGoToJourney}
              className="text-xs text-[#BA6640] hover:underline font-medium cursor-pointer"
            >
              Ver todos os 21 dias
            </button>
          </div>

          <div>
            <h4 className="font-serif text-lg text-[#20362E] font-medium leading-snug">
              {currentDayPractice.title}
            </h4>
            <p className="text-xs text-[#5A544C] mt-1 leading-relaxed">
              {currentDayPractice.practiceDescription}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#6E685F]">
              Duração: {currentDayPractice.durationDisplay}
            </span>
            <button
              onClick={() => onStartPractice(currentDayPractice)}
              className="px-3.5 py-1.5 rounded-xl bg-[#20362E] text-[#F7F5F0] text-xs font-medium hover:bg-[#2E4B40] transition-colors cursor-pointer"
            >
              Praticar agora
            </button>
          </div>
        </div>
      )}

      {/* Gentle Somatic Anchor Box */}
      <div className="p-4 rounded-2xl bg-white/40 border border-[#EDE7DC] text-center">
        <p className="font-serif italic text-sm text-[#4A453E]">
          "O corpo não precisa de pressa para se reorganizar. Ele só precisa de um instante em que você pare de brigar com ele."
        </p>
        <span className="mt-1 block text-[11px] uppercase tracking-wider text-[#8C857B]">
          Princípio Intuir Caminhos
        </span>
      </div>
    </div>
  );
};
