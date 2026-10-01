import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Registra o Service Worker automaticamente para instalação PWA e suporte offline
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(<App />);
