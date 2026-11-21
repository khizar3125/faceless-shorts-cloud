// render all
// THE ELEVATOR THAT WENT UP FOREVER — Stick Story
// Dinesh, an elevator, floor numbers, one old woman, one brass button.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line, fillAll, bigText } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

const rad = (d) => d * Math.PI / 180;
const blink = (t) => ((t % 3.1) < 0.12 ? 1 : 0);

// ---------- helpers ----------
function elevatorBox(lights = 1) {
  ctx.fillStyle = lights ? '#F7F1E6' : '#B9B2A4';
  ctx.fillRect(140, 120, 800, 1560);
  ctx.strokeStyle = K.P.ink; ctx.lineWidth = 12; ctx.strokeRect(140, 120, 800, 1560);
  rr(820, 420, 90, 420, 12); ctx.fillStyle = '#D8D2C4'; ctx.fill(); ctx.strokeStyle = K.P.ink; ctx.lineWidth = 8; ctx.stroke();
  for (let i = 0; i < 5; i++) { circle(865, 480 + i * 74, 22, '#F2F2F2'); ctx.strokeStyle = K.P.ink; ctx.lineWidth = 6; ctx.stroke(); }
  rr(300, 200, 480, 150, 14); ctx.fillStyle = '#17181C'; ctx.fill();
  if (lights < 1) { ctx.fillStyle = `rgba(23,24,28,${1 - lights})`; ctx.fillRect(140, 120, 800, 1560); }
  line([[300, 160], [780, 160]], K.P.ink, 10);
  ell(540, 190, 90, 26, lights ? '#FFE9A8' : '#6E6A5E');
}
function counter(n, flick = 0) {
  ctx.font = `900 110px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = flick ? '#FF5A5A' : '#FFD43B';
  ctx.fillText(String(n), 540, 278);
}
function dinesh(x, y, s, o = {}) {
  K.person({ x, y, h: 760 * s, mood: o.mood || 'neutral', look: o.look || [0, 0.6], blink: blink(o.t || 0), lean: o.lean || 0,
    legs: o.legs || { L: [86, 4], R: [94, 4] }, arms: o.arms || { L: [-14, 16], R: [18, 16] } });
}
function oldWoman(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  K.person({ x: 0, y: 0, h: 640, mood: 'happy', look: [0, 0.2], blink: blink(o.t || 0), lean: 14,
    legs: { L: [80, 10], R: [100, 10] }, arms: { L: [-30, 40], R: [30, 40] } });
  circle(26, -318, 34, '#D8D8D8');
  ctx.restore();
}
function brassButton(x, y, s, glow = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (glow > 0) { ctx.globalAlpha = glow * 0.5; circle(0, 0, 150, 'rgba(255,212,59,0.6)'); ctx.globalAlpha = 1; }
  circle(0, 0, 110, '#B08D3E'); circle(0, 0, 92, '#D8B45E');
  ctx.strokeStyle = '#6E5522'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.stroke();
  ctx.font = `900 64px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#3A2E10';
  ctx.fillText('1000', 0, 4);
  ctx.restore();
}
function cloudsFloor(a) { if (a <= 0) return; ctx.globalAlpha = a; for (let i = 0; i < 5; i++) ell(220 + i * 170 + Math.sin(i * 2) * 30, 1620, 130, 46, '#EAF2FF'); ctx.globalAlpha = 1; }
function phone(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(-70, -130, 140, 260, 22); ctx.fillStyle = '#17181C'; ctx.fill(); ctx.strokeStyle = K.P.ink; ctx.lineWidth = 8; ctx.stroke(); rr(-52, -100, 104, 190, 8); ctx.fillStyle = '#7FB8E6'; ctx.fill(); circle(0, 108, 12, '#3A4A78'); ctx.restore(); }
function tag(text, x, y, size, sc = 1) { if (sc <= 0) return; ctx.save(); ctx.globalAlpha = clamp(sc, 0, 1); ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 16; ctx.strokeStyle = '#FFFFFF'; ctx.strokeText(text, x, y); ctx.fillStyle = '#17181C'; ctx.fillText(text, x, y); ctx.restore(); }
function pill(text, x, y, size, bg, fg, sc = 1) { if (sc <= 0) return; ctx.save(); ctx.globalAlpha = clamp(sc, 0, 1); ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const w = ctx.measureText(text).width + 60; rr(x - w / 2, y - size * 0.85, w, size * 1.7, size * 0.85); ctx.fillStyle = bg; ctx.fill(); ctx.fillStyle = fg; ctx.fillText(text, x, y); ctx.restore(); }
function speedLines(x, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a * 0.6; for (let i = 0; i < 10; i++) { const an = i / 10 * TAU; line([[x + Math.cos(an) * 200, y + Math.sin(an) * 200], [x + Math.cos(an) * 320, y + Math.sin(an) * 320]], K.P.ink, 8); } ctx.restore(); }
function officeBg() {
  ctx.fillStyle = '#EFE9DC'; ctx.fillRect(-300, -300, W + 600, H + 600);
  ctx.fillStyle = K.P.wallShade; ctx.fillRect(-300, K.FLOOR, W + 600, H - K.FLOOR + 300);
  rr(240, 1150, 600, 40, 10); ctx.fillStyle = K.P.wood; ctx.fill();
  line([[300, 1190], [300, 1450]], K.P.ink, 14); line([[780, 1190], [780, 1450]], K.P.ink, 14);
  rr(360, 1090, 90, 70, 10); ctx.fillStyle = '#C0553B'; ctx.fill();
  rr(560, 950, 220, 150, 10); ctx.fillStyle = '#17181C'; ctx.fill();
}

