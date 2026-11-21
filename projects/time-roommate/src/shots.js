// render all
// render pass 2
// MY ROOMMATE WAS A TIME TRAVELER — Inside Out 2D
// Ren the roommate: labeled food, backwards clock, sticky notes, one pier.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, rr, ell, line } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

const rad = (d) => d * Math.PI / 180;
const blink = (t) => ((t % 3.1) < 0.12 ? 1 : 0);

// ---------- helpers ----------
function guy(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const skin = o.skin || '#E8B98A', shirt = o.shirt || '#4A6FA5', ink = '#22283B';
  const lean = o.lean || 0, flinch = o.flinch || 0;
  ctx.rotate(rad(lean + flinch * -6));
  ctx.strokeStyle = ink; ctx.lineWidth = 20; ctx.lineCap = 'round';
  const sw = Math.sin((o.t || 0) * 6) * (o.walk ? 26 : 4);
  line([[0, -150], [-30 + sw, 0]], ink, 20); line([[0, -150], [30 - sw, 0]], ink, 20);
  rr(-52, -360, 104, 220, 30); ctx.fillStyle = shirt; ctx.fill();
  const up = o.armsUp || 0;
  line([[-44, -330], [-70 - up * 30, -220 - up * 130]], shirt, 18);
  line([[44, -330], [70 + up * 30, -220 - up * 130]], shirt, 18);
  circle(0, -410, 58, skin);
  ctx.beginPath(); ctx.arc(0, -418, 58, Math.PI, 0); ctx.fillStyle = o.hair || '#2A2E45'; ctx.fill();
  if (o.mood === 'shock') { circle(-20, -416, 7, ink); circle(20, -416, 7, ink); ell(0, -388, 12, 16, ink); }
  else if (o.mood === 'smile') { circle(-20, -416, 6, ink); circle(20, -416, 6, ink); ctx.beginPath(); ctx.arc(0, -396, 18, 0.15, Math.PI - 0.15); ctx.strokeStyle = ink; ctx.lineWidth = 6; ctx.stroke(); }
  else { circle(-20, -416, 6, ink); circle(20, -416, 6, ink); line([[-12, -390], [12, -390]], ink, 6); }
  ctx.restore();
}
function room2(night = false) {
  fillAll(night ? '#141A2E' : '#EFE9DC');
  ctx.fillStyle = night ? '#0F1424' : '#DED5C2'; ctx.fillRect(-300, 1250, W + 600, H - 1250 + 300);
  ctx.strokeStyle = '#22283B'; ctx.lineWidth = 10; ctx.strokeRect(60, 140, 960, 1110);
}
function fridge(open = 0, notes = 0, t = 0) {
  ctx.save(); ctx.translate(540, 830);
  rr(-190, -420, 380, 840, 24); ctx.fillStyle = '#DDE3EA'; ctx.fill();
  ctx.strokeStyle = '#22283B'; ctx.lineWidth = 10; ctx.stroke();
  line([[-190, -60], [190, -60]], '#22283B', 10);
  rr(150, -40, 16, 200, 8); ctx.fillStyle = '#9AA5B5'; ctx.fill();
  if (open > 0) {
    ctx.save(); ctx.translate(-190, -420); ctx.rotate(rad(-70 * open));
    rr(-30, 0, 380, 840, 24); ctx.fillStyle = '#E9EEF3'; ctx.fill(); ctx.strokeStyle = '#22283B'; ctx.lineWidth = 10; ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 0.35 * open; rr(-170, -400, 340, 760, 16); ctx.fillStyle = '#FFE9A8'; ctx.fill(); ctx.globalAlpha = 1;
    for (let i = 0; i < 3; i++) line([[-160, -240 + i * 200], [160, -240 + i * 200]], '#B9C2CE', 8);
  }
  if (notes > 0) {
    const texts = ['MAR 3 2031', 'JUN 11 2027', '???'];
    for (let i = 0; i < 3; i++) {
      const a = clamp(notes * 3 - i, 0, 1);
      if (a <= 0) continue;
      ctx.save(); ctx.globalAlpha = a; ctx.translate(-90 + i * 95, -260 + (i % 2) * 130); ctx.rotate(rad((i - 1) * 8));
      rr(-55, -55, 110, 110, 6); ctx.fillStyle = '#FFE066'; ctx.fill();
      ctx.font = `800 26px Inter`; ctx.textAlign = 'center'; ctx.fillStyle = '#22283B'; ctx.fillText(texts[i], 0, 8);
      ctx.restore();
    }
  }
  ctx.restore();
}
function wallClock(back = 0, t = 0) {
  ctx.save(); ctx.translate(760, 420);
  circle(0, 0, 130, '#F4F0E6'); ctx.strokeStyle = '#22283B'; ctx.lineWidth = 12; ctx.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line([[Math.cos(a) * 100, Math.sin(a) * 100], [Math.cos(a) * 115, Math.sin(a) * 115]], '#22283B', 6); }
  const dir = back ? -1 : 1;
  const ha = dir * t * 0.4 - Math.PI / 2, ma = dir * t * 2.4 - Math.PI / 2;
  line([[0, 0], [Math.cos(ha) * 60, Math.sin(ha) * 60]], '#22283B', 12);
  line([[0, 0], [Math.cos(ma) * 95, Math.sin(ma) * 95]], '#22283B', 8);
  circle(0, 0, 10, '#C0392B');
  ctx.restore();
}
function rainOn(a, t) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a * 0.7;
  for (let i = 0; i < 30; i++) {
    const x = (rnd(i) * 1400 - 100 + t * 300) % (W + 200) - 100, y = (rnd(i + 50) * 1900 + t * 900) % 1900 - 100;
    line([[x, y], [x - 14, y + 44]], '#7FA6D9', 5);
  }
  ctx.restore();
}
function sticky(x, y, text, a, rot = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rad(rot));
  ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 18;
  rr(-110, -110, 220, 220, 8); ctx.fillStyle = '#FFE066'; ctx.fill(); ctx.shadowBlur = 0;
  ctx.font = `800 40px Inter`; ctx.textAlign = 'center'; ctx.fillStyle = '#22283B';
  const words = text.split(' '); let yy = -20;
  for (const w of words) { ctx.fillText(w, 0, yy); yy += 46; }
  ctx.restore();
}
function watch(x, y, s, t, back = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(0, 0, 120, '#C9A36B'); circle(0, 0, 96, '#F4F0E6');
  ctx.strokeStyle = '#22283B'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, 96, 0, TAU); ctx.stroke();
  const a = back * t * 2.2 - Math.PI / 2;
  line([[0, 0], [Math.cos(a) * 70, Math.sin(a) * 70]], '#C0392B', 10);
  line([[0, 0], [Math.cos(a * 0.4) * 50, Math.sin(a * 0.4) * 50]], '#22283B', 10);
  line([[-160, 0], [-110, 0]], '#C9A36B', 22); line([[110, 0], [160, 0]], '#C9A36B', 22);
  ctx.restore();
}
function pier(t, dusk = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  if (dusk) { g.addColorStop(0, '#2A2550'); g.addColorStop(0.55, '#B45A6E'); g.addColorStop(1, '#E8A15C'); }
  else { g.addColorStop(0, '#7FB8E6'); g.addColorStop(1, '#D8E8F5'); }
  ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600);
  ctx.fillStyle = dusk ? '#31407A' : '#4A7FB5'; ctx.fillRect(-300, 1050, W + 600, H - 1050 + 300);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 5;
  for (let i = 0; i < 5; i++) { const yy = 1100 + i * 60; ctx.beginPath(); for (let x = -50; x <= W + 50; x += 50) ctx.lineTo(x, yy + Math.sin(x / 80 + t * (1 + i * 0.2)) * 8); ctx.stroke(); }
  ctx.fillStyle = '#8A6B4A'; ctx.fillRect(120, 980, 840, 60);
  for (let i = 0; i < 7; i++) line([[170 + i * 120, 980], [170 + i * 120, 1040]], '#6E5238', 8);
  line([[200, 1040], [200, 1500]], '#6E5238', 18); line([[880, 1040], [880, 1500]], '#6E5238', 18);
}
function suitcase2(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-110, -190, 220, 230, 20); ctx.fillStyle = '#B9683A'; ctx.fill();
  ctx.strokeStyle = '#22283B'; ctx.lineWidth = 10; ctx.stroke();
  line([[-60, -190], [-60, -250]], '#22283B', 14); line([[60, -190], [60, -250]], '#22283B', 14);
  line([[-60, -250], [60, -250]], '#22283B', 14);
  ctx.restore();
}
function umbrella(x, y, s, col = '#C0553B') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line([[0, -40], [0, 120]], '#22283B', 10);
  ctx.beginPath(); ctx.arc(0, -40, 150, Math.PI, 0); ctx.fillStyle = col; ctx.fill();
  ctx.strokeStyle = '#22283B'; ctx.lineWidth = 8; ctx.stroke();
  ctx.restore();
}
function thoughtBubble(x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = '#22283B'; ctx.lineWidth = 8;
  for (const [dx, dy, r] of [[0, 0, 90], [-80, 20, 60], [80, 20, 60], [-40, -60, 55], [45, -55, 55]]) { ctx.beginPath(); ctx.arc(dx, dy, r, 0, TAU); ctx.fill(); ctx.stroke(); }
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-30 - i * 22, 110 + i * 26, 14 - i * 3, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}

