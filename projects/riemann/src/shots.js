// RIEMANN HYPOTHESIS: the shot list (rewritten per video with script.json).
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: AI robot + giant question ─────────────────────────────────
  {
    const st = cut(0), ai = Wd('ai', 0) - st, hard = Wd('hardest', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 900], note: 'robot appears, question mark, shock',
      draw(lt) {
        fillAll(C.bg);
        // faint prime grid backdrop
        ctx.save(); ctx.globalAlpha = 0.14; K.primesGrid(40, 260, 12, 84, lt, 1); ctx.restore();
        const pop = eob(seg(lt, 0.1, 0.55));
        if (lt > 0.1) K.robot(540, 1130, 1.35 * pop, lt, (lt * 1.6) % 1 < 0.12 ? 1 : 0, 1);
        if (lt > ai) bigText('AI?', 540, 560, 210, C.yellow, -0.05, eob(seg(lt, ai, ai + 0.25)));
        if (lt > hard) K.shockLines(540, 900, 380, clamp((lt - hard) * 4) * (1 - seg(lt, hard + 1.2, hard + 1.8)));
        K.pill('167 YEARS OPEN', 540, 1560, 58, C.red, C.white, eob(seg(lt, 0.5, 0.8)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.7 }); cue(st + hard, 'boing', { gain: 0.5 });
  }

  // ── 2 · 167 YEARS: calendar flipping ────────────────────────────────────
  {
    const st = cut(1), yrs = Wd('167', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 880], note: 'calendar flips 1859 → today, 167 lands',
      draw(lt) {
        fillAll(C.bg);
        const spin = eo(seg(lt, 0.05, yrs + 0.3)) * 6;
        K.calendar(540, 900, 2.6, String(Math.round(lerp(1859, 2026, eo(seg(lt, 0.1, Math.max(0.4, yrs)))))) , 'OPEN', spin * 0.12);
        if (lt > yrs) {
          bigText('167', 540, 520, 300, C.red, -0.03, eob(seg(lt, yrs, yrs + 0.28)));
          bigText('YEARS', 540, 700, 96, C.ink, 0, eob(seg(lt, yrs + 0.1, yrs + 0.35)));
        }
        K.warning(170, 400, 1 + Math.sin(lt * 8) * 0.06);
      } });
    cue(st, 'whoosh'); cue(st + yrs, 'thud', { gain: 0.8 });
  }

  // ── 3 · PRIMES: the hidden rule ─────────────────────────────────────────
  {
    const st = cut(2), rule = Wd('rule', 2) - st, hide = Wd('hide', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 960], note: 'prime grid lights up, one prime glows',
      draw(lt) {
        fillAll(C.bg);
        const rev = eio(seg(lt, 0.1, Math.max(0.6, rule + 0.3)));
        K.primesGrid(108, 480, 10, 86, lt, rev, lt > hide ? Math.floor((lt * 6) % 100) : -1);
        K.pill('PRIMES', 540, 340, 66, C.cyan, C.ink, eob(seg(lt, 0.15, 0.45)));
        if (lt > hide) K.magnifier(300 + Math.sin(lt * 1.8) * 140, 900 + Math.cos(lt * 1.4) * 90, 1.1, clamp((lt - hide) * 4));
        if (lt > rule) K.tag('THE SECRET RULE', 540, 340, 540, 1560, 58, eob(seg(lt, rule, rule + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + rule, 'sparkle'); cue(st + hide, 'sparkle', { dur: 1.4 });
  }

  // ── 4 · $1,000,000 prize check ──────────────────────────────────────────
  {
    const st = cut(3), win = Wd('win', 3) - st, mil = Wd('million', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 960], note: 'prize check slams in, cash burst',
      draw(lt) {
        fillAll(C.bg);
        const sc = eob(seg(lt, 0.1, Math.max(0.4, win)));
        K.prizeCheck(540, 950, sc, -0.06 + Math.sin(lt * 2) * 0.02);
        if (lt > mil) {
          for (let i = 0; i < 16; i++) {
            const p = seg(lt, mil + rnd(i) * 0.3, mil + rnd(i) * 0.3 + 1.2); if (p <= 0 || p >= 1) continue;
            const an = rnd(i + 9) * TAU, dd = 160 + eo(p) * 460;
            ctx.save(); ctx.globalAlpha = 1 - p; ctx.translate(540 + Math.cos(an) * dd, 950 + Math.sin(an) * dd);
            ctx.rotate(p * 5 + i); ctx.fillStyle = i % 2 ? C.yellow : C.cyan; ctx.fillRect(-22, -14, 44, 28);
            ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.strokeRect(-22, -14, 44, 28); ctx.restore();
          }
          bigText('$1M!', 540, 460, 190, C.yellow, 0.06, eob(seg(lt, mil, mil + 0.25)));
        }
      } });
    cue(st, 'whoosh'); cue(st + win, 'thud', { gain: 0.9 }); cue(st + mil, 'sparkle', { dur: 1.6 });
  }

  // ── 5 · Anthropic mathematician + Claude (robot) claim the proof ────────
  {
    const st = cut(4), claims = Wd('claims', 4) - st, proved = Wd('proved', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 940], note: 'man + robot hold up finished proof doc',
      draw(lt) {
        fillAll(C.bg);
        K.man({ x: 300, y: 1330, s: 1.5, mouth: 'smile', eyes: 'n', brow: 0.4, arm: K.armPose(K.ARM.down, K.ARM.point, eio(seg(lt, 0.2, 0.7))) });
        K.robot(800, 1180, 1.2, lt, (lt * 1.3) % 1 < 0.1 ? 1 : 0, 1);
        const fill = eio(seg(lt, 0.15, Math.max(0.7, claims)));
        const stamp = lt > proved ? eob(seg(lt, proved, proved + 0.3)) : 0;
        K.proofDoc(540, 800, 1.15, Math.sin(lt * 1.6) * 0.04, fill, stamp, stamp ? 'PROVED!' : '…');
        if (lt > proved) bigText('PROVED?', 540, 380, 130, C.red, -0.04, eob(seg(lt, proved, proved + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'pop'); cue(st + proved, 'slam', { gain: 0.9 });
  }

  // ── 6 · proof eluded every genius (X over past geniuses) ────────────────
  {
    const st = cut(5), elude = Wd('eluded', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 860], note: 'line of geniuses, red X marks, they fail',
      draw(lt) {
        fillAll(C.bg);
        for (let i = 0; i < 4; i++) {
          const x = 200 + i * 226, appear = eob(seg(lt, 0.1 + i * 0.14, 0.4 + i * 0.14));
          ctx.save(); ctx.translate(x, 1080); ctx.scale(appear, appear);
          K.man({ x: 0, y: 0, s: 1.05, mouth: 'o', eyes: 'n', brow: 1 });
          ctx.restore();
          if (lt > elude) K.redX(x, 940, 0.9, clamp((lt - elude - i * 0.18) * 4));
        }
        bigText('STILL OPEN', 540, 500, 140, C.red, -0.02, eob(seg(lt, 0.3, 0.6)));
        K.stopwatch(900, 430, 1.5, lt * 2.4);
      } });
    cue(st, 'whoosh'); cue(st + elude, 'alarm', { dur: 1.2 }); cue(st + 0.3, 'tock', { dur: 1.6 });
  }

  // ── 7 · TWIST: a human claimed the same thing (split screen appears) ────
  {
    const st = cut(6), twist = Wd('twist', 6) - st, week = Wd('week', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 960], note: 'screen splits, second claimant appears',
      draw(lt) {
        const sp = lerp(0, 1, eio(seg(lt, Math.max(0.1, twist - 0.2), twist + 0.5)));
        K.vsSplit(-sp, lt, 'AI', 'HUMAN');
        K.robot(280, 1160, 1.15, lt, (lt * 1.5) % 1 < 0.1 ? 1 : 0, 1);
        K.man({ x: 810, y: 1330, s: 1.4, mouth: 'o', eyes: 'wide', brow: 1, arm: K.armPose(K.ARM.down, K.ARM.point, eio(seg(lt, twist + 0.3, twist + 0.8))) });
        if (lt > twist) bigText('SAME CLAIM!', 540, 470, 120, C.yellow, -0.03, eob(seg(lt, twist, twist + 0.25)));
        if (lt > week) K.tag('SAME WEEK', 540, 620, 540, 780, 62, eob(seg(lt, week, week + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + twist, 'pop', { gain: 0.8 }); cue(st + week, 'pop');
  }

  // ── 8 · two dueling proofs, human vs machine ────────────────────────────
  {
    const st = cut(7), duel = Wd('dueling', 7) - st, mach = Wd('machine', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 960], note: 'two proof docs clash with sparks',
      draw(lt) {
        fillAll(C.bg);
        const lunge = Math.sin(lt * 9) * 26;
        K.proofDoc(330 - lunge, 880, 1.0, -0.14, 1, 1, 'PROOF A');
        K.proofDoc(750 + lunge, 880, 1.0, 0.14, 1, 1, 'PROOF B');
        if (lt > duel) {
          const a = clamp((lt - duel) * 3);
          ctx.save(); ctx.globalAlpha = a;
          for (let i = 0; i < 10; i++) {
            const an = rnd(i) * TAU + lt * 4, r1 = 60 + Math.sin(lt * 14 + i) * 30;
            ctx.strokeStyle = C.yellow; ctx.lineWidth = 10; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(540 + Math.cos(an) * r1, 880 + Math.sin(an) * r1);
            ctx.lineTo(540 + Math.cos(an) * (r1 + 60), 880 + Math.sin(an) * (r1 + 60)); ctx.stroke();
          }
          ctx.restore();
          bigText('VS', 540, 880, 200, C.yellow, 0, eob(seg(lt, duel, duel + 0.25)));
        }
        if (lt > mach) K.pill('WHICH ONE IS RIGHT?', 540, 1480, 56, C.ink, C.white, eob(seg(lt, mach, mach + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + duel, 'slide', { dur: 1.4 }); cue(st + mach, 'thud', { gain: 0.9 });
  }

  // ── 9 · "almost certainly true" (green-ish tick on the prime line) ──────
  {
    const st = cut(8), cert = Wd('certainly', 8) - st, trueW = Wd('true', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 900], note: 'big check + crowd nodding',
      draw(lt) {
        fillAll(C.bg);
        ctx.save(); ctx.globalAlpha = 0.2; K.primesGrid(108, 420, 10, 86, lt, 1); ctx.restore();
        const pop = eob(seg(lt, 0.15, Math.max(0.5, cert)));
        circle(540, 880, 300 * pop, C.cyan);
        ctx.lineWidth = 30; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(540, 880, 300 * pop, 0, TAU); ctx.stroke();
        if (pop > 0.6) {
          ctx.strokeStyle = C.white; ctx.lineWidth = 46; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(410, 880); ctx.lineTo(510, 990); ctx.lineTo(680, 760); ctx.stroke();
        }
        bigText('ALMOST…', 540, 440, 130, C.ink, -0.02, eob(seg(lt, 0.2, 0.5)));
        if (lt > trueW) bigText('TRUE!', 540, 1400, 170, C.yellow, 0.03, eob(seg(lt, trueW, trueW + 0.25)));
        for (let i = 0; i < 3; i++) {
          const x = 190 + i * 350;
          K.man({ x, y: 1660, s: 0.8, mouth: 'smile', eyes: 'n', brow: 0.3, bob: Math.sin(lt * 5 + i) * 8 });
        }
      } });
    cue(st, 'whoosh'); cue(st + cert, 'sparkle'); cue(st + trueW, 'sparkle', { dur: 1.2 });
  }

  // ── 10 · not confirmed: one wrong step, it collapses ────────────────────
  {
    const st = cut(9), wrong = Wd('wrong', 9) - st, coll = Wd('collapses', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 940], note: 'proof bricks wobble, crack, collapse',
      draw(lt) {
        fillAll(C.bg);
        const shaky = lt > wrong ? (lt - wrong) * 40 : 0;
        const cols = 4, bw = 180, bh = 110, x0 = 540 - (cols * bw) / 2;
        for (let r = 0; r < 4; r++) for (let c = 0; c < cols; c++) {
          const idx = r * cols + c, fall = clamp((coll + idx * 0.05 - 0.2) * 1.6);
          const bx = x0 + c * bw + bw / 2, by = 1360 - r * bh - bh / 2;
          const jx = Math.sin(lt * 30 + idx) * Math.min(shaky, 8);
          ctx.save();
          if (fall > 0) { ctx.translate(bx + (rnd(idx) - 0.5) * 420 * eo(fall), by + 700 * eo(fall)); ctx.rotate((rnd(idx + 3) - 0.5) * 5 * eo(fall)); ctx.globalAlpha = 1 - fall * 0.4; }
          else ctx.translate(bx + jx, by);
          rr(-bw / 2 + 5, -bh / 2 + 5, bw - 10, bh - 10, 10);
          ctx.fillStyle = r % 2 ? C.white : C.pinkLight; ctx.fill();
          ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
          ctx.restore();
        }
        if (lt > wrong) K.warning(890, 520, 1.4 + Math.sin(lt * 10) * 0.12);
        if (lt > wrong) bigText('ONE WRONG STEP', 540, 380, 110, C.red, -0.02, eob(seg(lt, wrong, wrong + 0.3)));
        if (lt > coll) K.redX(540, 940, 2.4, clamp((lt - coll) * 4));
      } });
    cue(st, 'whoosh'); cue(st + wrong, 'alarm', { dur: 1.4 }); cue(st + coll, 'thud', { gain: 1 });
  }

  // ── 11 · LOOP: back to the hook ─────────────────────────────────────────
  {
    const st = cut(10), ai = Wd('ai', 10) - st, yet = Wd('yet', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 900], note: 'robot shrugs at question mark, loop end',
      draw(lt) {
        fillAll(C.bg);
        ctx.save(); ctx.globalAlpha = 0.16; K.primesGrid(40, 300, 12, 84, lt, 1); ctx.restore();
        K.robot(540, 1150, 1.3, lt, (lt * 1.4) % 1 < 0.12 ? 1 : 0, 0);
        // shrug bob
        ctx.save(); ctx.translate(0, Math.sin(lt * 4) * 12); ctx.restore();
        bigText('?', 540, 620, 420, C.yellow, Math.sin(lt * 2) * 0.06, eob(seg(lt, 0.1, 0.5)));
        if (lt > ai) bigText('DID AN AI?', 540, 360, 118, C.ink, -0.02, eob(seg(lt, ai, ai + 0.25)));
        if (lt > yet) K.pill('NOT YET.', 540, 1580, 66, C.red, C.white, eob(seg(lt, yet, yet + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + ai, 'pop'); cue(st + yet, 'sparkle');
  }

  return { shots: S, cues: CUES };
}