// ---------- shots ----------
export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  add({ id: 'S01', at: cut(0), draw(lt, t) {
    officeBg();
    dinesh(540, K.GROUND - 40, 1, { t });
    tag('42nd FLOOR', 540, 420, 84, seg(lt, 0.3, 0.7));
  }});

  add({ id: 'S02', at: cut(1), draw(lt, t) {
    elevatorBox(1); counter(1);
    dinesh(480, 1560, 0.95, { t, look: [0.6, 0.2] });
    phone(640, 1180, 0.9, t);
    pill('9:02 AM', 260, 480, 54, '#17181C', '#FFFFFF', seg(lt, 0.3, 0.7));
  }});

  add({ id: 'S03', at: cut(2), draw(lt, t) {
    elevatorBox(1); counter(9);
    dinesh(540, 1560, 0.95, { t });
    const shut = seg(lt, 0.2, 0.9);
    ctx.fillStyle = '#E8E2D4'; ctx.fillRect(140, 120, 400 * shut, 1560); ctx.fillRect(940 - 400 * shut, 120, 400 * shut + 10, 1560);
    ctx.strokeStyle = K.P.ink; ctx.lineWidth = 12; ctx.strokeRect(140, 120, 800, 1560);
    cue(L(2) + 0.3, 'tock');
  }});

  add({ id: 'S04', at: cut(3), draw(lt, t) {
    elevatorBox(1);
    counter(Math.floor(lerp(50, 80, seg(lt, 0.1, 1.2))), Math.sin(t * 20) > 0.7 ? 1 : 0);
    dinesh(540, 1560, 0.95, { t, mood: 'worried', lean: -6 });
    speedLines(540, 900, seg(lt, 0.2, 1.0) * 0.7);
  }});

  add({ id: 'S05', at: cut(4), draw(lt, t) {
    elevatorBox(1); counter(120);
    dinesh(460, 1560, 0.95, { t, mood: 'worried', arms: { L: [-40, 60], R: [50, 70] } });
    circle(865, 776, 26, '#FF5A5A');
    tag('♪ lullaby ♪', 700, 1000, 60, seg(lt, 0.6, 1.0));
    cue(L(4) + 0.6, 'boing', { vol: 0.5 });
  }});

  add({ id: 'S06', at: cut(5), draw(lt, t) {
    elevatorBox(1); counter(200);
    dinesh(540, 1560, 0.95, { t, mood: 'worried', lean: -10 });
    ctx.globalAlpha = 0.25; fillAll('#BFD8FF'); ctx.globalAlpha = 1;
    tag('POP! POP! POP!', 540, 500, 66, seg(lt, 0.4, 0.8));
    cue(L(5) + 0.4, 'pop');
  }});

  add({ id: 'S07', at: cut(6), draw(lt, t) {
    const flick = Math.sin(t * 24) > 0 ? 1 : 0.25;
    elevatorBox(flick); counter(411, flick < 1 ? 1 : 0);
    dinesh(540, 1560, 0.95, { t, mood: 'shock' });
    cloudsFloor(seg(lt, 0.6, 1.2) * (flick < 1 ? 1 : 0.15));
  }});

  add({ id: 'S08', at: cut(7), draw(lt, t) {
    elevatorBox(1); counter(777);
    dinesh(420, 1560, 0.95, { t, mood: 'shock', look: [0.9, 0.1] });
    oldWoman(700, 1560, 0.95, { t });
    cue(L(7) + 0.4, 'tock');
  }});

  add({ id: 'S09', at: cut(8), draw(lt, t) {
    elevatorBox(1); counter(777);
    dinesh(420, 1560, 0.95, { t, mood: 'shock' });
    oldWoman(700, 1560, 0.95, { t });
    const shut = seg(lt, 0.5, 1.2);
    ctx.fillStyle = '#E8E2D4'; ctx.fillRect(540, 120, 400 * shut, 1560);
    ctx.strokeStyle = K.P.ink; ctx.lineWidth = 12; ctx.strokeRect(140, 120, 800, 1560);
    tag('"You\'re early."', 700, 900, 62, seg(lt, 0.1, 0.5));
    cue(L(8) + 0.7, 'tock');
  }});

  add({ id: 'S10', at: cut(9), draw(lt, t) {
    fillAll('#0E0F14');
    elevatorBox(1); counter(999);
    dinesh(540, 1560, 0.95, { t, mood: 'shock' });
    ctx.globalAlpha = seg(lt, 0.6, 0.9); bigText('DING', 540, 800, 140, '#FFD43B'); ctx.globalAlpha = 1;
    cue(L(9) + 0.7, 'pop');
  }});

  add({ id: 'S11', at: cut(10), draw(lt, t) {
    officeBg();
    const open = seg(lt, 0.1, 0.8);
    ctx.fillStyle = '#17181C'; ctx.fillRect(0, 0, W, (1 - open) * H);
    dinesh(540, K.GROUND - 40, 1, { t, mood: 'shock' });
    pill('9:02 AM', 260, 480, 54, '#17181C', '#FFFFFF', seg(lt, 0.8, 1.2));
  }});

  add({ id: 'S12', at: cut(11), draw(lt, t) {
    officeBg();
    ctx.strokeStyle = 'rgba(90,90,90,0.5)'; ctx.lineWidth = 6;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); for (let y = 0; y < 90; y += 10) ctx.lineTo(390 + Math.sin(y / 14 + t * 3 + i) * 10, 1080 - y); ctx.stroke(); }
    phone(700, 1150, 0.9, t);
    pill('UNSENT', 700, 950, 48, '#C0392B', '#FFFFFF', seg(lt, 0.5, 0.9));
  }});

  add({ id: 'S13', at: cut(12), draw(lt, t) {
    officeBg();
    dinesh(540, K.GROUND - 40, 1, { t, mood: 'worried', look: [0, -0.4] });
    ctx.globalAlpha = 0.4 * seg(lt, 0.4, 0.9); fillAll('#FFD43B'); ctx.globalAlpha = 1;
  }});

  add({ id: 'S14', at: cut(13), draw(lt, t) {
    officeBg();
    brassButton(540, 1100, seg(lt, 0.2, 0.8) * 1.2, seg(lt, 0.6, 1.2));
    cue(L(13) + 0.5, 'sparkle');
  }});

  add({ id: 'S15', at: cut(14), draw(lt, t) {
    fillAll('#12131A');
    ctx.globalAlpha = 0.9; ell(540, 1150, 420, 60, '#2A2C38'); ctx.globalAlpha = 1;
    brassButton(540, 1120, 1.1, 0.3 + 0.2 * Math.sin(t * 2));
    line([[540, 1500], [540, 1260]], '#E8B98A', 34); circle(540, 1230, 44, '#E8B98A');
    pill('SOME NIGHTS', 540, 480, 52, '#FFD43B', '#101425', seg(lt, 0.4, 0.9));
  }});

  add({ id: 'S16', at: cut(15), draw(lt, t) {
    fillAll('#0E0F14');
    elevatorBox(1); counter(999);
    ctx.globalAlpha = seg(lt, 0.2, 0.8);
    bigText('THE SCARIEST FLOOR', 540, 700, 76, '#F2F5FF');
    bigText('IS THE ONE YOU', 540, 830, 76, '#F2F5FF');
    bigText('ALMOST TOOK', 540, 960, 96, '#FFD43B');
    ctx.globalAlpha = 1;
  }});

  // build-time sound cues
  cue(L(2) + 0.3, 'tock');
  cue(L(4) + 0.6, 'boing', { vol: 0.5 });
  cue(L(5) + 0.4, 'pop');
  cue(L(7) + 0.4, 'tock');
  cue(L(8) + 0.7, 'tock');
  cue(L(9) + 0.7, 'pop');
  cue(L(13) + 0.5, 'sparkle');
  return { shots: S, cues: CUES };
}
