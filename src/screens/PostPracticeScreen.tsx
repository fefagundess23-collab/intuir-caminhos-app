import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Practice, PostPracticeState } from '../types';
import { POST_PRACTICE_OPTIONS } from '../data/practicesData';

interface PostPracticeScreenProps {
  practice: Practice;
  onSave: (feelingAfter: PostPracticeState, feelingLabel: string, note?: string) => void;
}

export const PostPracticeScreen: React.FC<PostPracticeScreenProps> = ({
  practice,
  onSave,
}) => {
  const [selectedState, setSelectedState] = useState<PostPracticeState | null>(null);
  const [reflectionNote, setReflectionNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedState) return;
    const option = POST_PRACTICE_OPTIONS.find((o) => o.id === selectedState);
    const label = option ? option.label : selectedState;
    onSave(selectedState, label, reflectionNote);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#292623] px-6 py-8 flex flex-col justify-between max-w-md mx-auto">
      <div>
        {/* Top Kicker */}
        <span className="text-xs uppercase tracking-widest text-[#BA6640] font-semibold">
          Integração Corporal
        </span>
        <h1 className="font-serif text-3xl text-[#20362E] font-normal mt-1">
          E agora?
        </h1>
        <p className="mt-2 text-sm text-[#5A544C] leading-relaxed">
          Como você percebe seu estado depois da prática?
        </p>

        {/* State Selection List */}
        <div className="mt-6 space-y-2.5">
          {POST_PRACTICE_OPTIONS.map((opt) => {
            const isSelected = selectedState === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedState(opt.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#20362E] text-[#F7F5F0] border-[#20362E] shadow-sm'
                    : 'bg-white/80 text-[#292623] border-[#EDE7DC] hover:border-[#DDD4C4]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl" role="img" aria-label={opt.label}>
                    {opt.emoji}
                  </span>
                  <div>
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div
                      className={`text-xs ${
                        isSelected ? 'text-[#DDE5DC]' : 'text-[#8C857B]'
                      }`}
                    >
                      {opt.description}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#BA6640] flex items-center justify-center text-white shrink-0 ml-2">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Reflection Note Field */}
        <div className="mt-8">
          <label className="block text-xs uppercase tracking-wider text-[#6E685F] font-medium">
            O que você percebeu?
          </label>
          {practice.reflectionQuestion && (
            <p className="mt-1 text-xs italic text-[#BA6640]">
              Sugestão: {practice.reflectionQuestion}
            </p>
          )}

          <textarea
            value={reflectionNote}
            onChange={(e) => setReflectionNote(e.target.value)}
            placeholder="Escreva livremente sobre as sensações, respiração ou apoios (opcional)..."
            rows={3}
            className="mt-2.5 w-full p-3.5 rounded-2xl bg-white/80 border border-[#EDE7DC] text-sm text-[#292623] placeholder-[#A8A196] focus:outline-none focus:border-[#20362E] focus:ring-1 focus:ring-[#20362E] transition-all resize-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-6 pb-safe">
        <button
          type="button"
          disabled={!selectedState}
          onClick={handleSubmit}
          className={`w-full h-14 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            selectedState
              ? 'bg-[#20362E] text-[#F7F5F0] shadow-md hover:bg-[#2E4B40] active:scale-[0.98]'
              : 'bg-[#DDD4C4] text-[#8C857B] cursor-not-allowed'
          }`}
        >
          <span>SALVAR EXPERIÊNCIA</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="mt-2.5 text-center text-[11px] text-[#8C857B]">
          Seu registro fica salvo no seu celular para acompanhar sua evolução.
        </p>
      </div>
    </div>
  );
};
