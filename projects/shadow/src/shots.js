// THE DAY MY SHADOW QUIT : shot list (Stick Story · original comedy, 16 shots).
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }. cut(i) = just before line i,
// Wd('word', i) = when the word is said. Sound: cue(t, type, { gain, dur }).
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line, fillAll, bigText } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, FLOOR, GROUND } = K;

const rad = (dg) => dg * Math.PI / 180;
const blink = (t) => ((t % 3.1) < 0.12 ? 1 : 0);

// ═══════════════ THE SHADOW (flat ink silhouette — same rig as K.person, no face) ═══════════════
function limbSil(x, y, l1, a1, l2, a2, dir, w) {
  const kx = x + Math.sin(rad(a1)) * l1 * dir, ky = y + Math.cos(rad(a1)) * l1;
  const ex = kx + Math.sin(rad(a1 + a2)) * l2 * dir, ey = ky + Math.cos(rad(a1 + a2)) * l2;
  line([[x, y], [kx, ky], [ex, ey]], P.ink, w); return [ex, ey];
}
function sil(x, y, h, o = {}) {
  const d = o.dir || 1, w = h * 0.034, wk = o.walk;
  const hipY = y - h * 0.46, shY = y - h * 0.77, r = h * 0.105;
  ctx.save(); ctx.globalAlpha = o.alpha ?? 0.92;
  ctx.translate(x, hipY); ctx.rotate(rad((o.lean || 0) * d)); ctx.translate(-x, -hipY);
  const sw = wk != null ? Math.sin(wk) : 0;
  const legs = o.legs || { L: [wk != null ? sw * 26 : 6, wk != null ? Math.max(0, -sw) * 30 + 6 : 4], R: [wk != null ? -sw * 26 : -6, wk != null ? Math.max(0, sw) * 30 + 6 : 4] };
  const arms = o.arms || { L: [wk != null ? -sw * 24 : -8, 12], R: [wk != null ? sw * 24 : 10, 16] };
  limbSil(x, hipY, h * 0.25, legs.L[0], h * 0.23, -legs.L[1], d, w);
  limbSil(x, shY + h * 0.02, h * 0.17, arms.L[0], h * 0.16, arms.L[1], d, w);
  line([[x, hipY], [x, shY]], P.ink, w * 1.15);
  limbSil(x, hipY, h * 0.25, legs.R[0], h * 0.23, -legs.R[1], d, w);
  const hand = limbSil(x, shY + h * 0.02, h * 0.17, arms.R[0], h * 0.16, arms.R[1], d, w);
  circle(hand[0], hand[1], w * 0.9, P.ink);
  if (o.hold) o.hold(hand[0], hand[1]);
  const hx = x + d * r * 0.08, hy = shY - r * 1.12;
  circle(hx, hy, r, P.ink);
  if (o.glasses) { ctx.fillStyle = P.white; rr(hx - r * 0.68, hy - r * 0.32, r * 0.54, r * 0.34, r * 0.1); ctx.fill(); rr(hx + r * 0.14, hy - r * 0.32, r * 0.54, r * 0.34, r * 0.1); ctx.fill(); line([[hx - r * 0.14, hy - r * 0.18], [hx + r * 0.14, hy - r * 0.18]], P.white, r * 0.09); }
  ctx.restore();
}

