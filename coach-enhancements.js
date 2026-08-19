/*
  Mejoras de coaching · ALÈ · Roberto
  Capa no invasiva sobre el motor principal:
  - cardio explicado en pasos claros
  - recordatorios discretos de hidratación
  - pauta respiratoria específica por ejercicio
*/
(() => {
  'use strict';

  const STYLE_ID = 'ale-coach-enhancements-style';
  const HYDRATION_EVERY_MS = 15 * 60 * 1000;
  const ACTIVE_GRACE_MS = 30 * 1000;

  const cardioPlans = [
    {
      key: 'b1',
      match: '8 minutos seguidos',
      rows: [
        ['Modalidad', 'Bici o elíptica'],
        ['Duración', '8:00 seguidos'],
        ['Intensidad', 'RPE 3-4 · conversación completa'],
        ['Cuándo', 'Al terminar la sesión A o C, con el semáforo verde']
      ]
    },
    {
      key: 'b2',
      match: '10 minutos seguidos',
      rows: [
        ['Modalidad', 'Bici o elíptica'],
        ['Duración', '10:00 seguidos'],
        ['Intensidad', 'RPE 3-4 · conversación completa'],
        ['Cuándo', 'Al terminar la sesión A o C, con el semáforo verde']
      ]
    },
    {
      key: 'b3',
      match: '12 minutos seguidos',
      rows: [
        ['Modalidad', 'Bici o elíptica'],
        ['Duración', '12:00 seguidos'],
        ['Intensidad', 'RPE 3-4 · conversación completa'],
        ['Cuándo', 'Al terminar la sesión A o C, con el semáforo verde']
      ]
    },
    {
      key: 'b4',
      match: '12-15 minutos seguidos',
      rows: [
        ['Modalidad', 'Bici o elíptica'],
        ['Duración', '12:00-15:00 seguidos'],
        ['Intensidad', 'RPE 3-4 · solo con el semáforo verde'],
        ['Meta', 'Tolerar 12-15 min sin más cansancio']
      ]
    }
  ];

  const breathing = {
    A1: 'Inspira mientras dejas subir la barra; espira mientras llevas los codos hacia abajo.',
    A2: 'Inspira mientras bajas; espira mientras empujas.',
    A3: 'Inspira en la bajada; espira mientras empujas la plataforma. No bloquees el aire.',
    A4: 'Inspira al alargar los brazos; espira mientras llevas los codos atrás.',
    A5: 'Espira mientras subes los brazos; inspira mientras bajas con control.',
    A6: 'Inspira mientras bajas; espira mientras flexionas los codos.',
    B1: 'Inspira mientras bajas; espira mientras empujas.',
    B2: 'Inspira al volver; espira mientras traes el agarre hacia ti.',
    B3: 'Inspira mientras extiendes las piernas; espira mientras flexionas.',
    B4: 'Inspira mientras bajas; espira mientras empujas por encima de la cabeza.',
    B5: 'Inspira al abrir; espira mientras juntas los brazos delante del pecho.',
    B6: 'Inspira al dejar subir el agarre; espira mientras extiendes los codos.',
    C1: 'Inspira mientras dejas subir el agarre; espira mientras bajas los codos.',
    C2: 'Inspira mientras bajas las mancuernas; espira mientras las empujas.',
    C3: 'Inspira mientras bajas; espira mientras extiendes las rodillas.',
    C4: 'Inspira mientras extiendes; espira mientras flexionas.',
    C5: 'Espira mientras abres los brazos; inspira mientras vuelves con control.',
    C6: 'Espira mientras subes; inspira mientras bajas.',
    C7: 'Inspira mientras bajas; espira mientras subes.'
  };

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .coach-plan{margin:8px 0 4px;padding:11px 12px;border-radius:13px;background:rgba(46,125,114,.07);border:.5px solid rgba(46,125,114,.18)}
      .coach-plan-title{font-size:10px;font-weight:750;letter-spacing:.12em;text-transform:uppercase;color:var(--ac,#2E7D72);margin-bottom:6px}
      .coach-plan-row{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:7px 0;border-top:.5px solid var(--line,rgba(74,62,48,.10));font-size:12.5px;line-height:1.35}
      .coach-plan-row:first-of-type{border-top:0}
      .coach-plan-row span{color:var(--tx2,#6F665B)}
      .coach-plan-row b{color:var(--tx,#2E2A25);text-align:right;font-weight:650}
      .coach-plan-foot{margin-top:7px;font-size:11.5px;line-height:1.4;color:var(--tx2,#6F665B)}
      .coach-breath{margin:10px 0 0;padding:11px 12px;border-radius:13px;background:rgba(180,118,63,.07);border:.5px solid rgba(180,118,63,.20)}
      .coach-breath-head{font-size:10px;font-weight:750;letter-spacing:.12em;text-transform:uppercase;color:var(--ac2,#B4763F);margin-bottom:5px}
      .coach-breath p{margin:0;font-size:12.5px;line-height:1.45;color:var(--tx,#2E2A25)}
      .coach-breath small{display:block;margin-top:5px;font-size:10.5px;line-height:1.35;color:var(--tx3,#9C9184)}
      .coach-hydration-start,.coach-cardio-guide{margin:0 0 12px;padding:11px 12px;border-radius:13px;background:rgba(46,125,114,.08);border:.5px solid rgba(46,125,114,.20);font-size:12.5px;line-height:1.45;color:var(--tx,#2E2A25)}
      .coach-hydration-start b,.coach-cardio-guide b{color:var(--ac,#2E7D72)}
      .coach-toast{position:fixed;left:50%;bottom:max(86px,calc(env(safe-area-inset-bottom) + 74px));transform:translate(-50%,18px);width:min(360px,calc(100vw - 32px));box-sizing:border-box;padding:12px 14px;border-radius:15px;background:#2E2A25;color:#FFFBF4;box-shadow:0 12px 32px rgba(0,0,0,.22);font-size:13px;line-height:1.4;z-index:99999;opacity:0;pointer-events:none;transition:opacity .22s ease,transform .22s ease}
      .coach-toast.show{opacity:1;transform:translate(-50%,0)}
      .coach-toast b{color:#B9E1DB}
    `;
    document.head.appendChild(style);
  }

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function enhanceCardioSummaries() {
    // Limpieza: cajas huérfanas (el párrafo origen ya no existe o cambió de bloque)
    for (const box of [...document.querySelectorAll('.coach-plan')]) {
      const prev = box.previousElementSibling;
      if (!prev || prev.tagName !== 'P' || prev.dataset.coachCardioSource !== box.dataset.coachPlan) {
        box.remove();
      }
    }
    const paragraphs = [...document.querySelectorAll('p')];
    for (const p of paragraphs) {
      const tagged = p.dataset.coachCardioSource;
      if (tagged) {
        const current = cardioPlans.find(item => item.key === tagged);
        const textNow = (p.textContent || '').trim();
        if (current && textNow.includes(current.match)) continue;
        // React reutilizó este nodo con otro texto: re-etiquetar desde cero
        delete p.dataset.coachCardioSource;
        p.style.display = '';
        const stale = p.nextElementSibling;
        if (stale && stale.classList && stale.classList.contains('coach-plan')) stale.remove();
      }
      const text = (p.textContent || '').trim();
      const plan = cardioPlans.find(item => text.includes(item.match));
      if (!plan) continue;

      p.dataset.coachCardioSource = plan.key;
      p.style.display = 'none';

      const box = make('div', 'coach-plan');
      box.dataset.coachPlan = plan.key;
      box.appendChild(make('div', 'coach-plan-title', 'Qué tienes que hacer'));

      for (const [label, value] of plan.rows) {
        const row = make('div', 'coach-plan-row');
        row.appendChild(make('span', '', label));
        row.appendChild(make('b', '', value));
        box.appendChild(row);
      }

      box.appendChild(make('div', 'coach-plan-foot', 'No hace falta memorizarlo: al empezar la exposición, la app te guía con la cuenta atrás.'));
      p.insertAdjacentElement('afterend', box);
    }
  }

  function currentNavbarHead() {
    const head = document.querySelector('.sheet .navbar .head');
    return head ? (head.textContent || '').trim() : '';
  }

  function enhanceActiveCardio() {
    const head = currentNavbarHead();
    const onCardio = /^Cardio · bloque\s+\d+/i.test(head);
    const stale = document.querySelector('[data-coach-cardio-guide]');
    if (!onCardio) {
      if (stale) stale.remove();
      return;
    }
    const wrap = document.querySelector('.sheet .wrap');
    if (!wrap || wrap.querySelector('[data-coach-cardio-guide]')) return;

    const card = make('div', 'coach-cardio-guide');
    card.dataset.coachCardioGuide = '1';
    const bold = make('b', '', 'Sigue la pantalla. ');
    card.appendChild(bold);
    card.append('No tienes que recordar nada: la cuenta atrás te guía hasta el final. Ritmo de conversación; ten agua a mano.');
    wrap.insertBefore(card, wrap.firstChild);
  }

  function enhanceCheckinHydration() {
    const head = currentNavbarHead();
    if (head !== 'Antes de empezar') {
      const stale = document.querySelector('[data-coach-hydration-start]');
      if (stale) stale.remove();
      return;
    }
    const wrap = document.querySelector('.sheet .wrap');
    if (!wrap || wrap.querySelector('[data-coach-hydration-start]')) return;
    if (!(wrap.textContent || '').includes('Energía')) return;

    const card = make('div', 'coach-hydration-start');
    card.dataset.coachHydrationStart = '1';
    const bold = make('b', '', 'Antes de empezar · ');
    card.appendChild(bold);
    card.append('deja una botella de agua a mano. Durante la sesión te haremos recordatorios discretos; hidrátate según la sed y las condiciones.');
    wrap.insertBefore(card, wrap.firstChild);
  }

  function enhanceBreathing() {
    const head = currentNavbarHead();
    const match = head.match(/^([ABC]\d)\s*·/);
    if (!match) {
      // fuera de la pantalla de ejercicio no debe quedar ninguna tarjeta
      document.querySelectorAll('[data-coach-breath]').forEach(node => node.remove());
      return;
    }
    const id = match[1];
    const cue = breathing[id];
    if (!cue) return;

    const wrap = document.querySelector('.sheet .wrap');
    if (!wrap) return;
    // si la pantalla cambió de ejercicio, retirar la tarjeta del anterior
    wrap.querySelectorAll('[data-coach-breath]').forEach(node => {
      if (node.dataset.coachBreath !== id) node.remove();
    });
    if (wrap.querySelector(`[data-coach-breath="${id}"]`)) return;

    const prescription = [...wrap.querySelectorAll('p.cap')].find(p => {
      const text = p.textContent || '';
      return text.includes('descanso') && (text.includes('series') || text.includes('reps') || text.includes('RIR'));
    });

    const card = make('div', 'coach-breath');
    card.dataset.coachBreath = id;
    card.appendChild(make('div', 'coach-breath-head', 'Respiración'));
    card.appendChild(make('p', '', cue));
    card.appendChild(make('small', '', 'Busca una respiración fluida y estable; no hace falta forzar inspiraciones profundas ni mantener el aire bloqueado durante toda la serie.'));

    if (prescription) prescription.insertAdjacentElement('afterend', card);
    else wrap.appendChild(card);
  }

  let toastTimer = 0;
  let toastIndex = 0;
  const hydrationMessages = [
    'Hidratación · aprovecha el descanso para beber unos sorbos de agua si tienes sed.',
    'Agua a mano · hidrátate con calma y continúa cuando estés listo.',
    'Recordatorio de hidratación · unos sorbos durante el descanso pueden ser un buen momento.'
  ];

  function showHydrationToast() {
    document.querySelectorAll('.coach-toast').forEach(node => node.remove());
    const toast = make('div', 'coach-toast');
    const bold = make('b', '', '💧 ');
    toast.appendChild(bold);
    toast.append(hydrationMessages[toastIndex % hydrationMessages.length]);
    toastIndex += 1;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('show');
      window.setTimeout(() => toast.remove(), 260);
    }, 5200);
  }

  function detectActiveMode() {
    const head = currentNavbarHead();
    if (!head) return null;
    if (/^Cardio · bloque\s+\d+/i.test(head)) return 'cardio';
    if (/^[ABC]\d\s*·/.test(head) || /^Sesión [ABC]$/.test(head) || head === 'Aproximaciones') return 'strength';
    return null;
  }

  let activeMode = null;
  let activeSince = 0;
  let lastActiveSeen = 0;
  let nextHydrationAt = HYDRATION_EVERY_MS;

  function updateHydrationClock() {
    const now = Date.now();
    const mode = detectActiveMode();

    if (mode) {
      lastActiveSeen = now;
      if (mode !== activeMode) {
        activeMode = mode;
        activeSince = now;
        nextHydrationAt = HYDRATION_EVERY_MS;
      }
    } else if (activeMode && now - lastActiveSeen > ACTIVE_GRACE_MS) {
      activeMode = null;
      activeSince = 0;
      nextHydrationAt = HYDRATION_EVERY_MS;
      return;
    }

    if (!activeMode || document.visibilityState === 'hidden') return;
    const elapsed = now - activeSince;
    if (elapsed >= nextHydrationAt) {
      showHydrationToast();
      nextHydrationAt += HYDRATION_EVERY_MS;
    }
  }

  let enhanceScheduled = false;
  function enhance() {
    enhanceScheduled = false;
    addStyles();
    enhanceCardioSummaries();
    enhanceActiveCardio();
    enhanceCheckinHydration();
    enhanceBreathing();
  }

  function scheduleEnhance() {
    if (enhanceScheduled) return;
    enhanceScheduled = true;
    requestAnimationFrame(enhance);
  }

  const observer = new MutationObserver(scheduleEnhance);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', scheduleEnhance, { once: true });
  window.addEventListener('load', scheduleEnhance, { once: true });
  window.setInterval(updateHydrationClock, 15000);
  scheduleEnhance();
})();
