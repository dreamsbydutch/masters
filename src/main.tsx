import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/tailwind.css';

function loadLocalFonts() {
  if (!('fonts' in document) || typeof FontFace === 'undefined') {
    return;
  }

  const fonts = [new FontFace('MastersSlab', 'url("/assets/fonts/TD-Corki-Regular.otf")')];

  fonts.forEach((font) => {
    void font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });
  });
}

loadLocalFonts();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
