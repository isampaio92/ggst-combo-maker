import React from 'react';
import { APP_CONFIG } from '../config/config';

/**
 * Componente raiz inicial (Fase 1 - Infraestrutura e Base do Projeto).
 * Os módulos funcionais (Sidebar, Criação/Edição e Leitura) serão conectados nas próximas fases.
 */
export const App: React.FC = () => {
  return (
    <main style={{ padding: 'var(--space-xl)' }}>
      <header
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '4px solid var(--brand-red)',
          padding: 'var(--space-lg)',
          boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.8)',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', lineHeight: 1 }}>{APP_CONFIG.appName}</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
          Estrutura base inicializada (v{APP_CONFIG.version}). Pronto para as fases funcionais.
        </p>
      </header>
    </main>
  );
};

export default App;
