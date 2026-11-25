/* localStorage pode lançar exceção (modo privado do Safari, cookies
 * bloqueados, cota cheia). O jogo antigo chamava direto e quebrava inteiro. */
'use strict';

const Store = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : v;
    } catch (_) { return fallback; }
  },
  getNumber(key, fallback = 0) {
    const n = Number(this.get(key, fallback));
    return Number.isFinite(n) ? n : fallback;
  },
  getBool(key, fallback = false) {
    const v = this.get(key, null);
    return v === null ? fallback : v === 'true';
  },
  set(key, value) {
    try { localStorage.setItem(key, String(value)); return true; }
    catch (_) { return false; }
  }
};
