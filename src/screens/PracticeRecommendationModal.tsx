import React from 'react';
import { X, Clock, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { Practice, UserStateOption } from '../types';

interface PracticeRecommendationModalProps {
  practice: Practice;
  stateOption?: UserStateOption;
  customLeadKicker?: string;
  customLeadMessage?: string;
  onClose: () => void;
  onStartPractice: (practice: Practice) => void;
  onExploreOther: () => void;
}

export const PracticeRecommendationModal: React.FC<PracticeRecommendationModalProps> = ({
  practice,
  stateOption,
  customLeadKicker,
  customLeadMessage,
  onClose,
  onStartPractice,
  onExploreOther,
}) => {
  const kicker = customLeadKicker || stateOption?.leadKicker || practice.title.toUpperCase() + '?';
  const lead = customLeadMessage || stateOption?.leadMessage || 'Uma prática curta para perceber o corpo e desacelerar o ritmo.';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#F7F5F0] rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl border-t sm:border border-[#EDE7DC] max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Grab handle for mobile touch */}
        <div className="w-10 h-1 bg-[#DDD4C4] rounded-full mx-auto mb-4 sm:hidden" />

        {/* Top dismiss */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-[#BA6640] font-semibold">
            Recomendação Corporal
          </span>
          <button
            onClick={onClose}
            className="p-1.5 -mr-1.5 rounded-full text-[#6E685F] hover:bg-[#EDE7DC] transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Kicker & Subtitle */}
        <div className="mt-4">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#20362E] leading-tight font-normal">
            {kicker}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#4A453E] italic">
            "{lead}"
          </p>
        </div>

        {/* Practice Details Card */}
        <div className="mt-5 p-4.5 rounded-2xl bg-white/80 border border-[#EDE7DC] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#6E685F]">
            <span className="font-medium text-[#20362E]">Dia {practice.dayNumber} da jornada</span>
            <div className="flex items-center gap-1.5 font-medium text-[#20362E]">
              <Clock className="w-3.5 h-3.5 text-[#BA6640]" />
              <span>{practice.durationDisplay}</span>
            </div>
          </div>

          <h3 className="font-serif text-lg text-[#20362E] font-medium leading-snug">
            {practice.title}
          </h3>

          <p className="text-xs leading-relaxed text-[#5A544C]">
            {practice.practiceDescription}
          </p>

          {practice.focusArea && (
            <div className="pt-2 border-t border-[#EDE7DC] flex items-center gap-2 text-[11px] text-[#6E685F]">
              <Compass className="w-3.5 h-3.5 text-[#95A593] shrink-0" />
              <span>Foco: {practice.focusArea}</span>
            </div>
          )}
        </div>

        {/* Gentle reassurance notice */}
        <div className="mt-4 flex items-start gap-2.5 px-1 text-[11px] text-[#8C857B] leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#95A593] shrink-0 mt-0.5" />
          <span>
            Não há jeito certo ou errado. Você pode pausar ou interromper a qualquer momento.
          </span>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-2.5 pb-safe">
          <button
            onClick={() => onStartPractice(practice)}
            className="w-full h-13 rounded-2xl bg-[#20362E] text-[#F7F5F0] font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#2E4B40] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>COMEÇAR PRÁTICA</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreOther}
            className="w-full h-11 rounded-xl border border-[#DDD4C4] text-[#4A453E] font-medium text-xs flex items-center justify-center hover:bg-[#EDE7DC] transition-colors cursor-pointer"
          >
            VER OUTRAS PRÁTICAS
          </button>
        </div>
      </div>
    </div>
  );
};
