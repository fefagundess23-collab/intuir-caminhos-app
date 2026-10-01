import React, { useState } from 'react';
import { Download, Share2, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-[#20362E] text-[#F7F5F0] hover:bg-[#2E4B40] transition-colors shadow-sm"
        title="Instalar aplicativo"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-[#DDD4C4] text-[#292623] hover:bg-[#EDE7DC] transition-colors"
          title="Instalar no iPhone"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Instalar no Celular</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-3xl bg-[#F7F5F0] p-6 shadow-2xl border border-[#EDE7DC]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#BA6640] font-medium">Instalação Mobile</span>
                  <h3 className="font-serif text-xl font-medium text-[#20362E] mt-0.5">
                    Adicionar à Tela de Início
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-[#6E685F] hover:bg-[#EDE7DC]"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-[#4A453E]">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/70 border border-[#EDE7DC]">
                  <Share2 className="w-5 h-5 text-[#20362E] shrink-0 mt-0.5" />
                  <p>
                    1. No Safari do seu iPhone, toque no botão <strong>Compartilhar</strong> na barra inferior.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/70 border border-[#EDE7DC]">
                  <Download className="w-5 h-5 text-[#20362E] shrink-0 mt-0.5" />
                  <p>
                    2. Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-2xl bg-[#20362E] py-3 text-sm font-medium text-[#F7F5F0] hover:bg-[#2E4B40] transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
