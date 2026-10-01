import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Registra o Service Worker automaticamente para instalação PWA e suporte offline
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Força atualização imediata para substituir qualquer manifesto/cache antigo
    updateSW(true);
  },
  onOfflineReady() {
    console.log('Intuir Caminhos: pronto para uso offline.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
