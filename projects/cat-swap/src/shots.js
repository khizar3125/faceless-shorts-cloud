// render all
// render pass 3
// render pass 2
// I SWAPPED BODIES WITH MY CAT — Stick Story
// A man wakes up as a cat; his cat runs his life better than he did.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line, fillAll, bigText } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

const rad = (d) => d * Math.PI / 180;
const blink = (t) => ((t % 3.1) < 0.12 ? 1 : 0);

// ---------- helpers ----------
function cat(x, y, s, o = {}) { // side-view cat
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s);
  const fur = o.fur || '#E8A75C', ink = '#3A2E20';
  const stretch = o.stretch || 0, tail = Math.sin((o.t || 0) * 3) * 0.3;
  // tail
  ctx.save(); ctx.translate(120, -70); ctx.rotate(tail + (o.tailUp ? -0.9 : 0));
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(70, -30, 60, -110);
  ctx.strokeStyle = fur; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
  // body
  ell(0, -80, 130 + stretch * 40, 62 - stretch * 8, fur);
  // legs
  ctx.strokeStyle = fur; ctx.lineWidth = 20;
  line([[-70, -50], [-70, 0]], fur, 20); line([[-40, -50], [-40, 0]], fur, 20);
  line([[50, -50], [50, 0]], fur, 20); line([[80, -50], [80, 0]], fur, 20);
  // head
  circle(-150, -130, 56, fur);
  ctx.beginPath(); ctx.moveTo(-192, -168); ctx.lineTo(-176, -212); ctx.lineTo(-150, -176); ctx.closePath(); ctx.fillStyle = fur; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-108, -168); ctx.lineTo(-124, -212); ctx.lineTo(-150, -176); ctx.closePath(); ctx.fill();
  // face
  if (!o.noFace) {
    const eo_ = o.sleep ? 0 : 1;
    if (o.sleep) { line([[-172, -134], [-156, -134]], ink, 6); line([[-144, -134], [-128, -134]], ink, 6); }
    else { circle(-168, -136, 6, ink); circle(-134, -136, 6, ink); }
    // whiskers
    line([[-196, -120], [-236, -126]], ink, 4); line([[-196, -112], [-236, -108]], ink, 4);
    line([[-104, -120], [-64, -126]], ink, 4); line([[-104, -112], [-64, -108]], ink, 4);
    if (o.mood === 'smile') { ctx.beginPath(); ctx.arc(-150, -114, 10, 0.2, Math.PI - 0.2); ctx.strokeStyle = ink; ctx.lineWidth = 5; ctx.stroke(); }
    else { line([[-158, -108], [-142, -108]], ink, 5); }
  }
  ctx.restore();
}
function catPaws(x, y, s, o = {}) { // cat doing a human thing (typing/holding)
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const fur = o.fur || '#E8A75C';
  ell(0, 0, 90, 55, fur);
  circle(-40, -70, 40, fur); circle(40, -70, 40, fur);
  circle(-40, -70, 40, fur);
  const tap = Math.sin((o.t || 0) * 12) * 10;
  line([[-40, -50], [-40 - 10, -110 - tap]], fur, 18);
  line([[40, -50], [40 + 10, -110 + tap]], fur, 18);
  circle(-52, -122 - tap, 12, '#D89048'); circle(52, -122 + tap, 12, '#D89048');
  ctx.restore();
}
function humanSleep(x, y, s) { // man sleeping = the cat in my body
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-90, -60, 180, 90, 30); ctx.fillStyle = '#4A6FA5'; ctx.fill();
  circle(110, -80, 52, '#E8B98A');
  ctx.beginPath(); ctx.arc(110, -88, 52, Math.PI * 0.9, Math.PI * 2.1); ctx.fillStyle = '#2A2E45'; ctx.fill();
  line([[150, -60], [190, -30]], '#E8B98A', 16);
  ctx.restore();
}
function bookshelf(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-260, -900, 520, 900, 12); ctx.fillStyle = '#8A6B4A'; ctx.fill();
  ctx.strokeStyle = '#5E4630'; ctx.lineWidth = 12; ctx.stroke();
  for (let r = 0; r < 4; r++) {
    const yy = -680 + r * 210;
    line([[-260, yy], [260, yy]], '#5E4630', 12);
    for (let b = 0; b < 7; b++) {
      const bw = 40 + rnd(r * 9 + b) * 30, bh = 120 + rnd(r * 7 + b) * 50;
      rr(-230 + b * 70, yy - bh, bw, bh, 4);
      ctx.fillStyle = ['#C0553B', '#4A6FA5', '#5E8C61', '#D8A93E'][ (r + b) % 4 ]; ctx.fill();
    }
  }
  ctx.restore();
}
function mug(x, y, s, steam = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-45, -60, 90, 80, 10); ctx.fillStyle = '#C0553B'; ctx.fill();
  ctx.beginPath(); ctx.arc(58, -22, 26, -1.2, 1.2); ctx.strokeStyle = '#C0553B'; ctx.lineWidth = 12; ctx.stroke();
  if (steam > 0) { ctx.globalAlpha = steam * 0.5; ctx.strokeStyle = '#999'; ctx.lineWidth = 6;
    for (let i = 0; i < 2; i++) { ctx.beginPath(); for (let yy = 0; yy < 70; yy += 10) ctx.lineTo(-10 + i * 22 + Math.sin(yy / 12 + (0)) * 8, -70 - yy); ctx.stroke(); }
    ctx.globalAlpha = 1; }
  ctx.restore();
}
function laptop(x, y, s, open = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-160, -20, 320, 24, 8); ctx.fillStyle = '#B9C2CE'; ctx.fill();
  ctx.save(); ctx.translate(-160, -20); ctx.rotate(rad(-100 * open));
  rr(0, -220, 320, 220, 10); ctx.fillStyle = '#3A4A78'; ctx.fill(); ctx.restore();
  ctx.restore();
}
function glassFall(x, y, s, p) { // p 0..1 falling
  ctx.save(); ctx.translate(x, y + p * 420); ctx.rotate(p * 2.4); ctx.scale(s, s);
  ctx.globalAlpha = 1 - p * 0.6;
  rr(-45, -70, 90, 140, 12); ctx.fillStyle = 'rgba(200,230,245,0.7)'; ctx.fill();
  ctx.strokeStyle = '#8FB8CC'; ctx.lineWidth = 6; ctx.stroke();
  ctx.restore();
}
function mouse(x, y, s, flip = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (flip ? -1 : 1), s);
  ell(0, 0, 46, 30, '#9AA0AC');
  circle(-40, -14, 22, '#9AA0AC');
  circle(-46, -30, 10, '#D8A0A8');
  line([[42, 0], [86, -14]], '#9AA0AC', 6);
  circle(-32, -18, 3, '#222'); circle(-48, -18, 3, '#222');
  ctx.restore();
}
function tag(text, x, y, size, sc = 1) { if (sc <= 0) return; ctx.save(); ctx.globalAlpha = clamp(sc, 0, 1); ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 16; ctx.strokeStyle = '#FFFFFF'; ctx.strokeText(text, x, y); ctx.fillStyle = '#17181C'; ctx.fillText(text, x, y); ctx.restore(); }
function laserDot(x, y) { ctx.globalAlpha = 0.9; circle(x, y, 14, '#FF3B30'); ctx.globalAlpha = 0.35; circle(x, y, 30, '#FF3B30'); ctx.globalAlpha = 1; }
function plant(x, y, s, alive = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(-40, -90); ctx.lineTo(40, -90); ctx.lineTo(60, 0); ctx.closePath();
  ctx.fillStyle = '#C0553B'; ctx.fill();
  ctx.strokeStyle = alive ? '#5E8C61' : '#8A7A5A'; ctx.lineWidth = 12; ctx.lineCap = 'round';
  for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(0, -85); ctx.quadraticCurveTo(i * 40, -140, i * 55, alive ? -190 : -120); ctx.stroke(); }
  ctx.restore();
}
function roomDay() {
  ctx.fillStyle = '#F2EAD8'; ctx.fillRect(-300, -300, W + 600, H + 600);
  ctx.fillStyle = '#D8CBB2'; ctx.fillRect(-300, K.FLOOR, W + 600, H - K.FLOOR + 300);
}
function roomNight() {
  ctx.fillStyle = '#1B2340'; ctx.fillRect(-300, -300, W + 600, H + 600);
  ctx.fillStyle = '#141A2E'; ctx.fillRect(-300, K.FLOOR, W + 600, H - K.FLOOR + 300);
  for (let i = 0; i < 8; i++) circle(120 + i * 110, 160 + (i % 3) * 60, 3 + rnd(i) * 3, '#EAF2FF');
}
function windowLight(x, y, w, h) { K.windowPane(x, y, w, h, false); }