// ═══════════════ SET PIECES ═══════════════
function note(x, y, s, rot = 0, sc = 1) {
  if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc * s, sc * s);
  rr(-10, -180, 310, 380, 14); ctx.fillStyle = 'rgba(28,28,34,0.18)'; ctx.fill();
  rr(-150, -190, 300, 380, 14); ctx.fillStyle = '#FFFDF4'; ctx.fill();
  for (let i = -110; i <= 150; i += 52) line([[-118, i], [118, i]], '#EFE8D2', 4);
  ctx.font = '900 76px Inter'; ctx.fillStyle = P.goldDark; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('I QUIT.', 0, -62);
  ctx.font = '800 32px Inter'; ctx.fillStyle = P.ink; ctx.fillText('— YOUR SHADOW', 0, 34);
  ctx.restore();
}
function suitcase(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(-90, -140, 180, 190, 18); ctx.fillStyle = '#B9683A'; ctx.fill(); rr(-90, -62, 180, 16, 6); ctx.fillStyle = '#8E4E28'; ctx.fill(); ctx.beginPath(); ctx.arc(0, -148, 34, Math.PI, TAU); ctx.lineWidth = 12; ctx.strokeStyle = '#8E4E28'; ctx.stroke(); circle(-56, 58, 12, P.ink); circle(56, 58, 12, P.ink); ctx.restore(); }
function pigeon(x, y, s = 1, t = 0, fly = 0) {
  ctx.save(); ctx.translate(x, y - fly * 300); ctx.globalAlpha = 1 - fly * 0.35; ctx.scale(s, s);
  const flap = fly > 0 ? Math.sin(t * 26) * 0.9 : 0;
  ell(0, 0, 34, 24, P.ink); circle(26, -22, 16, P.ink);
  ctx.beginPath(); ctx.moveTo(40, -22); ctx.lineTo(56, -16); ctx.lineTo(40, -11); ctx.closePath(); ctx.fillStyle = P.gold; ctx.fill();
  line([[0, -6], [-16, 16 - flap * 30]], P.ink, 5); line([[-16, 16 - flap * 30], [-34, -6 - flap * 40]], P.ink, 5);
  line([[-8, 20], [-8, 30]], P.ink, 4); line([[10, 20], [10, 30]], P.ink, 4);
  circle(-3, -27, 4, P.white); ctx.restore();
}
function umbrella(x, y, s = 1, tilt = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(s, s); line([[0, 0], [0, -150]], P.ink, 8); ctx.beginPath(); ctx.arc(0, -150, 130, Math.PI, TAU); ctx.fillStyle = P.sofa; ctx.fill(); line([[-130, -150], [-130, -128]], P.ink, 6); line([[130, -150], [130, -128]], P.ink, 6); ctx.restore(); }
function basket(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(-110, -70, 220, 130, 16); ctx.fillStyle = '#E8D9BE'; ctx.fill(); for (let i = -70; i <= 70; i += 35) line([[i, -70], [i, 60]], '#C9B78F', 6); ell(0, -76, 96, 30, P.sofa); ell(-42, -92, 42, 22, P.rug); ell(46, -88, 36, 20, P.plant); ctx.restore(); }
function burst(x, y, s, a) { if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a; for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4, r1 = 48 + (i % 2) * 28; line([[Math.cos(an) * r1, Math.sin(an) * r1], [Math.cos(an) * (r1 + 46), Math.sin(an) * (r1 + 46)]], P.gold, 12); } circle(0, 0, 30, P.white); ctx.restore(); }
function rain(a, t, n = 24) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < n; i++) { const x = -100 + ((rnd(i) * (W + 200) + t * 260) % (W + 200)); const y = -100 + ((rnd(i + 31) * (H + 200) + t * 1150) % (H + 200)); line([[x, y], [x - 14, y + 44]], 'rgba(96,116,156,0.55)', 5); }
  ctx.restore();
}
function sunDisc(x, y, r, t) { ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.15); for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); line([[r + 20, 0], [r + 54, 0]], P.gold, 10); } ctx.rotate(-t * 0.15); circle(0, 0, r, P.gold); circle(0, 0, r * 0.8, '#F7C878'); ctx.restore(); }
function tree(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); line([[0, 0], [-14, -260]], '#7A5236', 26); line([[-10, -140], [-90, -220]], '#7A5236', 18); line([[-12, -180], [80, -250]], '#7A5236', 18); circle(-90, -262, 88, P.plant); circle(20, -302, 108, P.plant); circle(112, -242, 78, P.plant); circle(-24, -352, 76, '#7FB069'); ctx.restore(); }
function bench(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(-220, -170, 440, 34, 10); ctx.fillStyle = P.wood; ctx.fill(); rr(-220, -110, 440, 30, 10); ctx.fillStyle = P.wood; ctx.fill(); rr(-224, -262, 32, 164, 8); ctx.fillStyle = P.wood; ctx.fill(); rr(192, -262, 32, 164, 8); ctx.fillStyle = P.wood; ctx.fill(); line([[-190, -80], [-190, 0]], P.ink, 14); line([[190, -80], [190, 0]], P.ink, 14); ctx.restore(); }
function skyline(y, col, warm = false) {
  const bs = [[-40, 260, 300], [180, 200, 420], [350, 300, 260], [620, 240, 380], [830, 290, 300], [1000, 220, 360]];
  ctx.fillStyle = col; for (const [bx, bw, bh] of bs) ctx.fillRect(bx, y - bh, bw, bh + 300);
  ctx.fillStyle = warm ? 'rgba(255,214,140,0.6)' : 'rgba(255,220,140,0.45)';
  for (let i = 0; i < 26; i++) { const [bx, bw, bh] = bs[i % bs.length]; if (rnd(i + 3) < 0.4) continue; ctx.fillRect(bx + 26 + rnd(i) * (bw - 60), y - bh + 40 + rnd(i + 9) * (bh - 130), 22, 30); }
}
function road(y) { ctx.fillStyle = '#C9BFA9'; ctx.fillRect(-300, y, W + 600, 70); ctx.fillStyle = '#8A8478'; ctx.fillRect(-300, y + 70, W + 600, H - y + 300); ctx.fillStyle = 'rgba(255,255,255,0.7)'; for (let i = 0; i < 5; i++) ctx.fillRect(-60 + i * 270, y + 210, 140, 16); }
function park(skyCol = P.sky) { ctx.fillStyle = skyCol; ctx.fillRect(-300, -300, W + 600, FLOOR + 300); ctx.fillStyle = P.plant; ctx.fillRect(-300, FLOOR, W + 600, H - FLOOR + 300); ctx.fillStyle = '#7FB069'; ctx.fillRect(-300, FLOOR, W + 600, 26); ctx.fillStyle = '#D9CDBA'; ctx.beginPath(); ctx.moveTo(280, FLOOR); ctx.lineTo(800, FLOOR); ctx.lineTo(1020, H + 300); ctx.lineTo(60, H + 300); ctx.closePath(); ctx.fill(); }
function sunset() { ctx.fillStyle = '#F2B27A'; ctx.fillRect(-300, -300, W + 600, FLOOR + 300); sunDisc(870, FLOOR - 150, 115, 0); skyline(FLOOR - 30, '#4A3F55', true); ctx.fillStyle = '#B48A66'; ctx.fillRect(-300, FLOOR, W + 600, H - FLOOR + 300); ctx.fillStyle = '#C99F7A'; ctx.fillRect(-300, FLOOR, W + 600, 24); }

