/* ALÈ · Roberto · animaciones de ejercicios retiradas temporalmente.
   El bundle está compilado y contiene el reproductor interno. Esta capa
   elimina la presentación y pausa cualquier reproductor que React llegue a montar,
   sin tocar la prescripción, el registro ni la lógica de sesión. */
(() => {
  'use strict';

  const style = document.createElement('style');
  style.id = 'ale-exercise-animations-off';
  style.textContent = `
    /* Visual de l'exercici i la seva banda de tempo. */
    .figbox { display:none !important; }
    .figbox + .wave { display:none !important; }
    .figbox + .wave + .row { display:none !important; }
    .figbox + .wave + .row + .cap2 { display:none !important; }
  `;
  document.head.appendChild(style);

  const defer = window.queueMicrotask
    ? window.queueMicrotask.bind(window)
    : fn => Promise.resolve().then(fn);

  let queued = false;
  function pauseMountedPlayers() {
    queued = false;
    document.querySelectorAll('.figbox + .wave + .row').forEach(row => {
      const pause = [...row.querySelectorAll('button')].find(button =>
        button.textContent.trim().toLowerCase() === 'pausa'
      );
      if (pause) pause.click();
    });
  }

  function queuePause() {
    if (queued) return;
    queued = true;
    defer(pauseMountedPlayers);
  }

  const observer = new MutationObserver(queuePause);
  observer.observe(document.documentElement, { childList:true, subtree:true });
  document.addEventListener('DOMContentLoaded', queuePause, { once:true });
  window.addEventListener('load', queuePause, { once:true });
})();