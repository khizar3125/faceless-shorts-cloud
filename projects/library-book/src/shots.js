// THE BOOK THAT KNEW MY NAME — Paper Atlas
// Vienna, 1897: a blank book that shows every reader a different story.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

const P = K.P;
const cut = (path, fill, o = {}) => K.cut(path, fill, o);
const P_rr = K.P_rr, P_circ = K.P_circ, P_poly = K.P_poly;

// ---------- helpers ----------
function bookOpen(x, y, s, ink = 0, t = 0) { // open book, ink 0..1 = text appears
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // cover
  cut(P_rr(-330, -40, 660, 60, 8), '#7A4B33');
  // pages
  for (const side of [-1, 1]) {
    cut(P_poly([[side * 20, -40], [side * 300, -60], [side * 300, -320], [side * 20, -300]]), '#F2E8D0');
    if (ink > 0) {
      ctx.globalAlpha = ink;
      for (let r = 0; r < 7; r++) line([[side * 50, -90 - r * 30], [side * (270 - (r % 3) * 20), -90 - r * 30]], '#5A4632', 5);
      ctx.globalAlpha = 1;
    }
  }
  line([[0, -300], [0, -40]], '#C9BFA9', 6);
  ctx.restore();
}
function bookClosed(x, y, s, col = '#7A4B33') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-150, -200, 300, 400, 10), col);
  cut(P_rr(-150, -200, 40, 400, 10), '#5E3A26');
  cut(P_circ(0, 0, 46), '#E9DCBC');
  ctx.restore();
}
function reader(x, y, s, o = {}) { // seated/standing figure with book
  K.figure({ x, y, h: 620 * s, role: o.role || 'scholar', dir: o.dir || 1, arm: o.arm ?? 40 });
  if (o.book) bookClosed(x + (o.dir || 1) * 150, y - 260 * s, 0.55 * s, o.book);
  if (o.tears) { ctx.fillStyle = '#7FB8E6'; for (let i = 0; i < 3; i++) ell(x + (o.dir || 1) * 60 - i * 14, y - 500 * s + i * 40 + ((t0(i, o.t) * 60) % 60), 8, 14, '#7FB8E6'); }
}
function t0(i, t) { return (t || 0) * (1.5 + i * 0.4) + i; }
function lockedDoor(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-160, -560, 320, 560, 8), '#5E4630');
  cut(P_circ(90, -280, 22), '#E9DCBC');
  cut(P_rr(-140, -540, 280, 40, 6), '#4A3624');
  ctx.restore();
}
function shelf(x, y, s, n = 5) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-420, -40, 840, 40, 6), '#5E4630');
  for (let i = 0; i < n; i++) cut(P_rr(-390 + i * 160, -220, 120, 180, 6), ['#7A4B33', '#4A6FA5', '#5E8C61', '#B9683A', '#8A6B4A'][i % 5]);
  ctx.restore();
}
function letterPile(x, y, s, n = 7) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < n; i++) {
    ctx.save(); ctx.translate(rnd(i) * 160 - 80, -i * 26); ctx.rotate(rnd(i + 5) * 0.3 - 0.15);
    cut(P_rr(-110, -70, 220, 140, 6), '#F2E8D0');
    line([[-80, -30], [80, -30]], '#5A4632', 5); line([[-80, 0], [60, 0]], '#5A4632', 5);
    ctx.restore();
  }
  ctx.restore();
}
function heart(x, y, s, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a;
  ctx.beginPath(); ctx.moveTo(0, 40); ctx.bezierCurveTo(-60, -10, -40, -70, 0, -34); ctx.bezierCurveTo(40, -70, 60, -10, 0, 40);
  ctx.fillStyle = '#C0392B'; ctx.fill(); ctx.restore();
}
function dust(a, t) {
  if (a <= 0) return; ctx.globalAlpha = a * 0.7;
  for (let i = 0; i < 24; i++) circle(rnd(i) * W, rnd(i + 30) * 1200, 3 + rnd(i + 9) * 4, '#E9DCBC');
  ctx.globalAlpha = 1;
}
function girl(x, y, s, o = {}) { K.figure({ x, y, h: 600 * s, role: 'scholar', dir: o.dir || 1, arm: o.arm ?? 30 }); }