// ═══════════════ SHOTS ═══════════════
export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // 1 · my shadow and I did everything together
  add({ id: 'S01', at: 0, cam: [540, 1080], zoom: 0.05, note: 'hero + shadow walk in sync through the living room', draw(lt, d, t) {
    K.livingRoom({});
    const wk = t * 5.5;
    sil(320, GROUND, 840, { walk: wk, alpha: 0.88 });
    K.person({ x: 480, y: GROUND, h: 840, walk: wk, mood: 'happy', look: [0.8, 0.1], blink: blink(t) });
  } });
  cue(0.15, 'pop', { gain: 0.5 });

  // 2 · lately he's been… weird
  { const st = cut(1);
    add({ id: 'S02', at: st, cam: [540, 1020], zoom: 0.1, note: 'hero glances back; shadow stands arms crossed, stepping away', draw(lt, d, t) {
      K.livingRoom({});
      K.person({ x: 560, y: GROUND, h: 840, mood: 'worried', look: [-0.9, 0], blink: blink(t), arms: { L: [-14, 18], R: [22, 26] } });
      sil(330 + lt * 9, GROUND, 840, { alpha: 0.85, lean: -3, arms: { L: [98, 116], R: [98, 116] } });
      if (lt > d * 0.55) K.counterPill("SOMETHING'S OFF", 540, 340, eob(seg(lt, d * 0.55, d * 0.55 + 0.3)));
    } });
    cue(st, 'tock'); cue(st + 0.02, 'whoosh', { gain: 0.5 }); }

  // 3 · one morning, I found a note
  { const st = cut(2), nt = Wd('note', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1120], zoom: 0.07, note: 'hero bends toward a note on the floor by the door', draw(lt, d, t) {
      K.hallway({ a: 'HOME' });
      K.person({ x: 420, y: GROUND, h: 840, dir: 1, lean: 13, mood: 'worried', look: [0.9, 0.7], blink: blink(t), legs: { L: [16, 24], R: [-12, 18] }, arms: { L: [-18, 10], R: [lerp(30, 118, eio(seg(lt, 0.1, nt))), 12] } });
      note(700, FLOOR + 180, 0.85, -0.12, eob(seg(lt, nt, nt + 0.25)));
    } });
    cue(st, 'whoosh'); cue(st + nt, 'pop'); }

  // 4 · it said: I QUIT. Signed, your shadow.
  { const st = cut(3), qt = Wd('quit', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 950], zoom: 0.1, note: 'shock close-up + the note big', draw(lt, d, t) {
      fillAll(P.wall);
      K.bigHead(250, 640, 280, { mood: lt > qt ? 'scared' : 'worried', look: [0.6, 0.15], dir: 1, blink: blink(t) });
      note(740, 1000, 2.1, -0.06, eob(seg(lt, qt, qt + 0.28)));
      K.cinemaBars(eo(seg(lt, qt, qt + 0.35)) * 0.55);
    } });
    cue(st, 'whoosh'); cue(st + qt, 'thud', { gain: 0.7 }); cue(st + qt + 0.05, 'whoosh', { gain: 0.55 }); }

  // 5 · tired of copying me all day
  { const st = cut(4);
    const POSES = [[112, 18], [82, 62], [42, 112]];
    const pAt = (l) => (l < 0 ? null : POSES[clamp(Math.floor(l), 0, 2)]);
    add({ id: 'S05', at: st, cam: [540, 1060], zoom: 0.05, note: 'hero strikes poses; shadow copies each one 0.45 s late, then gives up', draw(lt, d, t) {
      K.hallway({ a: 'HOME' });
      const hp = pAt(lt - 1.0), sp = pAt(lt - 1.45);
      K.person({ x: 560, y: GROUND, h: 840, mood: lt > 3.4 ? 'happy' : 'calm', look: [0.7, 0], blink: blink(t), arms: hp ? { L: [-10, 14], R: hp } : undefined });
      const done = lt > 3.9;
      sil(330, GROUND, 840, { alpha: 0.85, lean: done ? -6 : 0, arms: done ? { L: [-32, 22], R: [-32, 22] } : (sp ? { L: [-10, 14], R: sp } : undefined) });
    } });
    cue(st, 'whoosh'); cue(st + 1.45, 'tock'); cue(st + 2.45, 'tock'); cue(st + 3.9, 'boing', { gain: 0.45 }); }

  // 6 · so he left. and he's thriving
  { const st = cut(5), lv = Wd('thriving', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 1050], zoom: 0.04, note: 'shadow strides off with a suitcase; hero waves weakly', draw(lt, d, t) {
      ctx.fillStyle = P.sky; fillAll(P.sky); skyline(FLOOR - 30, '#4A5A78'); road(FLOOR + 40);
      const sx = 420 + Math.min(lt * 300, 900);
      sil(sx, GROUND, 840, { walk: t * 7, alpha: 0.9, hold: (x, y) => suitcase(x + 26, y + 46, 0.72) });
      K.person({ x: 170, y: GROUND, h: 800, mood: lt > lv ? 'worried' : 'calm', look: [1, 0.1], blink: blink(t), arms: { L: [-12, 16], R: [64 + Math.sin(lt * 5) * 8, 16] } });
    } });
    cue(st, 'whoosh'); cue(st + 0.25, 'plop'); cue(st + lv, 'sparkle', { dur: 0.7, gain: 0.5 }); }

  // 7 · he dances in the park. he high-fives pigeons.
  { const st = cut(6), pg = Wd('pigeons', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 1020], zoom: 0.04, note: 'shadow dances; pigeons get high-fived and bail', draw(lt, d, t) {
      park(); tree(950, FLOOR + 40, 1.1);
      const dir = Math.floor(lt / 1.6) % 2 ? -1 : 1;
      sil(600, GROUND - Math.abs(Math.sin(lt * 6.5)) * 46 * (lt > 0.3 ? 1 : 0), 840, { walk: t * 9, dir, lean: 9 * Math.sin(lt * 4.5), alpha: 0.9, arms: { L: [70 + 55 * Math.sin(lt * 9), 45], R: [-70 + 55 * Math.sin(lt * 9 + Math.PI), 45] } });
      const fly = seg(lt, pg, pg + 0.5);
      pigeon(790, FLOOR + 190, 1, t, fly); pigeon(880, FLOOR + 160, 0.85, t + 0.4, seg(lt, pg + 0.12, pg + 0.62)); pigeon(720, FLOOR + 215, 0.8, t + 0.8, seg(lt, pg + 0.24, pg + 0.74));
      K.person({ x: 110, y: GROUND, h: 780, dir: 1, mood: 'worried', look: [1, 0.2], blink: blink(t) });
    } });
    cue(st, 'boing'); cue(st + pg, 'pop'); cue(st + pg + 0.15, 'whoosh', { gain: 0.45 }); }

  // 8 · he even got a tan. I don't know how.
  { const st = cut(7), tn = Wd('tan', 7) - st, how = Wd('how', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.05, note: 'shadow sunbathing with sunglasses; hero peeks from behind the tree', draw(lt, d, t) {
      park(); sunDisc(880, 300, 105, t);
      rr(560, FLOOR + 160, 400, 96, 22); ctx.fillStyle = P.rug; ctx.fill();
      sil(720, FLOOR + 215, 800, { alpha: 0.9, lean: -12, glasses: lt > tn, legs: { L: [76, 4], R: [92, 4] }, arms: { L: [-138, 16], R: [-150, 18] } });
      K.person({ x: 250, y: GROUND, h: 820, dir: 1, mood: 'worried', look: [1, 0.3], blink: blink(t) });
      tree(190, FLOOR + 40, 1.25);
      K.counterPill('HOW??', 540, 360, eob(seg(lt, how, how + 0.28)));
    } });
    cue(st, 'whoosh'); cue(st + tn, 'pop'); cue(st + how, 'tock'); }

  // 9 · and me? I just felt flat. like paper.
  { const st = cut(8), fl = Wd('flat', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 1050], zoom: 0.08, note: 'night, lamp off, hero slumped on the couch, rain on the window', draw(lt, d, t) {
      K.livingRoom({ night: true, lampOn: false });
      ctx.fillStyle = 'rgba(8,12,24,0.25)'; ctx.fillRect(-300, -300, W + 600, H + 600);
      K.person({ x: 560, y: FLOOR - 15, h: 820, mood: 'sleepy', look: [0.1, 0.7], blink: blink(t), lean: -13, legs: { L: [84, 6], R: [98, 6] }, arms: { L: [-24, 34], R: [38, 44] } });
      ctx.save(); ctx.beginPath(); ctx.rect(600, 360, 360, 420); ctx.clip(); rain(0.8, t + 3, 10); ctx.restore();
      if (lt > fl) K.counterPill('FLAT', 540, 340, eob(seg(lt, fl, fl + 0.28)));
    } });
    cue(st, 'thud', { gain: 0.5 }); cue(st + fl, 'pop'); }

  // 10 · no one laughed at my jokes. not even me.
  { const st = cut(9), lg = Wd('laughed', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 1080], zoom: 0.05, note: 'park bench in the rain; even the pigeon walks away', draw(lt, d, t) {
      park('#8FA6BC'); bench(500, GROUND + 80);
      K.person({ x: 420, y: GROUND - 95, h: 800, mood: 'worried', look: [0.2, 0.8], blink: blink(t), lean: -8, legs: { L: [82, 8], R: [96, 8] }, arms: { L: [-26, 30], R: [34, 42] } });
      const turn = seg(lt, lg, lg + 0.4);
      if (turn > 0) { ctx.save(); ctx.translate(640 + turn * 130, GROUND + 40); ctx.scale(-1, 1); pigeon(0, 0, 0.9, t, 0); ctx.restore(); }
      else pigeon(640, GROUND + 40, 0.9, t, 0);
      rain(1, t, 26);
      ctx.fillStyle = 'rgba(169,184,206,0.5)'; ell(420, GROUND + 60, 150, 26, 'rgba(169,184,206,0.5)');
    } });
    cue(st, 'whoosh'); cue(st + lg, 'tock'); }

  // 11 · so I did the one thing he never saw me do
  { const st = cut(10), on = Wd('one', 10) - st;
    add({ id: 'S11', at: st, cam: [480, 1060], zoom: 0.06, note: 'hero rises from the bench, determined; umbrella man passes', draw(lt, d, t) {
      park('#8FA6BC'); bench(500, GROUND + 80); rain(0.8, t, 18);
      const k = eio(seg(lt, on, on + 0.55));
      K.person({ x: 420, y: lerp(GROUND - 95, GROUND, k), h: 820, mood: k > 0.5 ? 'determined' : 'worried', look: [0.4, lerp(0.8, 0, k)], blink: blink(t), lean: lerp(-8, 0, k), legs: k > 0.85 ? undefined : { L: [82, 8], R: [96, 8] }, arms: k > 0.85 ? { L: [-25, 25], R: [25, 25] } : { L: [-26, 30], R: [34, 42] } });
      K.person({ x: 940 - lt * 55, y: GROUND, h: 760, dir: -1, walk: t * 4.5, mood: 'calm', look: [-0.5, 0], hold: (x, y) => umbrella(x + 8, y - 6, 1.0, 0.12) });
    } });
    cue(st, 'whoosh'); cue(st + on, 'boing', { gain: 0.5 }); }

  // 12 · I danced. badly. in public. in the rain.
  { const st = cut(11), bd = Wd('badly', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 1020], zoom: 0.03, note: 'THE DANCE — full commitment, terrible technique', draw(lt, d, t) {
      park('#8FA6BC'); rain(1, t, 30);
      ctx.fillStyle = 'rgba(169,184,206,0.5)'; ell(500, GROUND + 40, 210, 34, 'rgba(169,184,206,0.5)');
      for (let k = 0; k < 3; k++) { const ph = (lt * 1.3 + k / 3) % 1; ctx.strokeStyle = `rgba(255,255,255,${0.55 * (1 - ph)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(500, GROUND + 40, 30 + ph * 120, (30 + ph * 120) * 0.3, 0, 0, TAU); ctx.stroke(); }
      const dir = Math.floor(lt / 1.6) % 2 ? -1 : 1;
      const jump = lt > 0.25 ? -Math.abs(Math.sin(lt * 6.5)) * 70 : 0;
      K.person({ x: 500, y: GROUND + jump, h: 840, walk: t * 11, dir, mood: 'happy', look: [dir * 0.5, -0.2], blink: blink(t), lean: 12 * Math.sin(lt * 4.6), arms: { L: [75 * Math.sin(lt * 9), 55 + 35 * Math.sin(lt * 7.3)], R: [-75 * Math.sin(lt * 9), 55 + 35 * Math.cos(lt * 7.1)] } });
      K.person({ x: 920, y: GROUND, h: 760, dir: -1, mood: 'scared', look: [-0.9, 0.1], blink: blink(t), arms: { L: [-30, 40], R: [-30, 40] }, hold: (x, y) => umbrella(x + 8, y - 6, 1.0, 0.35) });
      if (lt > bd && lt < bd + 0.3) bigText('BADLY.', 540, 420, 110, P.gold, -0.04, eob(seg(lt, bd, bd + 0.2)));
    } });
    cue(st, 'boing'); cue(st + 0.5, 'plop'); cue(st + 1.5, 'plop'); cue(st + bd, 'slam', { gain: 0.6 }); }

  // 13 · and that's exactly when he came back
  { const st = cut(12), bk = Wd('back', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 1040], zoom: 0.05, note: 'sunset; the shadow walks back in, clapping', draw(lt, d, t) {
      sunset(); rain(Math.max(0, 0.5 - lt), t, 8);
      const sx = 1180 - Math.min(lt * 330, 420);
      sil(sx, GROUND, 840, { walk: lt < 1.3 ? t * 6 : null, dir: -1, alpha: 0.92, glasses: lt > bk, arms: { L: [85 + 35 * Math.sin(lt * 13), 70], R: [85 + 35 * Math.sin(lt * 13 + Math.PI), 70] } });
      K.person({ x: 380, y: GROUND, h: 840, dir: 1, mood: lt > 0.4 ? (lt > 1.0 ? 'happy' : 'scared') : 'worried', look: [0.9, 0], blink: blink(t), arms: lt > 1.0 ? { L: [-42, 26], R: [46, 26] } : undefined });
    } });
    cue(st, 'whoosh'); cue(st + 0.3, 'pop'); cue(st + bk, 'sparkle', { dur: 0.8, gain: 0.55 }); }

  // 14 · 'you got interesting. I'm in.'
  { const st = cut(13), hf = Wd('interesting', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 980], zoom: 0.12, note: 'two-shot; the high-five', draw(lt, d, t) {
      sunset();
      const k = eio(seg(lt, hf - 0.35, hf));
      K.person({ x: 360, y: GROUND, h: 840, dir: 1, mood: 'happy', look: [0.8, 0], blink: blink(t), arms: { L: [-16, 18], R: [lerp(24, 118, k), lerp(14, 6, k)] } });
      sil(740, GROUND, 840, { dir: -1, alpha: 0.92, glasses: true, arms: { L: [lerp(24, 118, k), lerp(14, 6, k)], R: [-18, 16] } });
      burst(548, 640, 1.1, eob(seg(lt, hf, hf + 0.22)) * (1 - seg(lt, hf + 0.55, hf + 0.95)));
    } });
    cue(st, 'whoosh'); cue(st + hf, 'sparkle', { dur: 1.0 }); cue(st + hf + 0.05, 'pop', { gain: 0.6 }); }

  // 15 · now we take turns leading the way
  { const st = cut(14), tn = Wd('turns', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 1060], zoom: 0.03, note: 'walking into the sunset; the lead swaps', draw(lt, d, t) {
      sunset();
      const sw = Math.max(0, lt - tn);
      const hx = 340 + lt * 55 + sw * 95, sx2 = 600 + lt * 55 - sw * 45;
      ctx.fillStyle = 'rgba(28,28,34,0.16)'; ell(hx, GROUND + 26, 150, 20, 'rgba(28,28,34,0.16)'); ell(sx2, GROUND + 26, 150, 20, 'rgba(28,28,34,0.16)');
      sil(sx2, GROUND, 840, { walk: t * 5.5, alpha: 0.92, glasses: true });
      K.person({ x: hx, y: GROUND, h: 840, walk: t * 5.5, mood: 'happy', look: [0.8, 0], blink: blink(t) });
    } });
    cue(st, 'whoosh'); cue(st + tn, 'pop'); }

  // 16 · he still won't do the laundry, though.
  { const st = cut(15), ld = Wd('laundry', 15) - st;
    add({ id: 'S16', at: st, cam: [540, 1030], zoom: 0.06, note: 'final gag: shadow on the couch, hero with the basket, deadpan to camera', draw(lt, d, t) {
      K.livingRoom({ night: false });
      sil(640, FLOOR - 15, 800, { alpha: 0.9, lean: -9, glasses: true, legs: { L: [78, 6], R: [92, 6] }, arms: { L: [150, 142], R: [162, 148] } });
      K.person({ x: 300, y: GROUND, h: 840, mood: 'worried', look: [0, 0.15], blink: blink(t), arms: { L: [-10, 14], R: [58, 24] }, hold: (x, y) => basket(x + 10, y - 44, 0.9) });
      K.counterPill('STILL NO.', 540, 340, eob(seg(lt, ld, ld + 0.28)));
    } });
    cue(st, 'whoosh'); cue(st + ld, 'tock'); cue(st + ld + 0.3, 'pop'); }

  return { shots: S, cues: CUES };
}
