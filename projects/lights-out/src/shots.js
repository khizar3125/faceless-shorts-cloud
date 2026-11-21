// THE NIGHT THAT NEVER ENDED — Inside Out 2D
// Lighthouse keeper story: dark navy palette, beam cones, starfield, dark tide.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, rr, ell, line } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

const rad = (d) => d * Math.PI / 180;

// ---------- helpers ----------
function sky(t, dark = 1) { // deep night gradient
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, `rgb(${10 * dark},${12 * dark},${30 * dark})`);
  g.addColorStop(0.6, `rgb(${16 * dark},${22 * dark},${48 * dark})`);
  g.addColorStop(1, `rgb(${8 * dark},${10 * dark},${24 * dark})`);
  ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600);
}
function star(x, y, r, a) { if (a <= 0) return; ctx.globalAlpha = a; circle(x, y, r, '#EAF2FF'); ctx.globalAlpha = 1; }
function starfield(kill = 0, t = 0) { // kill 0..1 = fraction eaten from edges inward
  for (let i = 0; i < 90; i++) {
    const x = 40 + rnd(i) * (W - 80), y = 60 + rnd(i + 40) * 900;
    const d = Math.abs(x - W / 2) / (W / 2); // 0 center .. 1 edge
    const alive = d > kill * 1.15 ? 1 : 0;
    const tw = 0.7 + 0.3 * Math.sin(t * 2 + i);
    star(x, y, 2 + rnd(i + 90) * 3, alive * tw);
  }
}
function keeper(x, y, s, o = {}) { // tiny silhouette person
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const c = o.color || '#0B0E1A';
  ctx.strokeStyle = c; ctx.lineWidth = 16; ctx.lineCap = 'round';
  const lean = o.lean || 0, run = o.run || 0;
  ctx.rotate(rad(lean));
  line([[0, -110], [0, 0]], c, 16); // body
  circle(0, -150, 42, c); // head
  const sw = Math.sin((o.t || 0) * (run ? 14 : 6)) * (run ? 30 : 8);
  line([[0, -95], [-34 + sw, -20]], c, 13); line([[0, -95], [34 - sw, -20]], c, 13); // legs
  line([[0, -130], [-30 - sw * 0.7, -70]], c, 12); line([[0, -130], [30 + sw * 0.7, -70]], c, 12); // arms
  ctx.restore();
}
function lighthouse(x, y, s, o = {}) { // y = base ground line
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (o.beam > 0) { // light cone
    ctx.save(); ctx.globalAlpha = 0.28 * o.beam;
    const a = (o.beamA || 0);
    ctx.translate(0, -560); ctx.rotate(a);
    const g = ctx.createLinearGradient(0, 0, 1500, 0);
    g.addColorStop(0, 'rgba(255,236,170,0.95)'); g.addColorStop(1, 'rgba(255,236,170,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(1500, -190); ctx.lineTo(1500, 190); ctx.lineTo(0, 26); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  // tower
  ctx.beginPath(); ctx.moveTo(-95, 0); ctx.lineTo(-55, -470); ctx.lineTo(55, -470); ctx.lineTo(95, 0); ctx.closePath();
  ctx.fillStyle = '#141A2E'; ctx.fill();
  ctx.strokeStyle = '#2A3555'; ctx.lineWidth = 6; ctx.stroke();
  for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? '#1B2340' : '#141A2E'; ctx.fillRect(-88 + i * 7, -80 - i * 80, 176 - i * 14, 60); }
  // lamp room
  rr(-70, -560, 140, 92, 10); ctx.fillStyle = o.lamp ? '#FFE9A8' : '#232C48'; ctx.fill();
  ctx.strokeStyle = '#3A4A78'; ctx.lineWidth = 8; ctx.stroke();
  // roof
  ctx.beginPath(); ctx.moveTo(-86, -560); ctx.lineTo(0, -650); ctx.lineTo(86, -560); ctx.closePath(); ctx.fillStyle = '#0E1326'; ctx.fill();
  if (o.lamp) { ctx.globalAlpha = 0.5; circle(0, -514, 120, 'rgba(255,233,168,0.35)'); ctx.globalAlpha = 1; circle(0, -514, 34, '#FFF6D8'); }
  // balcony
  line([[-92, -462], [92, -462]], '#2A3555', 12);
  ctx.restore();
}
function sea(y, t, glow = 0) {
  ctx.fillStyle = '#0A1024'; ctx.fillRect(-300, y, W + 600, H - y + 300);
  ctx.strokeStyle = 'rgba(120,150,210,0.25)'; ctx.lineWidth = 4;
  for (let i = 0; i < 6; i++) {
    const yy = y + 30 + i * 46, ph = t * (1 + i * 0.2) + i;
    ctx.beginPath();
    for (let x = -50; x <= W + 50; x += 40) ctx.lineTo(x, yy + Math.sin(x / 90 + ph) * 7);
    ctx.stroke();
  }
  if (glow > 0) { ctx.globalAlpha = glow * 0.5; const g = ctx.createLinearGradient(0, y, 0, y + 300); g.addColorStop(0, 'rgba(255,233,168,0.8)'); g.addColorStop(1, 'rgba(255,233,168,0)'); ctx.fillStyle = g; ctx.fillRect(W / 2 - 130, y, 260, 300); ctx.globalAlpha = 1; }
}
function match(x, y, s, state, t) { // state: 0 ok, 1 broken, 2 bent, 3 lit
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const wood = '#C9A36B', head = '#7A3B2E';
  if (state === 1) { line([[0, 0], [-14, -70]], wood, 10); line([[4, -84], [22, -150]], wood, 10); circle(24, -156, 12, head); }
  else if (state === 2) { ctx.save(); ctx.rotate(rad(-18)); line([[0, 0], [0, -150]], wood, 10); circle(0, -156, 12, head); ctx.restore(); }
  else { line([[0, 0], [0, -150]], wood, 10); circle(0, -156, 12, head); }
  if (state === 3) {
    const f = 1 + Math.sin(t * 12) * 0.15;
    ctx.globalAlpha = 0.35; circle(0, -190, 60 * f, 'rgba(255,200,90,0.5)'); ctx.globalAlpha = 1;
    ell(0, -185, 16, 34 * f, '#FFC85C'); ell(0, -172, 8, 16 * f, '#FFF3C4');
  }
  ctx.restore();
}
function darkTide(p, t) { // p 0..1 closing from edges
  if (p <= 0) return;
  ctx.fillStyle = '#05060D';
  const w = (W / 2) * p + 40;
  ctx.beginPath(); ctx.moveTo(-300, -300); ctx.lineTo(-300, H + 300); ctx.lineTo(w, H + 300);
  for (let y = H; y >= -100; y -= 60) ctx.lineTo(w + Math.sin(y / 70 + t * 2) * 26, y);
  ctx.lineTo(-300, -300); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(W + 300, -300); ctx.lineTo(W + 300, H + 300); ctx.lineTo(W - w, H + 300);
  for (let y = H; y >= -100; y -= 60) ctx.lineTo(W - w - Math.sin(y / 70 + t * 2 + 2) * 26, y);
  ctx.lineTo(W + 300, -300); ctx.closePath(); ctx.fill();
}
function stairs(t, p) { // spiral staircase climbing
  for (let i = 0; i < 12; i++) {
    const k = i / 12, y = 1500 - k * 1150 - (p || 0) * 200;
    const r = 300 - k * 130;
    ell(W / 2, y, r, 46, i % 2 ? '#161E38' : '#1B2544');
  }
  const ky = 1450 - p * 1150;
  keeper(W / 2, ky, 0.5, { run: 1, t });
}
function title(t, a) { if (a <= 0) return; ctx.globalAlpha = a; bigText('THE NIGHT', W / 2, 620, 150, '#F2F5FF'); bigText('THAT NEVER ENDED', W / 2, 780, 96, '#FFD43B'); ctx.globalAlpha = 1; }

// ---------- shots ----------
export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  add({ id: 'S01', at: cut(0), draw(lt, t) { // title + lighthouse
    sky(t); starfield(0, t); sea(1250, t, 1);
    lighthouse(760, 1290, 1.05, { beam: 1, beamA: Math.sin(t * 0.7) * 0.5, lamp: 1 });
    title(t, seg(lt, 0.2, 0.8));
    cue(L(0) + 0.1, 'whoosh');
  }});

  add({ id: 'S02', at: cut(1), draw(lt, t) { // keeper on balcony, 30 years
    sky(t); starfield(0, t); sea(1250, t, 1);
    lighthouse(760, 1290, 1.05, { beam: 1, beamA: Math.sin(t * 0.7) * 0.5, lamp: 1 });
    keeper(760, 700, 0.42, { t });
    K.pill('30 YEARS', 300, 380, 52, '#FFD43B', '#101425', seg(lt, 0.3, 0.7));
  }});

  add({ id: 'S03', at: cut(2), draw(lt, t) { // GPS line, question
    sky(t); starfield(0, t); sea(1250, t, 1);
    lighthouse(760, 1290, 1.05, { beam: 1, beamA: Math.sin(t * 0.7) * 0.5, lamp: 1 });
    K.phone(250, 900, 1.1, t);
    K.tag('GPS?', 250, 640, 250, 120, 64, seg(lt, 0.4, 0.8));
  }});

  add({ id: 'S04', at: cut(3), draw(lt, t) { // switch flips, beam dies
    sky(t); starfield(0, t); sea(1250, t, 0);
    const off = seg(lt, 0.25, 0.5);
    lighthouse(760, 1290, 1.05, { beam: 1 - off, beamA: Math.sin(t * 0.7) * 0.5, lamp: off < 1 });
    // lever
    ctx.save(); ctx.translate(300, 900); ctx.scale(1.2, 1.2);
    rr(-60, -40, 120, 160, 14); ctx.fillStyle = '#1B2340'; ctx.fill();
    ctx.save(); ctx.translate(0, -20); ctx.rotate(rad(lerp(-50, 50, off)));
    line([[0, 0], [0, -130]], '#8A93B5', 18); circle(0, -140, 22, '#FFD43B'); ctx.restore();
    ctx.restore();
    if (off > 0.9) cue(L(3) + 0.3, 'tock');
    if (off > 0.5) darkTide((lt - 0.5) * 0.4, t);
  }});

  add({ id: 'S05', at: cut(4), draw(lt, t) { // stars going out one by one
    sky(t); const kill = seg(lt, 0.1, 1.6);
    starfield(kill * 0.85, t); sea(1250, t, 0);
    darkTide(kill * 0.5, t);
    if (lt > 0.4 && lt < 1.5 && Math.floor(lt * 5) % 2) cue(t, 'pop', { vol: 0.4 });
  }});

  add({ id: 'S06', at: cut(5), draw(lt, t) { // dark eats the sky
    sky(t, 0.5); starfield(0.9, t); sea(1250, t, 0);
    darkTide(seg(lt, 0.1, 1.4), t);
    K.warning(540, 1050, seg(lt, 0.5, 0.9));
  }});

  add({ id: 'S07', at: cut(6), draw(lt, t) { // 108 steps
    fillAll('#0B0F1E');
    stairs(t, seg(lt, 0.1, 1.5));
    K.tag('108 STEPS', 540, 320, 0, 0, 72, seg(lt, 0.3, 0.7));
    cue(L(6) + 0.2, 'slide');
  }});

  add({ id: 'S08', at: cut(7), draw(lt, t) { // matches
    fillAll('#0B0F1E');
    const k = keeper(0, 0, 0); // no-op keep tree-shaking honest
    match(200, 1250, 1.6, 1, t);
    match(540, 1250, 1.6, seg(lt, 0.5, 0.8) > 0 ? 2 : 0, t);
    match(880, 1250, 1.6, seg(lt, 1.0, 1.3) > 0 ? 3 : 0, t);
    if (lt > 1.05) cue(L(7) + 1.0, 'sparkle');
    K.tag('3 MATCHES', 540, 380, 0, 0, 64, seg(lt, 0.2, 0.6));
  }});

  add({ id: 'S09', at: cut(8), draw(lt, t) { // beam punches hole
    sky(t, 0.6); starfield(0.85, t); sea(1250, t, 1);
    const p = seg(lt, 0.1, 1.0);
    lighthouse(760, 1290, 1.05, { beam: p, beamA: Math.sin(t * 2.2) * 0.6, lamp: 1 });
    darkTide(0.85 * (1 - p), t);
    if (p > 0.2 && p < 0.9) cue(t, 'whoosh', { vol: 0.5 });
  }});

  add({ id: 'S10', at: cut(9), draw(lt, t) { // sky restores
    sky(t); const back = seg(lt, 0.1, 1.4);
    starfield(0.85 * (1 - back), t); sea(1250, t, 1);
    lighthouse(760, 1290, 1.05, { beam: 1, beamA: Math.sin(t * 0.7) * 0.5, lamp: 1 });
    if (back > 0.3) cue(t, 'sparkle', { vol: 0.4 });
  }});

  add({ id: 'S11', at: cut(10), draw(lt, t) { // what was that dark?
    sky(t, 0.8); starfield(0.2, t); sea(1250, t, 1);
    lighthouse(760, 1290, 1.05, { beam: 1, beamA: Math.sin(t * 0.5) * 0.4, lamp: 1 });
    ctx.globalAlpha = 0.5 * seg(lt, 0.3, 0.9); bigText('?', W / 2, 700, 420, '#0B0E1A'); ctx.globalAlpha = 1;
  }});

  add({ id: 'S12', at: cut(11), draw(lt, t) { // one extra minute
    sky(t); starfield(0, t); sea(1250, t, 1);
    const pulse = 1 + 0.25 * Math.max(0, Math.sin(lt * 2.2));
    lighthouse(760, 1290, 1.05 * pulse, { beam: 1, beamA: Math.sin(t * 0.7) * 0.5, lamp: 1 });
    K.pill('+1 MIN', 300, 380, 56, '#FFD43B', '#101425', seg(lt, 0.4, 0.8));
  }});

  add({ id: 'S13', at: cut(12), draw(lt, t) { // dawn ending
    const dawn = seg(lt, 0.1, 1.2);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, dawn > 0 ? `rgb(${lerp(10, 90, dawn)},${lerp(12, 60, dawn)},${lerp(30, 90, dawn)})` : '#0A0C1E');
    g.addColorStop(1, dawn > 0 ? `rgb(${lerp(8, 240, dawn)},${lerp(10, 150, dawn)},${lerp(24, 90, dawn)})` : '#080A18');
    ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600);
    starfield(0, t * 0.3);
    sea(1250, t, 1 - dawn);
    lighthouse(760, 1290, 1.05, { beam: 1 - dawn, beamA: 0, lamp: dawn < 0.9 });
    if (lt > T.dur - cut(12) - 0.4) { ctx.globalAlpha = seg(lt, T.dur - cut(12) - 0.4, T.dur - cut(12)); bigText('SOME LIGHTS STAY ON', W / 2, 950, 84, '#FFF6D8'); ctx.globalAlpha = 1; }
  }});

  // build-time sound cues
  cue(L(0) + 0.1, 'whoosh');
  cue(L(3) + 0.3, 'tock');
  for (let k = 0; k < 4; k++) cue(L(4) + 0.2 + k * 0.35, 'pop', { vol: 0.4 });
  cue(L(6) + 0.2, 'slide');
  cue(L(7) + 1.0, 'sparkle');
  cue(L(8) + 0.4, 'whoosh', { vol: 0.5 });
  cue(L(9) + 0.5, 'sparkle', { vol: 0.4 });
  return { shots: S, cues: CUES };
}
