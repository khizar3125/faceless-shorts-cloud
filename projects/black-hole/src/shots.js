// WHAT IF YOU FELL INTO A BLACK HOLE?: 13 shots on the narration clock.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const space = () => { fillAll(C.navy); K.starfield(0, 80, 1); };

  // 1 · HOOK: black hole and a tiny astronaut
  {
    const st = cut(0), hole = Wd('hole', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 900], note: 'space, black hole, astronaut floats in',
      draw(lt) {
        space();
        K.blackHole(540, 700, 210, lt);
        K.astronaut(540, 1420, 0.85, Math.sin(lt * 1.5) * 0.06, lt);
        if (lt > hole) bigText('BLACK HOLE', 540, 320, 120, C.yellow, -0.02, eob(seg(lt, hole, hole + 0.25)));
        K.pill('NO WAY BACK', 540, 1640, 52, C.red, C.white, eob(seg(lt, 0.3, 0.6)));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'sparkle', { dur: 1.4 }); cue(st + hole, 'thud', { gain: 0.7 });
  }

  // 2 · free fall: nothing to feel
  {
    const st = cut(1), nothing = Wd('nothing', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 900], note: 'astronaut floats calm among stars',
      draw(lt) {
        space();
        K.astronaut(540, 1000, 1.5, Math.sin(lt * 1.2) * 0.05, lt);
        K.pill('FREE FALL', 540, 400, 60, C.cyan, C.ink, eob(seg(lt, 0.1, 0.4)));
        if (lt > nothing) K.tag('FEELS LIKE NOTHING', 540, 400, 540, 1560, 54, eob(seg(lt, nothing, nothing + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + nothing, 'pop');
  }

  // 3 · gravity starts to pull
  {
    const st = cut(2), closer = Wd('closer', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], note: 'hole grows, streaks pull inward',
      draw(lt) {
        space();
        K.blackHole(540, 700, 160 + 90 * seg(lt, 0.1, 1.6), lt);
        K.astronaut(540, 1440, 1.0, -0.25 + Math.sin(lt * 3) * 0.05, lt);
        if (lt > closer) {
          for (let i = 0; i < 14; i++) {
            const an = rnd(i) * TAU, r0 = 640 - (lt * 180 + i * 30) % 380;
            ctx.save(); ctx.globalAlpha = 0.6; ctx.strokeStyle = C.cyan; ctx.lineWidth = 6; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(540 + Math.cos(an) * r0, 700 + Math.sin(an) * r0);
            ctx.lineTo(540 + Math.cos(an) * (r0 - 60), 700 + Math.sin(an) * (r0 - 60)); ctx.stroke(); ctx.restore();
          }
          K.pill('GRAVITY', 540, 380, 62, C.yellow, C.ink, eob(seg(lt, closer, closer + 0.25)));
        }
      } });
    cue(st, 'whoosh'); cue(st + closer, 'slide', { dur: 1.2 });
  }

  // 4 · feet pulled harder than head
  {
    const st = cut(3), feet = Wd('feet', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 900], note: 'arrows: long at feet, short at head',
      draw(lt) {
        space();
        K.blackHole(540, 330, 120, lt);
        K.astronaut(540, 980, 1.5, 0.02, lt);
        K.arrow(540, 1500, 240 + Math.sin(lt * 4) * 20, Math.PI / 2, clamp((lt - feet) * 3));
        K.arrow(540, 640, 90, -Math.PI / 2, clamp((lt - feet) * 3));
        K.tag('STRETCHED', 540, 400, 540, 1560, 56, eob(seg(lt, feet, feet + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + feet, 'boing', { gain: 0.6 });
  }

  // 5 · spaghettification
  {
    const st = cut(4), spag = Wd('spaghettification', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 900], note: 'astronaut stretched long and wavy',
      draw(lt) {
        space();
        const k = 1 + 1.1 * eio(seg(lt, 0.05, 1.2));
        ctx.save(); ctx.translate(540, 980); ctx.scale(1 / Math.sqrt(k), k);
        K.astronaut(0, 0, 1.35, Math.sin(lt * 2) * 0.04, lt);
        ctx.restore();
        K.pill('SPAGHETTIFICATION', 540, 360, 48, C.pink, C.ink, eob(seg(lt, spag, spag + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + spag, 'slide', { dur: 1.4 }); cue(st + 0.3, 'boing', { gain: 0.4 });
  }

  // 6 · frozen from far away
  {
    const st = cut(5), frozen = Wd('frozen', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 820], note: 'tiny frozen astronaut at the edge',
      draw(lt) {
        space();
        K.blackHole(540, 640, 250, lt);
        K.astronaut(800, 1000, 0.55, 0.1, 0);
        ctx.save(); ctx.globalAlpha = 0.55 * clamp((lt - frozen + 0.4) * 2);
        for (let i = 0; i < 6; i++) {
          const an = i / 6 * TAU + lt * 0.4;
          ctx.strokeStyle = C.cyan; ctx.lineWidth = 5; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(800 + Math.cos(an) * 40, 1000 + Math.sin(an) * 40);
          ctx.lineTo(800 + Math.cos(an) * 90, 1000 + Math.sin(an) * 90); ctx.stroke();
        }
        ctx.restore();
        if (lt > frozen) K.tag('FROZEN IN TIME', 540, 380, 540, 1520, 56, eob(seg(lt, frozen, frozen + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + frozen, 'tock', { dur: 1.4 });
  }

  // 7 · event horizon
  {
    const st = cut(6), horizon = Wd('horizon', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 860], note: 'dashed no-return ring',
      draw(lt) {
        space();
        K.blackHole(540, 860, 230, lt);
        ctx.save(); ctx.setLineDash([34, 22]); ctx.lineDashOffset = -lt * 90;
        ctx.strokeStyle = C.red; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(540, 860, 300, 0, TAU); ctx.stroke(); ctx.restore();
        K.pill('EVENT HORIZON', 540, 380, 58, C.red, C.white, eob(seg(lt, 0.1, 0.4)));
        if (lt > horizon) K.tag('POINT OF NO RETURN', 540, 380, 540, 1480, 54, eob(seg(lt, horizon, horizon + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + horizon, 'alarm', { dur: 1.0 });
  }

  // 8 · space and time swap
  {
    const st = cut(7), swap = Wd('swap', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 900], note: 'warped grid, arrows swap',
      draw(lt) {
        space();
        ctx.save(); ctx.strokeStyle = C.cyan; ctx.globalAlpha = 0.45; ctx.lineWidth = 3;
        for (let i = 0; i < 12; i++) {
          ctx.beginPath();
          for (let j = 0; j <= 40; j++) {
            const x = 60 + i * 84, y = 240 + j * 36;
            const wx = x + Math.sin(y * 0.02 + lt * 2) * 18 * (i / 12);
            j ? ctx.lineTo(wx, y) : ctx.moveTo(wx, y);
          }
          ctx.stroke();
        }
        for (let j = 0; j < 8; j++) {
          ctx.beginPath();
          for (let i = 0; i <= 40; i++) {
            const x = 60 + i * 24, y = 240 + j * 150;
            const wy = y + Math.cos(x * 0.015 + lt * 2) * 22;
            i ? ctx.lineTo(x, wy) : ctx.moveTo(x, wy);
          }
          ctx.stroke();
        }
        ctx.restore();
        const sw = eio(seg(lt, swap, swap + 0.8));
        bigText('SPACE', lerp(380, 700, sw), 420, 86, C.yellow, 0, eob(seg(lt, swap, swap + 0.25)));
        bigText('TIME', lerp(700, 380, sw), 420, 86, C.cyan, 0, eob(seg(lt, swap, swap + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + swap, 'slide', { dur: 1.0 });
  }

  // 9 · the future in a flash
  {
    const st = cut(8), future = Wd('future', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 900], note: 'blinding flash, timeline frames',
      draw(lt) {
        space();
        const p = eio(seg(lt, future - 0.2, future + 0.5));
        for (let i = 0; i < 3; i++) circle(540, 860, (200 + i * 90) * p, i ? C.yellow : C.white);
        ctx.save(); ctx.globalAlpha = 0.35 * (1 - seg(lt, future + 0.6, future + 1.8));
        for (let i = 0; i < 8; i++) {
          const an = i / 8 * TAU + lt * 0.6;
          ctx.strokeStyle = C.cyan; ctx.lineWidth = 7; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(540 + Math.cos(an) * 300, 860 + Math.sin(an) * 300);
          ctx.lineTo(540 + Math.cos(an) * 520, 860 + Math.sin(an) * 520); ctx.stroke();
        }
        ctx.restore();
        if (lt > future) bigText('THE FUTURE', 540, 380, 110, C.yellow, -0.02, eob(seg(lt, future, future + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + future, 'sparkle', { dur: 1.8 }); cue(st + future, 'slam', { gain: 0.7 });
  }

  // 10 · not even light escapes
  {
    const st = cut(9), light = Wd('light', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 860], note: 'light ray bends into the hole and vanishes',
      draw(lt) {
        space();
        K.blackHole(540, 900, 260, lt);
        const p = eio(seg(lt, 0.1, light + 0.6));
        ctx.save(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 10; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(60, 500);
        ctx.quadraticCurveTo(540, 480 + p * 260, 540 + 40, 900 - 220 * p);
        ctx.stroke(); ctx.restore();
        if (lt > light) K.tag('LIGHT CANNOT ESCAPE', 540, 380, 540, 1560, 52, eob(seg(lt, light, light + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + light, 'zip', { gain: 0.6 });
  }

  // 11 · information paradox
  {
    const st = cut(10), info = Wd('information', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 880], note: 'particles, giant question mark',
      draw(lt) {
        space();
        K.blackHole(540, 760, 200, lt);
        for (let i = 0; i < 16; i++) {
          const an = rnd(i) * TAU + lt * 0.4, dd = 320 + Math.sin(lt * 2 + i) * 40;
          circle(540 + Math.cos(an) * dd, 760 + Math.sin(an) * dd, 9 + rnd(i + 5) * 8, i % 2 ? C.cyan : C.white);
        }
        bigText('?', 540, 380, 300, C.yellow, Math.sin(lt * 2) * 0.04, eob(seg(lt, info, info + 0.25)));
        K.pill('WHERE DOES IT GO?', 540, 1600, 54, C.red, C.white, eob(seg(lt, info + 0.1, info + 0.4)));
      } });
    cue(st, 'whoosh'); cue(st + info, 'pop');
  }

  // 12 · physicists argue
  {
    const st = cut(11), argue = Wd('arguing', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 940], note: 'two physicists, speech bubbles',
      draw(lt) {
        fillAll(C.bg);
        K.man({ x: 300, y: 1180, s: 1.3, mouth: 'o', eyes: 'n', brow: 1, arm: K.armPose(K.ARM.down, K.ARM.point, 1) });
        K.man({ x: 780, y: 1180, s: 1.3, mouth: 'o', eyes: 'n', brow: 1, smirk: 1 });
        rr(120, 640, 240, 150, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.stroke();
        rr(720, 640, 240, 150, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.stroke();
        bigText('?', 240, 716, 96, C.red, 0, 1);
        bigText('?!', 840, 716, 90, C.red, 0, 1);
        if (lt > argue) bigText('STILL UNSOLVED', 540, 400, 96, C.ink, -0.02, eob(seg(lt, argue, argue + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + argue, 'boing', { gain: 0.6 });
  }

  // 13 · loop hook
  {
    const st = cut(12), fell = Wd('fell', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 900], note: 'black hole again, question mark',
      draw(lt) {
        space();
        K.blackHole(540, 760, 240, lt);
        K.astronaut(540, 1460, 0.7, Math.sin(lt * 1.6) * 0.08, lt);
        if (lt > fell) bigText('WHAT IF?', 540, 380, 140, C.yellow, 0.03, eob(seg(lt, fell, fell + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fell, 'sparkle', { dur: 1.2 });
  }

  return { shots: S, cues: CUES };
}
