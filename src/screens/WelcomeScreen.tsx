import React from 'react';
import { ArrowRight } from 'lucide-react';
import welcomeImage from '../assets/images/welcome_presence_stone_1790877878287.jpg';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#F7F5F0] text-[#292623] px-6 py-8 sm:py-12 overflow-hidden">
      {/* Background organic blur elements */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#EDE7DC]/70 blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 -left-20 w-72 h-72 rounded-full bg-[#E3ECE1]/60 blur-3xl pointer-events-none" />

      {/* Top brand mark */}
      <header className="relative z-10 pt-2 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.22em] text-[#6E685F] font-medium">
          Intuir Caminhos
        </span>
        <span className="text-[11px] text-[#8C857B] tracking-wider uppercase">
          Edição MVP
        </span>
      </header>

      {/* Hero Visual Composition */}
      <div className="relative z-10 my-auto py-6 flex flex-col items-center">
        {/* Subtle breathing circle framing the tactile image */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#DDD4C4] animate-breathe-glow" />
          <div className="absolute inset-3 rounded-full border border-[#D5CDBD]/60 animate-breathe" />
          
          <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full overflow-hidden shadow-xl shadow-[#20362E]/10 border-4 border-[#F7F5F0]">
            <img
              src={welcomeImage}
              alt="Composição de pedras de rio e presença natural"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-105"
            />
          </div>
        </div>

        {/* Title and Core Concept */}
        <div className="mt-8 text-center max-w-sm">
          <h1 className="font-serif text-3xl sm:text-4xl leading-[1.15] tracking-tight text-[#20362E] font-normal">
            SAINDO DO<br />
            <span className="italic font-light">ESTADO DE ALERTA</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#5A544C] font-normal">
            21 dias de práticas curtas para desacelerar o corpo, perceber o que está acontecendo e encontrar recursos para voltar ao seu eixo.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-xs text-[#8C857B]">
            <span>por Intuir Caminhos</span>
            <span aria-hidden="true">·</span>
            <span>Práticas de 5 a 10 min</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="relative z-10 pb-safe pt-4 max-w-sm w-full mx-auto">
        <button
          onClick={onStart}
          className="w-full h-14 rounded-2xl bg-[#20362E] text-[#F7F5F0] font-medium text-base flex items-center justify-center gap-3 shadow-lg shadow-[#20362E]/15 hover:bg-[#2E4B40] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>COMEÇAR</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="mt-3 text-center text-[11px] text-[#8C857B] leading-tight">
          Práticas corporais somáticas para o cotidiano. Sem esforço excessivo.
        </p>
      </div>
    </div>
  );
};
