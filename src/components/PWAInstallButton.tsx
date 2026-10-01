import React, { useState } from 'react';
import { Download, Share2, X, Smartphone, MoreVertical } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Se já estiver rodando como aplicativo instalado (standalone), oculta o botão
  if (isInstalled) {
    return null;
  }

  const handleButtonClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-[#20362E] text-[#F7F5F0] hover:bg-[#2E4B40] transition-colors shadow-xs cursor-pointer"
        title="Instalar aplicativo no celular"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar App</span>
      </button>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[#F7F5F0] p-6 shadow-2xl border border-[#EDE7DC]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#BA6640] font-medium">
                  Instalação no Celular
                </span>
                <h3 className="font-serif text-xl font-medium text-[#20362E] mt-0.5">
                  Adicionar ao Celular
                </h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-full text-[#6E685F] hover:bg-[#EDE7DC] cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              /* Instruções específicas para iOS Safari */
              <div className="mt-4 space-y-3 text-sm text-[#4A453E]">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/80 border border-[#EDE7DC]">
                  <Share2 className="w-5 h-5 text-[#20362E] shrink-0 mt-0.5" />
                  <p>
                    1. No <strong>Safari</strong> do seu iPhone, toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta para cima).
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/80 border border-[#EDE7DC]">
                  <Download className="w-5 h-5 text-[#20362E] shrink-0 mt-0.5" />
                  <p>
                    2. Role a lista e toque em <strong>"Adicionar à Tela de Início"</strong>.
                  </p>
                </div>
              </div>
            ) : (
              /* Instruções para Android (Chrome, Samsung Internet, Edge, etc.) */
              <div className="mt-4 space-y-3 text-sm text-[#4A453E]">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/80 border border-[#EDE7DC]">
                  <MoreVertical className="w-5 h-5 text-[#20362E] shrink-0 mt-0.5" />
                  <p>
                    1. No navegador do seu celular (Chrome), toque no menu dos <strong>três pontos</strong> no canto superior direito.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/80 border border-[#EDE7DC]">
                  <Download className="w-5 h-5 text-[#20362E] shrink-0 mt-0.5" />
                  <p>
                    2. Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuideModal(false)}
              className="mt-5 w-full rounded-2xl bg-[#20362E] py-3 text-sm font-medium text-[#F7F5F0] hover:bg-[#2E4B40] transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
