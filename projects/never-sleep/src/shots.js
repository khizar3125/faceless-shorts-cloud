// WHAT IF YOU NEVER SLEPT?: 12 shots on the narration clock.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // 1 · HOOK: 3 AM, wide awake
  {
    const st = cut(0), never = Wd('never', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 950], note: 'bedroom, man wide awake at 3 AM',
      draw(lt) {
        fillAll(C.bg);
        K.bed(540, 1310, 1.5, 0);
        K.man({ x: 470, y: 1060, s: 1.05, mouth: 'o', eyes: 'wide', brow: 1 });
        K.stopwatch(880, 500, 1.5, lt * 0.3);
        K.pill('3 AM', 300, 500, 64, C.ink, C.white, eob(seg(lt, 0.15, 0.45)));
        if (lt > never) bigText('NO SLEEP?', 540, 380, 150, C.red, -0.03, eob(seg(lt, never, never + 0.25)));
        if (lt > never) K.shockLines(470, 800, 330, clamp((lt - never) * 3));
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'tock', { dur: 1.2 }); cue(st + never, 'boing', { gain: 0.5 });
  }

  // 2 · NIGHT 1: brain fights back
  {
    const st = cut(1), fight = Wd('fighting', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 880], note: 'brain pulses, warning triangle',
      draw(lt) {
        fillAll(C.bg);
        const p = 1 + Math.sin(lt * 7) * 0.05;
        K.brain(540, 900, 2.1 * p, lt);
        K.warning(180, 480, 1.4 + Math.sin(lt * 9) * 0.08);
        K.pill('NIGHT 1', 540, 420, 66, C.navy, C.white, eob(seg(lt, 0.1, 0.4)));
        if (lt > fight) K.tag('BRAIN FIGHTS BACK', 540, 420, 540, 1420, 56, eob(seg(lt, fight, fight + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'heartbeat', { gain: 0.6 }); cue(st + fight, 'thud');
  }

  // 3 · DAY 2: focus gone, memory slips
  {
    const st = cut(2), focus = Wd('focus', 2) - st, mem = Wd('memory', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 920], note: 'blurred focus, memory cards fall',
      draw(lt) {
        fillAll(C.bg);
        K.man({ x: 540, y: 1180, s: 1.5, mouth: 'o', eyes: 'n', brow: 1 });
        K.magnifier(540, 760, 1.3, 0.9, C.yellow);
        for (let i = 0; i < 9; i++) {
          const t0 = mem + rnd(i) * 0.7, p = seg(lt, t0, t0 + 1.2); if (p <= 0 || p >= 1) continue;
          ctx.save(); ctx.globalAlpha = 1 - p; ctx.translate(240 + rnd(i + 3) * 600, 500 + eo(p) * 620); ctx.rotate(p * 3 + i);
          rr(-34, -24, 68, 48, 8); ctx.fillStyle = C.white; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
        }
        K.pill('48 HOURS', 540, 380, 62, C.red, C.white, eob(seg(lt, 0.1, 0.4)));
        if (lt > focus) K.speedLines(540, 760, 0.8);
      } });
    cue(st, 'whoosh'); cue(st + mem, 'slide', { dur: 1.2 }); cue(st + focus, 'pop');
  }

  // 4 · DAY 3: hallucinations
  {
    const st = cut(3), see = Wd('hallucinating', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 900], note: 'shadow figures appear behind him',
      draw(lt) {
        fillAll(C.bg);
        for (let i = 0; i < 3; i++) {
          const a = clamp((lt - see - i * 0.15) * 3);
          if (a <= 0) continue;
          ctx.save(); ctx.globalAlpha = a * 0.85;
          ctx.fillStyle = C.navy;
          ctx.beginPath(); ctx.ellipse(200 + i * 330, 640, 110, 190, 0, 0, Math.PI * 2); ctx.fill();
          circle(200 + i * 330 - 34, 600, 12, C.white); circle(200 + i * 330 + 34, 600, 12, C.white);
          ctx.restore();
        }
        K.man({ x: 540, y: 1200, s: 1.5, mouth: 'o', eyes: 'wide', brow: 1 });
        K.shockLines(540, 780, 380, clamp((lt - see) * 3));
        K.pill('DAY 3', 540, 380, 66, C.ink, C.white, eob(seg(lt, 0.1, 0.4)));
      } });
    cue(st, 'whoosh'); cue(st + see, 'boing'); cue(st + see + 0.3, 'alarm', { dur: 0.8 });
  }

  // 5 · immune crash
  {
    const st = cut(4), crash = Wd('crashes', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 880], note: 'shield cracks, germs swarm',
      draw(lt) {
        fillAll(C.bg);
        K.shield(540, 880, 2.0, clamp((lt - crash + 0.4) * 2));
        for (let i = 0; i < 14; i++) {
          const an = rnd(i) * TAU, rr2 = 330 + Math.sin(lt * 2 + i) * 30;
          circle(540 + Math.cos(an) * rr2, 880 + Math.sin(an) * rr2, 14 + rnd(i + 4) * 10, i % 2 ? C.red : C.pinkDark);
        }
        K.tag('IMMUNE SYSTEM', 540, 360, 540, 1280, 60, eob(seg(lt, 0.15, 0.45)));
      } });
    cue(st, 'whoosh'); cue(st + crash, 'thud', { gain: 0.8 });
  }

  // 6 · heart races
  {
    const st = cut(5), race = Wd('races', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 900], note: 'heart pounds, pressure arrow climbs',
      draw(lt) {
        fillAll(C.bg);
        K.heart(430, 900, 2.4, 0.5 + 0.5 * Math.abs(Math.sin(lt * 8)));
        ctx.save(); ctx.translate(800, 900);
        ctx.fillStyle = C.white; ctx.strokeStyle = C.ink; ctx.lineWidth = 8;
        rr(-90, -260, 180, 520, 24); ctx.fill(); ctx.stroke();
        const h = 60 + 400 * seg(lt, 0.1, 1.4);
        ctx.fillStyle = C.red; rr(-78, 250 - h, 156, h, 14); ctx.fill();
        ctx.restore();
        K.pill('BLOOD PRESSURE', 540, 380, 56, C.ink, C.white, eob(seg(lt, 0.1, 0.4)));
        if (lt > race) K.speedLines(430, 900, 0.9);
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'heartbeat', { dur: 2.0 }); cue(st + race, 'alarm', { dur: 1.0 });
  }

  // 7 · week: brain shutting down
  {
    const st = cut(6), shut = Wd('shutting', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 880], note: 'brain sections go dark one by one',
      draw(lt) {
        fillAll(C.bg);
        K.brain(540, 900, 2.3, lt, clamp((lt - shut + 0.5) * 0.5));
        K.pill('DAY 7', 540, 400, 66, C.navy, C.white, eob(seg(lt, 0.1, 0.4)));
        if (lt > shut) K.tag('SHUTTING DOWN', 540, 400, 540, 1440, 58, eob(seg(lt, shut, shut + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + shut, 'alarm', { dur: 1.4 });
  }

  // 8 · rare deaths
  {
    const st = cut(7), died = Wd('died', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 900], note: 'warning, red X, extreme tag',
      draw(lt) {
        fillAll(C.bg);
        K.warning(540, 760, 2.6 + Math.sin(lt * 8) * 0.05);
        if (lt > died) K.redX(540, 780, 2.6, clamp((lt - died) * 3));
        K.pill('RARE — BUT REAL', 540, 1240, 58, C.red, C.white, eob(seg(lt, 0.15, 0.45)));
        if (lt > died) bigText('DEADLY', 540, 380, 140, C.red, -0.02, eob(seg(lt, died, died + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + died, 'slam', { gain: 0.9 });
  }

  // 9 · eleven days record
  {
    const st = cut(8), eleven = Wd('eleven', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 900], note: 'calendar 11, stopwatch spinning',
      draw(lt) {
        fillAll(C.bg);
        K.calendar(370, 980, 1.5, '11', 'DAYS', Math.sin(lt * 1.5) * 0.04);
        K.stopwatch(860, 980, 1.4, lt * 3);
        if (lt > eleven) bigText('264 HOURS', 540, 400, 100, C.red, -0.02, eob(seg(lt, eleven, eleven + 0.25)));
        K.pill('WORLD RECORD', 540, 1500, 52, C.ink, C.white, eob(seg(lt, 0.2, 0.5)));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'tock', { dur: 1.6 }); cue(st + eleven, 'thud');
  }

  // 10 · why do we sleep
  {
    const st = cut(9), nobody = Wd('scientists', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 880], note: 'big question mark over brain',
      draw(lt) {
        fillAll(C.bg);
        K.brain(540, 980, 1.9, lt);
        bigText('?', 540, 560, 380, C.yellow, Math.sin(lt * 2) * 0.05, eob(seg(lt, 0.1, 0.45)));
        K.magnifier(760, 760, 1.0, clamp((lt - nobody) * 3));
        if (lt > nobody) K.tag('NOBODY KNOWS', 540, 380, 540, 1450, 60, eob(seg(lt, nobody, nobody + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'pop'); cue(st + nobody, 'boing', { gain: 0.5 });
  }

  // 11 · brain cleans itself
  {
    const st = cut(10), cleans = Wd('flushes', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 900], note: 'cyan flush waves wash waste away',
      draw(lt) {
        fillAll(C.bg);
        K.brain(540, 920, 2.2, lt);
        const p = seg(lt, cleans, cleans + 1.6);
        for (let i = 0; i < 4; i++) {
          const yy = 760 + i * 90, xx = 540 - 420 + ((lt * 220 + i * 120) % 840);
          ctx.save(); ctx.globalAlpha = 0.7 * (1 - p * 0.5);
          circle(xx, yy, 26, C.cyan); ctx.restore();
        }
        for (let i = 0; i < 10; i++) {
          const q = seg(lt, cleans + rnd(i) * 0.6, cleans + rnd(i) * 0.6 + 1.4); if (q <= 0 || q >= 1) continue;
          const an = rnd(i + 7) * TAU, dd = 220 + eo(q) * 380;
          ctx.save(); ctx.globalAlpha = 1 - q; circle(540 + Math.cos(an) * dd, 920 + Math.sin(an) * dd, 12, C.pinkDark); ctx.restore();
        }
        if (lt > cleans) K.tag('BRAIN CLEANUP', 540, 380, 540, 1440, 58, eob(seg(lt, cleans, cleans + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + cleans, 'bubbles', { dur: 1.6 }); cue(st + cleans + 0.2, 'sparkle', { dur: 1.2 });
  }

  // 12 · loop: just sleep
  {
    const st = cut(11), sleep = Wd('sleep', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 950], note: 'back in bed, Zs float, JUST SLEEP',
      draw(lt) {
        fillAll(C.bg);
        K.bed(540, 1310, 1.5, clamp((lt - sleep) * 2));
        K.man({ x: 470, y: 1060, s: 1.05, mouth: 'smile', eyes: 'n', brow: 0 });
        for (let i = 0; i < 3; i++) {
          const p = seg(lt, 0.2 + i * 0.4, 1.8 + i * 0.4); if (p <= 0 || p >= 1) continue;
          ctx.save(); ctx.globalAlpha = 1 - p; ctx.fillStyle = C.ink; ctx.font = '900 ' + (70 - i * 12) + 'px Inter';
          ctx.fillText('Z', 760 + Math.sin(lt * 2 + i) * 18, 820 - eo(p) * 260); ctx.restore();
        }
        bigText('?', 540, 480, 200, C.yellow, 0.04, eob(seg(lt, 0.1, 0.4)));
        if (lt > sleep) K.pill('JUST SLEEP.', 540, 1480, 66, C.ink, C.white, eob(seg(lt, sleep, sleep + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + sleep, 'pop'); cue(st + 0.3, 'sparkle', { dur: 1.0 });
  }

  return { shots: S, cues: CUES };
}
