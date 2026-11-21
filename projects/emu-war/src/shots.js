// THE GREAT EMU WAR : a cut-paper history short (Paper Atlas style). Original, funny, viral.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;
const rad = (dd) => dd * Math.PI / 180;

// ── set pieces (cut paper) ──
/** an emu: big oval body, long neck, small head, beak, thin legs. o.eat = peck 0..1 */
function emu(x, y, s, d = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * d, s);
  cut(P_poly([[-22, -60], [-8, -60], [-14, 0], [-28, 0]]), P.ink, { shadow: 0.5, edge: 4 });
  cut(P_poly([[20, -60], [34, -60], [28, 0], [14, 0]]), P.ink, { shadow: 0.5, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -130, 92, 72, 0, 0, TAU); }, '#6B4A2F', { shadow: 0.7, edge: 5 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-20, -170); ctx.quadraticCurveTo(-75, -130, -32, -75); ctx.quadraticCurveTo(-10, -105, -20, -170); }, '#4E3620', { shadow: 0.4, edge: 4 });
  const peck = (o.eat || 0) * 40;
  cut(() => { ctx.beginPath(); ctx.moveTo(12, -190); ctx.quadraticCurveTo(46, -320, 22 + peck, -405); ctx.lineTo(52 + peck, -400); ctx.quadraticCurveTo(60, -300, 42, -190); ctx.closePath(); }, '#6B4A2F', { shadow: 0.5, edge: 4 });
  cut(P_circ(38 + peck, -420, 30), '#6B4A2F', { shadow: 0.5, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.moveTo(64 + peck, -430); ctx.lineTo(100 + peck, -418); ctx.lineTo(64 + peck, -408); ctx.closePath(); }, P.gold, { shadow: 0.3, edge: 3 });
  circle(44 + peck, -428, 5, P.ink);
  ctx.restore();
}
/** a wheat stalk (cut paper) */
function wheat(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-5, -260, 10, 260, 4), '#7E8B5A', { shadow: 0.3, edge: 3 });
  for (let i = 0; i < 5; i++) { const a = -0.5 + i * 0.25; cut(() => { ctx.beginPath(); ctx.moveTo(0, -240); ctx.lineTo(Math.cos(a) * 85, -240 + Math.sin(a) * 40); ctx.lineTo(0, -200); ctx.closePath(); }, P.gold, { shadow: 0.3, edge: 3 }); }
  ctx.restore();
}
/** a machine gun */
function gun(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  cut(P_rr(-160, -18, 220, 36, 10), '#3E2C1E', { shadow: 0.5, edge: 4 });
  cut(P_rr(-120, -42, 40, 24, 6), '#3E2C1E', { shadow: 0.4, edge: 3 });
  cut(P_rr(40, -32, 30, 62, 8), '#3E2C1E', { shadow: 0.4, edge: 3 });
  cut(P_rr(-185, 0, 42, 18, 6), P.sepia, { shadow: 0.3, edge: 3 });
  ctx.restore();
}
/** a bullet */
function bullet(x, y, ang) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); cut(P_rr(-14, -5, 28, 10, 5), P.crimson, { shadow: 0.2, edge: 2 }); ctx.restore();
}
/** muzzle flash */
function flash(x, y, s, t) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.moveTo(-50, -30); ctx.lineTo(0, -90 - Math.sin(t * 40) * 12); ctx.lineTo(50, -30); ctx.lineTo(0, -8); ctx.closePath(); }, '#F2C14E', { shadow: 0.3, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-28, -20); ctx.lineTo(0, -60); ctx.lineTo(28, -20); ctx.lineTo(0, -4); ctx.closePath(); }, '#E0782E', { shadow: 0.2, edge: 2 });
  ctx.restore();
}
/** a white flag of surrender */
function whiteFlag(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-6, -340, 12, 340, 5), P.sepia, { shadow: 0.3, edge: 3 });
  cut(P_rr(6, -340, 112, 82, 6), P.edge, { shadow: 0.4, edge: 4 });
  ctx.restore();
}
/** a gold victory crown */
function crown(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_poly([[-70, -60], [-82, -130], [-40, -90], [0, -140], [40, -90], [82, -130], [70, -60]]), P.gold, { shadow: 0.5, edge: 4 });
  cut(P_rr(-70, -60, 140, 42, 8), P.gold, { shadow: 0.4, edge: 4 });
  ctx.restore();
}
/** simplified outline of Australia */
function australia() {
  cut(P_poly([[140, 700], [260, 520], [440, 420], [620, 430], [760, 520], [860, 680], [820, 820], [640, 880], [420, 860], [240, 820]]), P.land, { shadow: 0.8, edge: 5 });
  K.label('AUSTRALIA', 520, 640, 44);
}

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const dashedRoute = K.dashedRoute;

  // 1 · 1932: Australia declares war on birds
  add({ id: 'S01', at: 0, cam: [540, 900], zoom: 0.08, note: 'Australia map, 1932 ribbon, emu vs soldier', draw(lt, d, t) {
    K.parchment(1); australia();
    K.ribbon('1932', 540, 360, eob(seg(lt, 0.1, 0.5)));
    emu(340, 1180, 0.9, 1);
    K.figure({ x: 740, y: 1180, h: 560, role: 'guard', dir: -1, arm: 20 });
    if (lt > d * 0.5) K.slip('WAR ON BIRDS', 540, 1320, eob(seg(lt, d * 0.5, d * 0.5 + 0.3)), -0.02, 56);
  } });
  cue(0.1, 'whoosh'); cue(0.15, 'pop', { gain: 0.6 });

  // 2 · emus eating the wheat
  { const st = cut_(1), wh = Wd('wheat', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 1050], zoom: 0.1, note: 'wheat field, emus eating', draw(lt, d, t) {
      K.parchment(2); cut(P_rr(-300, 1300, W + 600, 800, 0), '#B68A5C', { shadow: 0, edge: 0 });
      for (let i = 0; i < 9; i++) wheat(80 + i * 130, 1420, 0.8 + (i % 3) * 0.15);
      emu(380, 1350, 1.0, 1, { eat: seg(lt, 0.2, 0.8) }); emu(720, 1350, 0.9, -1, { eat: seg(lt, 0.4, 1) });
      K.slip('WHEAT CROPS', 540, 300, eob(seg(lt, 0.15, 0.4)));
      if (lt > wh) K.slip('ALL YOU CAN EAT', 540, 470, eob(seg(lt, wh, wh + 0.3)), 0.03, 46);
    } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.5 }); cue(st + wh, 'pop'); }

  // 3 · the army arrives with machine guns
  { const st = cut_(2), g = Wd('guns', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'soldiers march with machine guns', draw(lt, d, t) {
      K.parchment(3); cut(P_rr(-300, 1350, W + 600, 800, 0), '#9C8C70', { shadow: 0, edge: 0 });
      for (let i = 0; i < 4; i++) { const x = 220 + i * 210; K.figure({ x, y: 1350, h: 600, role: 'guard', dir: 1, walk: lt * 2 + i * 0.5 }); gun(x + 60, 1350 - 420, 0.8, -0.15); }
      K.slip('THE ARMY ARRIVES', 540, 300, eob(seg(lt, 0.15, 0.4)));
      if (lt > g) K.slip('WITH MACHINE GUNS', 540, 470, eob(seg(lt, g, g + 0.3)), -0.03, 48);
    } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop'); cue(st + g, 'thud'); }

  // 4 · the emus had other plans
  { const st = cut_(3), pl = Wd('plans', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 950], zoom: 0.14, note: 'emu close-up, has a plan', draw(lt, d, t) {
      K.parchment(4); emu(540, 1250, 1.6, 1);
      K.slip('THE EMUS HAD A PLAN', 540, 350, eob(seg(lt, 0.15, 0.4)), 0.02, 52);
      if (lt > pl) K.seal(840, 420, 0.8, 'E');
    } });
    cue(st, 'whoosh'); cue(st + pl, 'pop'); }

  // 5 · they split up and outran the army
  { const st = cut_(4), sp = Wd('split', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 900], zoom: 0.08, note: 'map: emus split into small groups', draw(lt, d, t) {
      K.map({ highlight: 1 });
      const p = eio(seg(lt, 0.2, 0.9));
      dashedRoute([[420, 640], [560, 760], [650, 900]], clamp((p - 0.1) * 1.4));
      dashedRoute([[420, 640], [520, 800], [470, 980]], clamp((p - 0.35) * 1.4));
      dashedRoute([[420, 640], [600, 740], [760, 920]], clamp((p - 0.6) * 1.4));
      emu(650, 900, 0.5, 1); emu(470, 980, 0.5, -1); emu(760, 920, 0.5, 1);
      if (lt > sp) K.slip('SMALL GROUPS', 540, 320, eob(seg(lt, sp, sp + 0.3)), -0.02, 48);
    } });
    cue(st, 'whoosh'); cue(st + sp, 'pop'); }

  // 6 · they fired thousands of rounds, mostly missing
  { const st = cut_(5), mi = Wd('missing', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.1, note: 'soldiers fire, bullets miss emus', draw(lt, d, t) {
      K.parchment(6); cut(P_rr(-300, 1350, W + 600, 800, 0), '#9C8C70', { shadow: 0, edge: 0 });
      K.figure({ x: 300, y: 1350, h: 600, role: 'guard', dir: 1, arm: 40 });
      gun(380, 1350 - 420, 1.0, -0.1);
      emu(800, 1350, 1.0, -1);
      if (lt > 0.2 && Math.sin(lt * 30) > 0.4) flash(430, 1350 - 430, 0.5, t);
      for (let i = 0; i < 4; i++) { const ph = (lt * 0.9 + i / 4) % 1; bullet(lerp(430, 800, ph), lerp(1350 - 430, 1350 - 580, ph) - Math.sin(ph * Math.PI) * 70, -0.12); }
      if (lt > mi) K.slip('MOSTLY MISSING', 540, 320, eob(seg(lt, mi, mi + 0.3)), -0.02, 52);
    } });
    cue(st, 'whoosh'); for (let i = 0; i < 6; i++) cue(st + i * 0.12, 'pop', { gain: 0.4 }); cue(st + mi, 'boing', { gain: 0.5 }); }

  // 7 · the emus were like tanks
  { const st = cut_(6), tk = Wd('tanks', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 950], zoom: 0.12, note: 'emu like a tank', draw(lt, d, t) {
      K.parchment(7);
      cut(P_rr(180, 1150, 720, 260, 40), '#6B4A2F', { shadow: 0.7, edge: 5 });
      cut(P_rr(220, 1080, 640, 60, 20), '#4E3620', { shadow: 0.5, edge: 4 });
      cut(P_rr(200, 1330, 680, 90, 40), '#3E2C1E', { shadow: 0.5, edge: 5 });
      for (let i = 0; i < 8; i++) circle(250 + i * 85, 1375, 30, P.sepia);
      cut(() => { ctx.beginPath(); ctx.moveTo(560, 1080); ctx.quadraticCurveTo(700, 900, 680, 780); ctx.lineTo(740, 780); ctx.quadraticCurveTo(760, 980, 640, 1080); ctx.closePath(); }, '#6B4A2F', { shadow: 0.5, edge: 4 });
      cut(P_circ(710, 760, 34), '#6B4A2F', { shadow: 0.5, edge: 4 });
      cut(() => { ctx.beginPath(); ctx.moveTo(738, 770); ctx.lineTo(790, 758); ctx.lineTo(738, 748); ctx.closePath(); }, P.gold, { shadow: 0.3, edge: 3 });
      cut(P_rr(200, 1120, 320, 40, 12), '#3E2C1E', { shadow: 0.5, edge: 4 });
      K.slip('LIKE TANKS', 540, 350, eob(seg(lt, 0.2, 0.45)), 0.02, 54);
    } });
    cue(st, 'whoosh'); cue(st + 0.2, 'thud'); cue(st + tk, 'slam'); }

  // 8 · the military gave up and went home
  { const st = cut_(7), hm = Wd('home', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.08, note: 'soldier retreats with white flag', draw(lt, d, t) {
      K.parchment(8); cut(P_rr(-300, 1350, W + 600, 800, 0), '#9C8C70', { shadow: 0, edge: 0 });
      K.figure({ x: 420, y: 1350, h: 600, role: 'guard', dir: -1, walk: lt * 1.5 });
      whiteFlag(540, 1350 - 300, 0.9);
      if (lt > hm) K.slip('WE GIVE UP', 540, 320, eob(seg(lt, hm, hm + 0.3)), -0.02, 52);
    } });
    cue(st, 'whoosh'); cue(st + hm, 'boing', { gain: 0.5 }); }

  // 9 · the emus won the war
  { const st = cut_(8), wn = Wd('won', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 950], zoom: 0.1, note: 'emu crowned victor', draw(lt, d, t) {
      K.parchment(9); emu(540, 1250, 1.4, 1); crown(560, 1250 - 440, 1.0);
      if (lt > wn) K.ribbon('EMUS WIN', 540, 360, eob(seg(lt, wn, wn + 0.4)), 90);
    } });
    cue(st, 'whoosh'); cue(st + wn, 'sparkle'); }

  // 10 · never tried to fight birds again
  { const st = cut_(9), br = Wd('birds', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 950], zoom: 0.08, note: 'sign: no more bird wars, emu salutes', draw(lt, d, t) {
      K.parchment(10);
      cut(P_rr(180, 900, 720, 340, 20), '#B9A98C', { shadow: 0.7, edge: 5 });
      K.label('NO MORE', 540, 1010, 70); K.label('BIRD WARS', 540, 1140, 70, P.crimson);
      cut(P_rr(500, 1240, 80, 260, 10), P.sepia, { shadow: 0.4, edge: 4 });
      emu(300, 1350, 1.0, 1);
      if (lt > br) K.slip('THE END', 540, 420, eob(seg(lt, br, br + 0.3)), 0.02, 54);
    } });
    cue(st, 'whoosh'); cue(st + br, 'sparkle'); }

  return { shots: S, cues: CUES };
}
