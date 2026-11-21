// WHY YOUR BRAIN GETS SONGS STUCK IN IT: 13 shots on the narration clock.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, rr, ell, line } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // 1 · HOOK: a brain with music notes orbiting
  {
    const st = cut(0);
    add({ id: 'S01', at: st, cam: [540, 900], note: 'brain with orbiting music notes',
      draw(lt) {
        fillAll(C.navy); K.starfield(lt, 60);
        K.brain(540, 900, 1.15, lt);
        for (let i = 0; i < 4; i++) {
          const a = lt * 1.2 + i * Math.PI / 2;
          K.musicNote(540 + Math.cos(a) * 380, 900 + Math.sin(a) * 230, 0.8, Math.sin(lt * 2 + i) * 0.15);
        }
        K.pill('EARWORM', 540, 420, 64, C.red, C.white, eob(seg(lt, 0.2, 0.5)));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'sparkle', { dur: 1.4 });
  }

  // 2 · living your life
  {
    const st = cut(1);
    add({ id: 'S02', at: st, cam: [540, 1000], note: 'room, man relaxed, thought bubble forms',
      draw(lt) {
        K.room();
        K.man({ x: 540, y: 940, s: 1.05, arm: K.ARM.hip, mouth: 'smile', eyes: 'normal' });
        const tb = eo(seg(lt, 0.3, 1.0));
        if (tb > 0) { ctx.save(); ctx.globalAlpha = tb; K.thoughtBubble(880, 700, 0.7, lt); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + 0.4, 'pop', { gain: 0.5 });
  }

  // 3 · a song from 2010 on loop
  {
    const st = cut(2);
    add({ id: 'S03', at: st, cam: [540, 950], note: 'retro radio blasting notes, 2010, loop',
      draw(lt) {
        fillAll(C.bg);
        // radio body
        rr(240, 900, 600, 420, 40); ctx.fillStyle = C.shirt; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke();
        rr(300, 960, 480, 220, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.stroke();
        circle(540, 1070, 80, C.navy); circle(540, 1070, 58, C.cyan);
        circle(360, 1240, 34, C.ink); circle(720, 1240, 34, C.ink);
        // antenna
        ctx.strokeStyle = C.ink; ctx.lineWidth = 10; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(700, 900); ctx.lineTo(820, 640); ctx.stroke();
        // notes bouncing out
        for (let i = 0; i < 3; i++) {
          const ph = (lt * 0.7 + i / 3) % 1;
          K.musicNote(540 + Math.sin(ph * 6 + i) * 260, 520 - ph * 320, 0.9 * (1 - ph * 0.4), Math.sin(ph * 8 + i) * 0.2);
        }
        K.pill('2010', 540, 420, 64, C.yellow, C.ink, eob(seg(lt, 0.25, 0.55)));
        // loop arrows
        ctx.strokeStyle = C.red; ctx.lineWidth = 14; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(540, 340, 120, -0.4, 2.6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(650, 250); ctx.lineTo(680, 340); ctx.lineTo(590, 330); ctx.stroke();
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'music', { dur: 1.4 });
  }

  // 4 · scientists call it involuntary musical imagery
  {
    const st = cut(3);
    add({ id: 'S04', at: st, cam: [540, 950], note: 'scientist points at labeled brain',
      draw(lt) {
        fillAll(C.bg);
        K.brain(780, 700, 1.0, lt);
        K.man({ x: 320, y: 1150, s: 1.0, arm: K.ARM.point, finger: 0.6, mouth: 'flat', eyes: 'normal' });
        K.tag('INVOLUNTARY MUSICAL IMAGERY', 540, 400, 540, 520, 50, eob(seg(lt, 0.3, 0.6)));
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'thud', { gain: 0.6 });
  }

  // 5 · brain loves patterns & repetition
  {
    const st = cut(4);
    add({ id: 'S05', at: st, cam: [540, 900], note: 'brain with repeating note rows',
      draw(lt) {
        fillAll(C.navy); K.starfield(lt, 50);
        K.brain(540, 850, 1.2, lt);
        for (let r = 0; r < 3; r++) {
          ctx.save(); ctx.globalAlpha = 0.85;
          for (let c = 0; c < 5; c++) K.musicNote(200 + c * 170, 400 + r * 160 + Math.sin(lt * 3 + r + c) * 10, 0.4, 0, r % 2 ? C.cyan : C.yellow);
          ctx.restore();
        }
        K.pill('PATTERNS & REPETITION', 540, 1500, 52, C.yellow, C.ink, eob(seg(lt, 0.3, 0.6)));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'sparkle', { dur: 1.2 });
  }

  // 6 · catchy hooks tickle that spot
  {
    const st = cut(5);
    add({ id: 'S06', at: st, cam: [540, 900], note: 'hook tickling brain, sparkles',
      draw(lt) {
        fillAll(C.bg);
        K.brain(700, 850, 1.1, lt);
        K.hookShape(300, 900, 1.0, 0.4 + Math.sin(lt * 3) * 0.08);
        if (lt > 0.35) { const s = eob(seg(lt, 0.35, 0.6)); K.burst(660, 780, 1.2 * s, 0.9 * s); }
        K.pill('CATCHY HOOK', 540, 420, 60, C.red, C.white, eob(seg(lt, 0.2, 0.5)));
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'boing', { gain: 0.6 });
  }

  // 7 · the deeper it digs in
  {
    const st = cut(6);
    add({ id: 'S07', at: st, cam: [540, 900], note: 'note burrowing into brain',
      draw(lt) {
        fillAll(C.navy); K.starfield(lt, 40);
        K.brain(540, 880, 1.25, lt);
        const depth = eo(seg(lt, 0.3, 1.6));
        K.musicNote(540, 880 - 120 * depth + Math.sin(lt * 4) * 10, 1.0, Math.sin(lt * 3) * 0.15);
        K.pill('IT DIGS DEEPER', 540, 420, 58, C.yellow, C.ink, eob(seg(lt, 0.35, 0.65)));
      } });
    cue(st, 'whoosh'); cue(st + 0.4, 'slide', { dur: 1.2 });
  }

  // 8 · brain keeps replaying it
  {
    const st = cut(7);
    add({ id: 'S08', at: st, cam: [540, 900], note: 'brain with echoing note rings',
      draw(lt) {
        fillAll(C.bg);
        K.brain(540, 900, 1.2, lt);
        K.musicNote(540, 900, 0.9, Math.sin(lt * 2) * 0.1);
        ctx.strokeStyle = C.cyan; ctx.lineWidth = 6; ctx.globalAlpha = 0.5;
        for (let i = 0; i < 3; i++) { const r = 140 + i * 60 + ((lt * 60) % 60); ctx.beginPath(); ctx.arc(540, 900, r, 0, TAU); ctx.stroke(); }
        ctx.globalAlpha = 1;
        K.pill('REPLAYING ON LOOP', 540, 420, 56, C.cyan, C.ink, eob(seg(lt, 0.25, 0.55)));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'tock', { dur: 1.2 });
  }

  // 9 · follows you into the shower
  {
    const st = cut(8);
    add({ id: 'S09', at: st, cam: [540, 950], note: 'shower scene, man under water with note',
      draw(lt) {
        K.shower(540, 900, 1.0, lt);
        K.man({ x: 540, y: 1080, s: 1.0, arm: K.ARM.down, mouth: 'smile', eyes: 'closed' });
        K.musicNote(760, 640 + Math.sin(lt * 3) * 20, 1.0, Math.sin(lt * 2) * 0.2);
        K.pill('INTO THE SHOWER', 540, 360, 58, C.cyan, C.ink, eob(seg(lt, 0.3, 0.6)));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'sizzle', { dur: 1.2 });
  }

  // 10 · pushing it out makes it stronger
  {
    const st = cut(9);
    add({ id: 'S10', at: st, cam: [540, 950], note: 'man pushes note, it grows',
      draw(lt) {
        fillAll(C.bg);
        K.man({ x: 360, y: 1250, s: 1.05, arm: K.ARM.point, finger: -1.2, mouth: 'flat', brow: 1, eyes: 'wide' });
        const grow = 1 + 0.8 * eio(seg(lt, 0.4, 1.6));
        K.musicNote(780, 1100, grow, Math.sin(lt * 3) * 0.1, C.pink);
        K.shockLines(780, 1100, 140, 0.8);
        K.pill('PUSHING MAKES IT STRONGER', 540, 400, 50, C.red, C.white, eob(seg(lt, 0.3, 0.6)));
      } });
    cue(st, 'whoosh'); cue(st + 0.4, 'boing', { gain: 0.7 });
  }

  // 11 · give your brain another song
  {
    const st = cut(10);
    add({ id: 'S11', at: st, cam: [540, 900], note: 'swap old note for new note',
      draw(lt) {
        fillAll(C.navy); K.starfield(lt, 40);
        K.brain(540, 950, 1.0, lt);
        const sw = eio(seg(lt, 0.35, 1.2));
        K.musicNote(lerp(300, 540, sw), 800, 1.0, -0.2, C.pink);
        K.musicNote(lerp(780, 540, sw), 800, 1.0, 0.2, C.yellow);
        K.pill('GIVE IT ANOTHER SONG', 540, 420, 54, C.yellow, C.ink, eob(seg(lt, 0.25, 0.55)));
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'slide', { dur: 1.0 });
  }

  // 12 · solve a puzzle, it wanders off
  {
    const st = cut(11);
    add({ id: 'S12', at: st, cam: [540, 900], note: 'brain with puzzle, note walks away',
      draw(lt) {
        fillAll(C.bg);
        K.brain(540, 900, 1.05, lt);
        K.puzzlePiece(360, 700, 0.7, 0.2, C.yellow);
        K.puzzlePiece(720, 760, 0.7, -0.15, C.cyan);
        const walk = eo(seg(lt, 0.4, 1.8));
        K.musicNote(lerp(540, 1050, walk), 600 - walk * 120, 0.9, 0.4 * walk);
        K.pill('SOLVE A PUZZLE', 540, 420, 56, C.cyan, C.ink, eob(seg(lt, 0.3, 0.6)));
      } });
    cue(st, 'whoosh'); cue(st + 0.4, 'pop', { gain: 0.5 });
  }

  // 13 · just ride it out
  {
    const st = cut(12);
    add({ id: 'S13', at: st, cam: [540, 1000], note: 'man dancing with headphones, notes bounce',
      draw(lt) {
        fillAll(C.bg);
        K.room();
        K.man({ x: 540, y: 940, s: 1.15, arm: K.ARM.wave, mouth: 'grin', eyes: 'closed', brow: 1 });
        for (let i = 0; i < 4; i++) {
          const a = lt * 2 + i * Math.PI / 2;
          K.musicNote(540 + Math.cos(a) * 420, 700 + Math.sin(a) * 180, 0.7, Math.sin(lt * 3 + i) * 0.2);
        }
        K.pill('JUST RIDE IT OUT', 540, 400, 62, C.yellow, C.ink, eob(seg(lt, 0.3, 0.6)));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'music', { dur: 1.6 });
  }

  return { shots: S, cues: CUES };
}
