import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import './assets/styles/global.css';
import './assets/styles/sidebar.css';
import './assets/styles/combo-editor.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
