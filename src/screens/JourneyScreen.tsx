import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  Clock,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Practice, UserProgressData } from '../types';
import { PRACTICES } from '../data/practicesData';

interface JourneyScreenProps {
  progress: UserProgressData;
  onSelectPractice: (practice: Practice) => void;
}

export const JourneyScreen: React.FC<JourneyScreenProps> = ({
  progress,
  onSelectPractice,
}) => {
  const [activeTab, setActiveTab] = useState<'trilha' | 'diario'>('trilha');
  const [expandedDayId, setExpandedDayId] = useState<string | null>(null);

  const completedCount = progress.completedDayNumbers.length;
  const progressRatio = Math.round((completedCount / 21) * 100);

  const toggleDayExpand = (dayId: string) => {
    setExpandedDayId(expandedDayId === dayId ? null : dayId);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header */}
      <div className="pt-2">
        <span className="text-xs uppercase tracking-widest text-[#BA6640] font-semibold">
          Meu Percurso
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#20362E] font-normal tracking-tight mt-1">
          21 Dias de Práticas
        </h1>
        <p className="mt-2 text-sm text-[#5A544C] leading-relaxed">
          Pequenas pausas corporais diárias para desarmar a vigilância e reencontrar o eixo.
        </p>
      </div>

      {/* Progress Card */}
      <div className="p-5 rounded-2xl bg-[#EDE7DC]/80 border border-[#DDD4C4] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-[#20362E]">
            Progresso Geral
          </span>
          <span className="font-mono text-sm font-semibold text-[#20362E]">
            {completedCount} / 21 dias
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-[#DDD4C4] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#20362E] rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / 21) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#6E685F] pt-1">
          <span>{completedCount} dias concluídos</span>
          <span>Ciclo 1: Dias 1 a 7 ativos</span>
        </div>
      </div>

      {/* Segmented View Switcher: Trilha vs Diário */}
      <div className="flex items-center p-1 bg-[#EDE7DC]/60 rounded-xl border border-[#DDD4C4]">
        <button
          onClick={() => setActiveTab('trilha')}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'trilha'
              ? 'bg-white text-[#20362E] shadow-xs'
              : 'text-[#6E685F] hover:text-[#20362E]'
          }`}
        >
          Dias da Jornada (1–21)
        </button>
        <button
          onClick={() => setActiveTab('diario')}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'diario'
              ? 'bg-white text-[#20362E] shadow-xs'
              : 'text-[#6E685F] hover:text-[#20362E]'
          }`}
        >
          <span>Meu Diário Corporal</span>
          {progress.journalEntries.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#BA6640] text-white">
              {progress.journalEntries.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'trilha' ? (
        <div className="space-y-4">
          {/* Phase 1: Days 1 to 7 */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-xs uppercase tracking-wider text-[#6E685F] font-semibold">
                Fase 1 • Percepção & Apoio (Dias 1 a 7)
              </span>
              <span className="text-xs text-[#95A593] font-medium">Disponível</span>
            </div>

            <div className="space-y-2.5">
              {PRACTICES.filter((p) => p.dayNumber <= 7).map((practice) => {
                const isCompleted = progress.completedDayNumbers.includes(practice.dayNumber);
                const isExpanded = expandedDayId === practice.id;

                return (
                  <div
                    key={practice.id}
                    className={`rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-[#EAF0E9]/70 border-[#C5D5C4]'
                        : 'bg-white/85 border-[#EDE7DC] hover:border-[#DDD4C4]'
                    }`}
                  >
                    <div
                      onClick={() => toggleDayExpand(practice.id)}
                      className="p-4 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-start gap-3.5 pr-2">
                        {/* Day indicator */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm font-semibold shrink-0 ${
                            isCompleted
                              ? 'bg-[#20362E] text-[#F7F5F0]'
                              : 'bg-[#EDE7DC] text-[#20362E]'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-[#95A593]" />
                          ) : (
                            practice.dayNumber
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] uppercase tracking-wider text-[#BA6640] font-semibold">
                              Dia {practice.dayNumber}
                            </span>
                            <span aria-hidden="true" className="text-[#DDD4C4]">
                              ·
                            </span>
                            <span className="text-xs text-[#6E685F] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#BA6640]" />
                              {practice.durationDisplay}
                            </span>
                          </div>
                          <h3 className="font-serif text-base text-[#20362E] font-medium leading-snug mt-0.5">
                            {practice.title}
                          </h3>
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-label="Expandir detalhes"
                        className="p-1 rounded-full text-[#6E685F] hover:bg-[#EDE7DC]"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-[#EDE7DC]/70 space-y-3 animate-in fade-in">
                        <div className="text-xs text-[#5A544C] space-y-1.5">
                          <p>
                            <strong className="text-[#20362E]">Quando usar:</strong>{' '}
                            {practice.whenToUse}
                          </p>
                          <p>
                            <strong className="text-[#20362E]">A prática:</strong>{' '}
                            {practice.practiceDescription}
                          </p>
                          <p className="italic text-[#BA6640]">
                            <strong>Reflexão pós-prática:</strong> "{practice.reflectionQuestion}"
                          </p>
                        </div>

                        <button
                          onClick={() => onSelectPractice(practice)}
                          className="w-full h-11 rounded-xl bg-[#20362E] text-[#F7F5F0] text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#2E4B40] transition-colors cursor-pointer"
                        >
                          <span>{isCompleted ? 'Refazer Prática' : 'Iniciar Prática'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase 2 & 3: Days 8 to 21 (Upcoming) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-xs uppercase tracking-wider text-[#8C857B] font-semibold">
                Fase 2 & 3 • Dias 8 a 21
              </span>
              <span className="text-xs text-[#8C857B] italic">Em breve</span>
            </div>

            <div className="space-y-2 opacity-75">
              {PRACTICES.filter((p) => p.dayNumber >= 8).map((practice) => (
                <div
                  key={practice.id}
                  className="p-3.5 rounded-2xl bg-[#EDE7DC]/40 border border-[#E2DBD0] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E5DEC9]/50 flex items-center justify-center text-xs text-[#8C857B] font-medium shrink-0">
                      {practice.dayNumber}
                    </div>
                    <div>
                      <div className="text-[11px] text-[#8C857B]">
                        Dia {practice.dayNumber} • {practice.durationDisplay}
                      </div>
                      <h4 className="text-xs font-medium text-[#4A453E]">
                        {practice.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#8C857B] pr-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Fase 2</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Diário Corporal View */
        <div className="space-y-3">
          {progress.journalEntries.length === 0 ? (
            <div className="p-8 text-center bg-white/60 rounded-2xl border border-[#EDE7DC] space-y-2">
              <BookOpen className="w-8 h-8 text-[#BA6640] mx-auto opacity-70" />
              <h3 className="font-serif text-lg text-[#20362E]">Nenhum registro ainda</h3>
              <p className="text-xs text-[#6E685F] max-w-xs mx-auto leading-relaxed">
                Ao concluir cada prática, você poderá anotar como seu corpo se sentiu e o que você percebeu.
              </p>
            </div>
          ) : (
            progress.journalEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-white/80 border border-[#EDE7DC] space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#20362E]">
                    {entry.dayNumber ? `Dia ${entry.dayNumber} • ` : ''}
                    {entry.practiceTitle}
                  </span>
                  <span className="text-[11px] text-[#8C857B]">
                    {new Date(entry.completedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF0E9] text-[#20362E] font-medium">
                    {entry.feelingLabel}
                  </span>
                </div>

                {entry.note && (
                  <p className="text-xs text-[#4A453E] leading-relaxed italic bg-[#F7F5F0] p-2.5 rounded-xl border border-[#EDE7DC]">
                    "{entry.note}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