// ---------- shots ----------
export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);

  add({ id: 'S01', at: cut_(0), draw(lt, t) { // title + library hall
    K.parchment(1); K.hall();
    shelf(540, 1450, 1.1, 5);
    K.ribbon('THE BOOK', 540, 360, eob(seg(lt, 0.1, 0.5)));
    K.ribbon('THAT KNEW MY NAME', 540, 560, eob(seg(lt, 0.4, 0.8)), 70);
    cue(L(0) + 0.2, 'whoosh');
  }});

  add({ id: 'S02', at: cut_(1), draw(lt, t) { // arrives in Vienna 1897
    K.parchment(2);
    K.timeline([1897, 1910, 1938, 'NOW'], 540, 320, 800, seg(lt, 0.1, 0.5), 0);
    bookClosed(540, 1000, eob(seg(lt, 0.4, 0.9)) * 1.4);
    K.slip('VIENNA · NO AUTHOR', 540, 1250, eob(seg(lt, 0.8, 1.1)), 0.03);
    K.seal(820, 700, eob(seg(lt, 1.0, 1.3)) * 1.1, 'V');
    cue(L(1) + 0.5, 'thud');
  }});

  add({ id: 'S03', at: cut_(2), draw(lt, t) { // blank pages
    K.parchment(3);
    bookOpen(540, 900, 1.5, seg(lt, 0.3, 0.8) * 0.12, t);
    K.slip('BLANK.', 540, 380, eob(seg(lt, 0.5, 0.8)), -0.04, 96);
    reader(880, 1450, 0.8, { role: 'scholar', dir: -1, book: 0 });
  }});

  add({ id: 'S04', at: cut_(3), draw(lt, t) { // first reader: love story
    K.parchment(4);
    bookOpen(540, 900, 1.5, seg(lt, 0.2, 0.6), t);
    heart(300, 500, 1.2 * eob(seg(lt, 0.5, 0.9)));
    heart(780, 460, 0.9 * eob(seg(lt, 0.8, 1.2)));
    reader(160, 1450, 0.85, { role: 'scholar', dir: 1, book: '#7A4B33', tears: 1, t });
    K.slip('A LOVE STORY', 540, 350, eob(seg(lt, 0.3, 0.6)), -0.03);
    cue(L(3) + 0.6, 'sparkle');
  }});

  add({ id: 'S05', at: cut_(4), draw(lt, t) { // second reader: sea voyage
    K.parchment(5);
    K.harbor(t, 600);
    K.ship(600, 1150, 1.1, Math.sin(t) * 0.03);
    reader(200, 1450, 0.85, { role: 'merchant', dir: 1 });
    const walk = seg(lt, 0.8, 1.6);
    K.figure({ x: 540 + walk * 300, y: 1450, h: 620, role: 'sailor', dir: 1, arm: 60 });
    K.slip('HE\'D NEVER LEFT AUSTRIA', 540, 330, eob(seg(lt, 0.3, 0.6)), 0.02);
    if (walk > 0.5) cue(t, 'whoosh', { vol: 0.5 });
  }});

  add({ id: 'S06', at: cut_(5), draw(lt, t) { // 1910 locked room
    K.parchment(6);
    K.timeline([1897, 1910, 1938, 'NOW'], 540, 320, 800, 1, 1);
    lockedDoor(540, 1450, 1.3);
    K.slip('LOCKED ROOM', 540, 500, eob(seg(lt, 0.3, 0.6)), -0.03);
    K.seal(540, 950, eob(seg(lt, 0.7, 1.0)) * 1.2, 'L');
    cue(L(5) + 0.5, 'slam');
  }});

  add({ id: 'S07', at: cut_(6), draw(lt, t) { // different book for everyone
    K.parchment(7);
    reader(240, 1450, 0.75, { role: 'scholar', dir: 1, book: '#7A4B33' });
    reader(540, 1450, 0.75, { role: 'merchant', dir: 1, book: '#4A6FA5' });
    reader(840, 1450, 0.75, { role: 'worker', dir: 1, book: '#5E8C61' });
    heart(240, 620, 0.7 * (0.7 + 0.3 * Math.sin(t * 3)));
    K.ship(540, 700, 0.35, 0);
    cut(P_poly([[840, 560], [900, 480], [960, 560]]), '#5E8C61');
    K.slip('ABOUT THEMSELVES', 540, 340, eob(seg(lt, 0.4, 0.8)), 0.02);
  }});

  add({ id: 'S08', at: cut_(7), draw(lt, t) { // 1938 vanished
    K.parchment(8);
    K.timeline([1897, 1910, 1938, 'NOW'], 540, 320, 800, 1, 2);
    // empty pedestal + unbroken dust
    cut(P_rr(390, 1150, 300, 60, 8), '#5E4630');
    cut(P_rr(430, 1210, 220, 240, 8), '#4A3624');
    dust(seg(lt, 0.4, 1.2), t);
    K.slip('GONE.', 540, 500, eob(seg(lt, 0.5, 0.8)), -0.05, 110);
    K.slip('LOCK UNTOUCHED · DUST UNBROKEN', 540, 700, eob(seg(lt, 0.9, 1.2)), 0.02, 44);
    cue(L(7) + 0.5, 'whoosh');
  }});

  add({ id: 'S09', at: cut_(8), draw(lt, t) { // 80 years of letters
    K.parchment(9);
    letterPile(540, 1300, 1.3, 8);
    reader(180, 1450, 0.8, { role: 'scholar', dir: 1, arm: 80 });
    reader(900, 1450, 0.8, { role: 'merchant', dir: -1, arm: 80 });
    K.slip('NONE WERE ANSWERED', 540, 400, eob(seg(lt, 0.4, 0.8)), 0.03);
  }});

  add({ id: 'S10', at: cut_(9), draw(lt, t) { // last year: the girl + note
    K.parchment(10);
    K.timeline([1897, 1910, 1938, 'NOW'], 540, 320, 800, 1, 3);
    girl(360, 1450, 0.95, { dir: 1, arm: 60 });
    bookClosed(560, 1100, 0.9, '#8A6B4A');
    K.slip('THANK YOU.', 760, 700, eob(seg(lt, 0.5, 0.8)), -0.04, 60);
    K.slip("I DIDN'T KNOW MY ENDING YET.", 760, 850, eob(seg(lt, 0.9, 1.2)), 0.02, 40);
    K.seal(560, 1300, eob(seg(lt, 1.3, 1.6)) * 1.2, '♥');
    cue(L(9) + 0.6, 'sparkle');
  }});

  // build-time sound cues
  cue(L(0) + 0.2, 'whoosh');
  cue(L(1) + 0.5, 'thud');
  cue(L(3) + 0.6, 'sparkle');
  cue(L(4) + 0.9, 'whoosh', { vol: 0.5 });
  cue(L(5) + 0.5, 'slam');
  cue(L(7) + 0.5, 'whoosh');
  cue(L(9) + 0.6, 'sparkle');
  return { shots: S, cues: CUES };
}
