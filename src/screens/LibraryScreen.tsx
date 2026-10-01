import React, { useState } from 'react';
import { Clock, Heart, ArrowRight, Filter, Search } from 'lucide-react';
import { Practice, PracticeCategory, UserProgressData } from '../types';
import { PRACTICES } from '../data/practicesData';

interface LibraryScreenProps {
  progress: UserProgressData;
  onSelectPractice: (practice: Practice) => void;
  onToggleFavorite: (practiceId: string) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  progress,
  onSelectPractice,
  onToggleFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'todas', label: 'Todas' },
    { id: 'desaceleracao', label: 'Desaceleração' },
    { id: 'respiracao', label: 'Respiração' },
    { id: 'apoio', label: 'Apoio & Chão' },
    { id: 'presenca', label: 'Presença' },
  ];

  // Available practices
  const activePractices = PRACTICES.filter((p) => p.isAvailable);

  const filteredPractices = activePractices.filter((p) => {
    const matchesCategory =
      selectedCategory === 'todas' || p.category === selectedCategory;
    const matchesFavorite =
      !filterFavoritesOnly || progress.favoritePracticeIds.includes(p.id);
    const matchesQuery =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.descricao && p.descricao.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.focusArea && p.focusArea.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesFavorite && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Editorial Header */}
      <div className="pt-2">
        <span className="text-xs uppercase tracking-widest text-[#BA6640] font-semibold">
          Biblioteca Corporal
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#20362E] font-normal tracking-tight mt-1">
          Práticas Disponíveis
        </h1>
        <p className="mt-2 text-sm text-[#5A544C] leading-relaxed">
          Explore o acervo de práticas somáticas curtas para usar no seu próprio tempo.
        </p>
      </div>

      {/* Category Filter Pills (Functional interactive buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#20362E] text-[#F7F5F0]'
                : 'bg-white/80 text-[#6E685F] border border-[#EDE7DC] hover:border-[#DDD4C4]'
            }`}
          >
            {cat.label}
          </button>
        ))}

        <button
          onClick={() => setFilterFavoritesOnly(!filterFavoritesOnly)}
          className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
            filterFavoritesOnly
              ? 'bg-[#BA6640] text-white'
              : 'bg-white/80 text-[#6E685F] border border-[#EDE7DC]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${filterFavoritesOnly ? 'fill-white' : ''}`} />
          <span>Favoritas</span>
        </button>
      </div>

      {/* Practices List */}
      <div className="space-y-3">
        {filteredPractices.length === 0 ? (
          <div className="p-8 text-center bg-white/60 rounded-2xl border border-[#EDE7DC]">
            <p className="text-sm text-[#6E685F]">Nenhuma prática encontrada com estes filtros.</p>
          </div>
        ) : (
          filteredPractices.map((practice) => {
            const isFav = progress.favoritePracticeIds.includes(practice.id);
            const isDone = progress.completedDayNumbers.includes(practice.dayNumber);

            return (
              <div
                key={practice.id}
                className="p-4 rounded-2xl bg-white/85 border border-[#EDE7DC] hover:border-[#DDD4C4] transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
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
                    {isDone && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF0E9] text-[#20362E] font-medium">
                        Concluída
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onToggleFavorite(practice.id)}
                    className="p-1 rounded-full text-[#8C857B] hover:text-[#BA6640] transition-colors cursor-pointer"
                    aria-label={isFav ? 'Remover dos favoritos' : 'Favoritar prática'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'fill-[#BA6640] text-[#BA6640]' : ''
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <h3 className="font-serif text-lg text-[#20362E] font-medium leading-snug">
                    {practice.title}
                  </h3>
                  <p className="text-xs text-[#5A544C] mt-1 leading-relaxed">
                    {practice.practiceDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EDE7DC] flex items-center justify-between">
                  <span className="text-[11px] text-[#8C857B]">
                    Quando usar: {practice.whenToUse}
                  </span>

                  <button
                    onClick={() => onSelectPractice(practice)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#20362E] text-[#F7F5F0] text-xs font-medium flex items-center gap-1.5 hover:bg-[#2E4B40] transition-colors cursor-pointer"
                  >
                    <span>Praticar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