// ---------- shots ----------
export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  add({ id: 'S01', at: cut(0), draw(lt, t) { // wake up on bookshelf
    roomDay(); bookshelf(540, K.FLOOR, 1);
    cat(540, K.FLOOR - 690, 0.75, { t, mood: 'shock', noFace: false });
    tag('9 FEET UP', 540, 300, 84, seg(lt, 0.4, 0.9));
    cue(L(0) + 0.3, 'boing');
  }});

  add({ id: 'S02', at: cut(1), draw(lt, t) { // paws, whiskers, red dot
    roomDay();
    cat(400, K.GROUND - 20, 1.1, { t });
    laserDot(lerp(650, 820, seg(lt, 0.2, 1.2)) + Math.sin(t * 7) * 20, 1150 + Math.sin(t * 5) * 40);
    tag('THE RED DOT.', 700, 420, 72, seg(lt, 0.5, 1.0));
    cue(L(1) + 0.4, 'pop');
  }});

  add({ id: 'S03', at: cut(2), draw(lt, t) { // cat in my body stretching
    roomDay();
    rr(160, 1150, 760, 160, 30); ctx.fillStyle = '#B9683A'; ctx.fill(); // bed
    humanSleep(540, 1230, 1.2);
    ctx.font = `800 46px Inter`; ctx.textAlign = 'center'; ctx.fillStyle = '#22283B';
    ctx.globalAlpha = seg(lt, 0.5, 0.9); ctx.fillText('zzz… 9 hours', 760, 1000); ctx.globalAlpha = 1;
  }});

  add({ id: 'S04', at: cut(3), draw(lt, t) { // bad coffee on keyboard
    roomDay();
    // desk
    rr(200, 1050, 680, 36, 10); ctx.fillStyle = '#8A6B4A'; ctx.fill();
    line([[260, 1086], [260, 1400]], '#5E4630', 16); line([[820, 1086], [820, 1400]], '#5E4630', 16);
    laptop(430, 1050, 1.0, 1);
    mug(620, 1020, 1.0, 1);
    catPaws(430, 990, 0.9, { t });
    tag('BAD COFFEE.', 540, 380, 76, seg(lt, 0.4, 0.9));
    cue(L(3) + 0.4, 'plop');
  }});

  add({ id: 'S05', at: cut(4), draw(lt, t) { // promoted / glass falls
    roomDay();
    // left: office badge + up arrow
    rr(140, 900, 300, 200, 16); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.strokeStyle = K.P.ink; ctx.lineWidth = 8; ctx.stroke();
    circle(220, 980, 40, '#E8B98A');
    ctx.font = `800 34px Inter`; ctx.textAlign = 'left'; ctx.fillStyle = '#22283B';
    ctx.fillText('EMPLOYEE', 280, 970); ctx.fillText('OF THE MONTH', 280, 1014);
    tag('PROMOTED', 290, 780, 66, seg(lt, 0.3, 0.7));
    // right: glass falling
    glassFall(760, 900, 1.0, seg(lt, 0.5, 1.1));
    cat(820, K.GROUND - 20, 0.8, { t, flip: 1 });
    cue(L(4) + 1.0, 'slam');
  }});

  add({ id: 'S06', at: cut(5), draw(lt, t) { // no regrets
    roomDay();
    // shattered glass
    ctx.strokeStyle = '#8FB8CC'; ctx.lineWidth = 7;
    for (let i = 0; i < 8; i++) { const an = i / 8 * TAU; line([[760, 1330], [760 + Math.cos(an) * (60 + rnd(i) * 60), 1330 + Math.sin(an) * (40 + rnd(i + 3) * 40)]], '#8FB8CC', 7); }
    cat(760, K.GROUND - 20, 1.0, { t, mood: 'smile' });
    tag('NO REGRETS.', 540, 420, 84, seg(lt, 0.3, 0.8));
  }});

  add({ id: 'S07', at: cut(6), draw(lt, t) { // wednesday: fixed life
    roomDay();
    // calendar with checkmarks
    rr(240, 700, 600, 420, 16); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.strokeStyle = K.P.ink; ctx.lineWidth = 10; ctx.stroke();
    ctx.font = `800 44px Inter`; ctx.textAlign = 'left'; ctx.fillStyle = '#22283B';
    ctx.fillText('SLEEP: FIXED', 290, 800); ctx.fillText('DIET: FIXED', 290, 900);
    ctx.fillStyle = '#5E8C61'; ctx.fillText('✓ ✓', 640, 800); ctx.fillText('✓ ✓', 640, 900);
    humanSleep(540, 1330, 0.9);
    tag('BY WEDNESDAY', 540, 380, 70, seg(lt, 0.3, 0.8));
  }});

  add({ id: 'S08', at: cut(7), draw(lt, t) { // two mice, zero forgiveness
    roomDay();
    cat(400, K.GROUND - 20, 1.0, { t, mood: 'smile' });
    mouse(760, K.GROUND - 10, 1.0); mouse(880, K.GROUND - 10, 0.8, 1);
    tag('2 MICE', 780, 700, 64, seg(lt, 0.3, 0.7));
    tag('0 FORGIVEN', 780, 850, 64, seg(lt, 0.7, 1.1));
    cue(L(7) + 0.4, 'tock');
  }});

  add({ id: 'S09', at: cut(8), draw(lt, t) { // friday: meet at fridge, swap back
    roomDay();
    // fridge
    rr(420, 620, 240, 560, 20); ctx.fillStyle = '#DDE3EA'; ctx.fill(); ctx.strokeStyle = K.P.ink; ctx.lineWidth = 10; ctx.stroke();
    line([[420, 900], [660, 900]], K.P.ink, 10);
    cat(280, K.GROUND - 20, 0.9, { t });
    humanSleep(830, 1330, 1.0);
    tag('SWAP BACK.', 540, 380, 84, seg(lt, 0.6, 1.1));
    cue(L(8) + 0.6, 'sparkle');
  }});

  add({ id: 'S10', at: cut(9), draw(lt, t) { // sunday naps
    roomDay(); windowLight(160, 500, 260, 320);
    laptop(700, 1200, 1.0, 0.4);
    humanSleep(700, 1160, 0.8);
    cat(300, 1080, 0.9, { t, sleep: 1 });
    // windowsill
    rr(160, 820, 260, 30, 8); ctx.fillStyle = '#8A6B4A'; ctx.fill();
    tag('SUNDAY', 540, 330, 76, seg(lt, 0.3, 0.8));
  }});

  add({ id: 'S11', at: cut(10), draw(lt, t) { // bills paid, plants alive, laser missing
    roomDay();
    plant(300, K.FLOOR, 1.2, 1);
    rr(560, 900, 340, 90, 12); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.strokeStyle = K.P.ink; ctx.lineWidth = 8; ctx.stroke();
    ctx.font = `800 44px Inter`; ctx.textAlign = 'center'; ctx.fillStyle = '#5E8C61'; ctx.fillText('PAID ✓', 730, 958);
    tag('LASER: MISSING', 540, 1300, 68, seg(lt, 0.6, 1.1));
  }});

  add({ id: 'S12', at: cut(11), draw(lt, t) { // rematch
    roomNight();
    cat(400, K.GROUND - 20, 1.1, { t, mood: 'smile' });
    laserDot(760 + Math.sin(t * 6) * 60, 1000 + Math.cos(t * 4) * 50);
    ctx.globalAlpha = seg(lt, 0.3, 0.8);
    bigText('REMATCH?', 540, 480, 110, '#FFD43B');
    ctx.globalAlpha = 1;
    cue(L(11) + 0.5, 'pop');
  }});

  // build-time sound cues
  cue(L(0) + 0.3, 'boing');
  cue(L(1) + 0.4, 'pop');
  cue(L(3) + 0.4, 'plop');
  cue(L(4) + 1.0, 'slam');
  cue(L(7) + 0.4, 'tock');
  cue(L(8) + 0.6, 'sparkle');
  cue(L(11) + 0.5, 'pop');
  return { shots: S, cues: CUES };
}
