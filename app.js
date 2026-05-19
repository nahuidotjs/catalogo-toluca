/* app.js — Lógica del catálogo */

(function () {
  'use strict';

  /* ── Estado ───────────────────────────────────────────── */
  let filtros = { escala: '', tema: '', fuente: '', busqueda: '' };
  let vistaLista = false;

  /* ── Elementos DOM ────────────────────────────────────── */
  const output      = document.getElementById('catalog-output');
  const emptyState  = document.getElementById('empty-state');
  const countEl     = document.getElementById('count');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalContent = document.getElementById('modal-content');

  /* ── Inicializar ──────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    bindFilters();
    bindViewToggle();
    render();
  });

  /* ── Filtros ──────────────────────────────────────────── */
  function bindFilters() {
    const ids = ['filtro-escala', 'filtro-tema', 'filtro-fuente', 'filtro-busqueda'];
    const keys = ['escala', 'tema', 'fuente', 'busqueda'];
    ids.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => { filtros[keys[i]] = el.value; render(); });
      el.addEventListener('change', () => { filtros[keys[i]] = el.value; render(); });
    });
  }

  window.resetFilters = function () {
    filtros = { escala: '', tema: '', fuente: '', busqueda: '' };
    ['filtro-escala', 'filtro-tema', 'filtro-fuente', 'filtro-busqueda'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    render();
  };

  /* ── Vista ────────────────────────────────────────────── */
  function bindViewToggle() {
    document.getElementById('btn-grid').addEventListener('click', () => setVista(false));
    document.getElementById('btn-list').addEventListener('click', () => setVista(true));
  }
  function setVista(lista) {
    vistaLista = lista;
    document.getElementById('btn-grid').classList.toggle('active', !lista);
    document.getElementById('btn-list').classList.toggle('active', lista);
    render();
  }

  /* ── Filtrar ──────────────────────────────────────────── */
  function capasFiltraradas() {
    const q = filtros.busqueda.toLowerCase();
    return window.CAPAS.filter(c => {
      if (filtros.escala && c.escala !== filtros.escala) return false;
      if (filtros.tema  && c.tema  !== filtros.tema)  return false;
      if (filtros.fuente && c.fuente !== filtros.fuente) return false;
      if (q && !(c.titulo.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))) return false;
      return true;
    });
  }

  /* ── Render principal ─────────────────────────────────── */
  function render() {
    const capas = capasFiltraradas();
    countEl.textContent = capas.length;

    if (capas.length === 0) {
      output.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    // Agrupar por grupo
    const grupos = {};
    capas.forEach(c => {
      if (!grupos[c.grupo]) grupos[c.grupo] = [];
      grupos[c.grupo].push(c);
    });

    output.innerHTML = Object.entries(grupos).map(([grupo, items]) => `
      <section class="catalog-section">
        <h2 class="section-title">
          ${grupo}
          <span class="section-count">${items.length}</span>
        </h2>
        <div class="cards-grid${vistaLista ? ' list-view' : ''}">
          ${items.map(c => cardHTML(c)).join('')}
        </div>
      </section>
    `).join('');

    // Bind clicks
    output.querySelectorAll('.card').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.btn-dl')) return; // clic en descargar → no abrir modal
        const id = el.dataset.id;
        openModal(id);
      });
    });
  }

  /* ── Card HTML ────────────────────────────────────────── */
  function cardHTML(c) {
    const thumb = c.thumb
      ? `<img src="${c.thumb}" alt="${c.titulo}" loading="lazy"/>`
      : `<div class="card-thumb-placeholder">${c.icon || '🗺'}</div>`;

    const dlBtn = c.driveUrl
      ? `<a class="btn btn-primary btn-dl" href="${c.driveUrl}" target="_blank" download>⬇ KML</a>`
      : `<button class="btn btn-outline" disabled title="Próximamente">⬇ KML</button>`;

    return `
      <div class="card" data-id="${c.id}" tabindex="0" role="button" aria-label="${c.titulo}">
        <div class="card-thumb">
          ${thumb}
          <div class="card-tags">
            <span class="tag">${c.grupo}</span>
            <span class="tag sub">${c.escala}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-title">${c.titulo}</div>
          <div class="card-meta">
            <span>📌 ${c.fuente}</span>
            <span>📅 ${c.fecha}</span>
          </div>
          <div class="card-actions">
            ${dlBtn}
            <button class="btn btn-outline">ℹ Info</button>
          </div>
        </div>
      </div>`;
  }

  /* ── Modal ────────────────────────────────────────────── */
  function openModal(id) {
    const c = window.CAPAS.find(x => x.id === id);
    if (!c) return;

    const thumb = c.thumb
      ? `<img class="modal-thumb" src="${c.thumb}" alt="${c.titulo}"/>`
      : `<div class="modal-thumb-placeholder">${c.icon || '🗺'}</div>`;

    const dlBtn = c.driveUrl
      ? `<a class="btn btn-primary" href="${c.driveUrl}" target="_blank">⬇ Descargar KML</a>`
      : `<button class="btn btn-outline" disabled>⬇ Próximamente</button>`;

    modalContent.innerHTML = `
      ${thumb}
      <div class="modal-body">
        <div class="modal-tags">
          <span class="modal-tag">${c.grupo}</span>
          <span class="modal-tag">${c.tema}</span>
          <span class="modal-tag">${c.escala}</span>
        </div>
        <h2 class="modal-title">${c.titulo}</h2>
        <p class="modal-desc">${c.desc}</p>
        <div class="modal-info">
          <div class="info-item"><label>Fuente</label><span>${c.fuente}</span></div>
          <div class="info-item"><label>Año</label><span>${c.fecha}</span></div>
          <div class="info-item"><label>Escala</label><span>${capitalizar(c.escala)}</span></div>
          <div class="info-item"><label>Formato</label><span>KML / KMZ</span></div>
        </div>
        <div class="modal-actions">
          ${dlBtn}
          <button class="btn btn-outline" onclick="closeModal()">Cerrar</button>
        </div>
      </div>`;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  window.closeModal = function () {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Cerrar con Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeModal(); });

  /* ── Util ─────────────────────────────────────────────── */
  function capitalizar(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

})();
