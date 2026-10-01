import React from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { QuickNeedOption, Practice } from '../types';
import { QUICK_NEED_OPTIONS, PRACTICES } from '../data/practicesData';

interface QuickNeedScreenProps {
  onSelectOption: (option: QuickNeedOption, recommendedPractice: Practice) => void;
}

export const QuickNeedScreen: React.FC<QuickNeedScreenProps> = ({
  onSelectOption,
}) => {
  const handleItemClick = (item: QuickNeedOption) => {
    const practice = PRACTICES.find((p) => p.id === item.recommendedPracticeId) || PRACTICES[0];
    onSelectOption(item, practice);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Editorial Header */}
      <div className="pt-2">
        <span className="text-xs uppercase tracking-widest text-[#BA6640] font-semibold">
          Pronto-Atendimento Corporal
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#20362E] font-normal tracking-tight mt-1">
          Preciso Agora
        </h1>
        <p className="mt-2 text-sm text-[#5A544C] leading-relaxed">
          Não sabe por onde começar? Escolha o que está acontecendo com você neste exato minuto.
        </p>
      </div>

      {/* 8 Quick Need Buttons */}
      <div className="space-y-2.5">
        {QUICK_NEED_OPTIONS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="w-full text-left p-4 rounded-2xl bg-white/80 border border-[#EDE7DC] hover:border-[#DDD4C4] hover:bg-white active:scale-[0.985] transition-all shadow-xs flex items-center justify-between group cursor-pointer"
          >
            <div className="pr-3">
              <span className="text-[11px] uppercase tracking-wider text-[#BA6640] font-semibold">
                {item.kicker}
              </span>
              <h3 className="text-base font-medium text-[#20362E] group-hover:text-[#BA6640] transition-colors leading-snug mt-0.5">
                {item.label}
              </h3>
              <p className="text-xs text-[#6E685F] mt-1 leading-relaxed">
                {item.explanation}
              </p>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#F7F5F0] border border-[#EDE7DC] flex items-center justify-center text-[#6E685F] group-hover:bg-[#20362E] group-hover:text-[#F7F5F0] group-hover:border-[#20362E] transition-all shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>

      {/* Organic reminder card */}
      <div className="p-4 rounded-2xl bg-[#EDE7DC]/50 border border-[#DDD4C4] text-xs text-[#6E685F] leading-relaxed text-center">
        <span>
          Lembre-se: o objetivo não é "apagar" o que você sente, mas sim dar ao corpo o apoio que ele precisa para desarmar o alarme.
        </span>
      </div>
    </div>
  );
};