// ---------- shots ----------
export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  add({ id: 'S01', at: cut(0), draw(lt, t) {
    room2(false);
    guy(400, 1250, 1.0, { t, shirt: '#C0553B', mood: 'smile' });
    guy(700, 1250, 1.0, { t: t + 1, shirt: '#4A6FA5' });
    K.tag('MY ROOMMATE WAS A TIME TRAVELER', 540, 380, 74, seg(lt, 0.2, 0.8));
  }});

  add({ id: 'S02', at: cut(1), draw(lt, t) {
    room2(false); fridge(0, 0, t);
    guy(880, 1250, 0.9, { t, shirt: '#4A6FA5' });
    ctx.font = `800 44px Inter`; ctx.textAlign = 'center'; ctx.fillStyle = '#22283B';
    ctx.fillText('MILK · MAR 3 2031', 540, 1320);
    K.tag('THE FUTURE?', 540, 300, 84, seg(lt, 0.4, 0.9));
    cue(L(1) + 0.3, 'pop');
  }});

  add({ id: 'S03', at: cut(2), draw(lt, t) {
    room2(false); wallClock(1, t);
    guy(340, 1250, 0.9, { t, shirt: '#4A6FA5', mood: 'smile' });
    K.pill('ONLY SUNDAYS', 540, 1320, 56, '#FFD43B', '#101425', seg(lt, 0.4, 0.9));
    cue(L(2) + 0.2, 'tock');
  }});

  add({ id: 'S04', at: cut(3), draw(lt, t) {
    room2(false); wallClock(0, t);
    rainOn(seg(lt, 0.1, 0.5), t);
    guy(540, 1250, 1.0, { t, shirt: '#4A6FA5', flinch: Math.max(0, Math.sin(lt * 6)) });
    K.tag('HE FLINCHED', 540, 330, 70, seg(lt, 0.5, 1.0));
    cue(L(3) + 0.3, 'whoosh', { vol: 0.5 });
  }});

  add({ id: 'S05', at: cut(4), draw(lt, t) {
    room2(true); fridge(seg(lt, 0.2, 0.7), seg(lt, 0.6, 1.4), t);
    ctx.globalAlpha = 0.35; fillAll('#0B0E1A'); ctx.globalAlpha = 1;
    cue(L(4) + 0.4, 'sparkle');
  }});

  add({ id: 'S06', at: cut(5), draw(lt, t) {
    fillAll('#1A2033');
    sticky(280, 700, "DON'T TAKE THE 8:15 BUS", seg(lt, 0.2, 0.5), -6);
    sticky(540, 950, 'SAY YES AT THE PIER', seg(lt, 0.6, 0.9), 4);
    sticky(810, 660, 'BUY TWO UMBRELLAS', seg(lt, 1.0, 1.3), -3);
    if (lt > 0.3) cue(t, 'pop', { vol: 0.35 });
  }});

  add({ id: 'S07', at: cut(6), draw(lt, t) {
    room2(false);
    guy(360, 1250, 1.0, { t, shirt: '#C0553B', armsUp: 0.6 });
    guy(720, 1250, 1.0, { t: t + 0.5, shirt: '#4A6FA5', mood: 'smile' });
    thoughtBubble(720, 560, 1.1, t);
    ctx.font = `800 44px Inter`; ctx.textAlign = 'center'; ctx.fillStyle = '#22283B';
    ctx.fillText('How was the bus today?', 720, 520);
  }});

  add({ id: 'S08', at: cut(7), draw(lt, t) {
    room2(false); wallClock(1, t);
    guy(540, 1250, 1.05, { t, shirt: '#4A6FA5', mood: 'smile' });
    K.tag('"No reason. Yet."', 540, 420, 80, seg(lt, 0.3, 0.8));
  }});

  add({ id: 'S09', at: cut(8), draw(lt, t) {
    room2(false);
    suitcase2(820, 1230, 1.1);
    guy(300, 1250, 1.0, { t, shirt: '#4A6FA5', mood: 'smile', walk: 1 });
    watch(540, 1150, seg(lt, 0.4, 0.9), t, 1);
    cue(L(8) + 0.5, 'slide');
  }});

  add({ id: 'S10', at: cut(9), draw(lt, t) {
    pier(t, 1);
    guy(380, 1035, 0.9, { t, shirt: '#C0553B' });
    guy(700, 1035, 0.9, { t: t + 0.7, shirt: '#3A4A78', mood: 'smile', hair: '#8888A8' });
    K.tag('10 YEARS LATER', 540, 300, 78, seg(lt, 0.2, 0.7));
    K.tag('"Say yes."', 700, 700, 66, seg(lt, 0.9, 1.4));
  }});

  add({ id: 'S11', at: cut(10), draw(lt, t) {
    pier(t, 1);
    guy(480, 1035, 1.0, { t, shirt: '#C0553B', armsUp: 1, mood: 'smile' });
    umbrella(760, 950, seg(lt, 0.5, 1.0), '#FFD43B');
    K.tag('YES.', 480, 560, 120, seg(lt, 0.3, 0.7));
    cue(L(10) + 0.4, 'sparkle');
    if (lt > 2.4) { ctx.globalAlpha = seg(lt, 2.4, 2.9); bigText('SOME NOTES AGE WELL', 540, 1500, 72, '#FFF6D8'); ctx.globalAlpha = 1; }
  }});

  // build-time sound cues
  cue(L(1) + 0.3, 'pop');
  cue(L(2) + 0.2, 'tock');
  cue(L(3) + 0.3, 'whoosh', { vol: 0.5 });
  cue(L(4) + 0.4, 'sparkle');
  cue(L(5) + 0.4, 'pop', { vol: 0.35 });
  cue(L(8) + 0.5, 'slide');
  cue(L(10) + 0.4, 'sparkle');
  return { shots: S, cues: CUES };
}
