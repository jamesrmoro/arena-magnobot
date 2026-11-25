/* Pré-carregador.
 * O antigo contava apenas onload: uma única imagem que falhasse (rede ruim,
 * 404, cache corrompido) deixava o jogo preso para sempre numa tela vazia,
 * porque o callback nunca era chamado. Aqui toda imagem resolve — com erro
 * ou não — e existe um tempo máximo de espera. */
'use strict';

const Assets = {
  img: {},
  powerUps: [],
  failed: [],

  _one(key, src) {
    return new Promise(resolve => {
      const im = new Image();
      im.decoding = 'async';
      const done = ok => {
        if (!ok) this.failed.push(src);
        this.img[key] = ok ? im : null;
        resolve(im);
      };
      im.onload = () => done(true);
      im.onerror = () => done(false);
      im.src = src;
    });
  },

  load(onProgress) {
    const base = './assets/images/';
    const jobs = [
      ['robot', base + 'robot.png'],
      ['robotActive1', base + 'robot-actived-1.png'],
      ['robotActive2', base + 'robot-actived-2.png'],
      ['box', base + 'box.png'],
      ['ghost', base + 'ghost.png']
    ];
    for (let i = 1; i <= 10; i++) jobs.push(['power' + i, base + 'power-up-' + i + '.jpg']);

    let done = 0;
    const total = jobs.length;
    const all = jobs.map(([k, src]) =>
      this._one(k, src).then(r => {
        done++;
        if (onProgress) onProgress(done / total);
        return r;
      })
    );

    // Tempo máximo: se a rede travar, o jogo abre mesmo assim (desenha
    // formas geométricas no lugar dos sprites que faltarem).
    const timeout = new Promise(res => setTimeout(res, 8000));

    return Promise.race([Promise.all(all), timeout]).then(() => {
      this.powerUps = [];
      for (let i = 1; i <= 10; i++) this.powerUps.push({ index: i, img: this.img['power' + i] });
      return this;
    });
  }
};
