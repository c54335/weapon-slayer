import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import monSheetUrl from './assets/mon.png';
import zomSheetUrl from './assets/zom.png';
import bossSheetUrl from './assets/boss.png';
import battleBgUrl from './assets/background.png';
import swordIconUrl from './assets/sword-icon.png';
import bombIconUrl from './assets/bomb-icon.png';
import lightningIconUrl from './assets/lightning-icon.png';
import iceIconUrl from './assets/ice-icon.png';
import swordSheetUrl from './assets/sword-sheet.png';
import bombSheetUrl from './assets/bomb-sheet.png';
import lightningSheetUrl from './assets/lightning-sheet.png';
import iceSheetUrl from './assets/ice-sheet.png';

const WEAPON_ASSETS = {
  sword: { icon: swordIconUrl, sheet: swordSheetUrl },
  bomb: { icon: bombIconUrl, sheet: bombSheetUrl },
  lightning: { icon: lightningIconUrl, sheet: lightningSheetUrl },
  ice: { icon: iceIconUrl, sheet: iceSheetUrl },
};

const WEAPONS = {
  sword: { name: '旋轉劍', icon: swordIconUrl, sheet: swordSheetUrl, color: '#f0c040', radius: 40, speed: 720, damage: 24, label: '雙劍連斬！', triple: '三連旋斬！', effectScale: 1.18, rotate360: true },
  bomb: { name: '爆破彈', icon: bombIconUrl, sheet: bombSheetUrl, color: '#ff6644', radius: 75, speed: 330, damage: 38, label: '雙重爆破！', triple: '三連爆破！', effectScale: 1.55 },
  ice: { name: '冰霜束', icon: iceIconUrl, sheet: iceSheetUrl, color: '#88ddff', radius: 30, speed: 500, damage: 16, freeze: 3, label: '雙重冰封！', triple: '三連冰霜！', effectScale: .95 },
  lightning: { name: '閃電鏈', icon: lightningIconUrl, sheet: lightningSheetUrl, color: '#ccaaff', radius: 55, speed: 920, damage: 20, label: '雙重閃電！', triple: '三連雷鏈！', effectScale: 1.25 },
};
const TYPES = Object.keys(WEAPONS);
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const uid = (() => { let n = 1; return () => n++; })();

function randomWeapon() { return TYPES[Math.floor(Math.random() * TYPES.length)]; }
function normalizeWeaponQueue(queue) {
  // 每次隊列變動都立刻反覆檢查相鄰方塊。
  // 例如 A / X / A，當 X 被消耗後，兩個 A 會在同一個更新循環內馬上合成。
  const q = queue.map(x => ({ ...x, tier: x.tier || 1 }));
  const now = Date.now();
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < q.length - 1; i++) {
      const a = q[i], b = q[i + 1];
      if (a.type !== b.type) continue;
      if ((a.tier || 1) >= 3 || (b.tier || 1) >= 3) continue;
      const nextTier = Math.min(3, (a.tier || 1) + (b.tier || 1));
      q.splice(i, 2, {
        id: uid(),
        type: a.type,
        tier: nextTier,
        born: now,
        mergedAt: now,
        mergeTier: nextTier,
      });
      changed = true;
      break;
    }
  }
  return q;
}
function tierTrailColor(type, tier = 1) {
  if (tier >= 3) return '#ffd76a';
  if (tier >= 2) return '#c084fc';
  return WEAPONS[type]?.color || '#ffffff';
}
function tierEffectColor(type, tier = 1) {
  if (tier >= 3) return '#ffd76a';
  if (tier >= 2) return '#c084fc';
  return WEAPONS[type]?.color || '#ffffff';
}
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function lerp(a, b, t) { return a + (b - a) * t; }
function drawPixelPerson(ctx, x, y, color, team, flash = 0, frozen = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.imageSmoothingEnabled = false;
  if (flash > 0) ctx.fillStyle = '#fff'; else ctx.fillStyle = color;
  ctx.fillRect(-5, -10, 10, 8);
  ctx.fillRect(-7, -2, 14, 12);
  ctx.fillRect(-10, 1, 4, 8);
  ctx.fillRect(6, 1, 4, 8);
  ctx.fillRect(-6, 10, 4, 8);
  ctx.fillRect(2, 10, 4, 8);
  ctx.fillStyle = team === 'ally' ? '#dff4ff' : '#ffe1dc';
  ctx.fillRect(-3, -8, 2, 2); ctx.fillRect(2, -8, 2, 2);
  if (team === 'enemy') { ctx.fillStyle = '#331111'; ctx.fillRect(-8, -13, 5, 5); ctx.fillRect(3, -13, 5, 5); }
  if (frozen > 0) { ctx.strokeStyle = '#bdf6ff'; ctx.lineWidth = 3; ctx.strokeRect(-12, -15, 24, 34); }
  ctx.restore();
}

function App() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const stateRef = useRef(null);
  const [ui, setUi] = useState({ queue: [], selected: null, kills: 0, allyHp: 100, wave: 0, waveState: 'rest', rest: 5, enemiesLeft: 0, banner: '準備開始', drawing: false, timer: 0, gameOver: '' });
  const selectedRef = useRef(null);
  const queueRef = useRef([]);

  const addWeapon = (reason = '') => {
    // 武器列滿 7 格時暫停生成；不再自動擠掉最前面的武器。
    if (queueRef.current.length >= 7) return false;
    // 新武器進隊列的同一瞬間就合併相鄰同類武器，避免玩家看到兩格短暫停留後才合成。
    queueRef.current = normalizeWeaponQueue([...queueRef.current, { id: uid(), type: randomWeapon(), tier: 1, born: Date.now() }]);
    if (selectedRef.current && !queueRef.current.some(x => x.id === selectedRef.current.id)) selectedRef.current = null;
    setUi(v => ({ ...v, queue: queueRef.current, selected: selectedRef.current?.id ?? null }));
    if (reason && stateRef.current) stateRef.current.floatTexts.push({ id: uid(), text: reason, x: rand(80, stateRef.current.w - 80), y: stateRef.current.h * .77, vy: -34, life: 1, color: '#fff6a8', size: 18 });
    return true;
  };

  const selectBlock = (item) => {
    selectedRef.current = item;
    setUi(v => ({ ...v, selected: item?.id ?? null }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    stateRef.current = {
      w: 390, h: 780, battleH: 585, last: performance.now(), autoWeapon: 0,
      wave: 0, waveState: 'rest', restTime: 5, restDuration: 5, waveSpawnTimer: 0, waveSpawned: 0, waveTotal: 0, bannerLife: 1.5,
      berserkActive: false, berserkScheduled: false, berserkTriggered: false, berserkAt: 0, waveElapsed: 0,
      allies: [], enemies: [], weapons: [], particles: [], floatTexts: [], path: [], isDrawing: false, drawTime: 0,
      allyHp: 100, kills: 0, gameOver: '', pointerId: null, animTime: 0,
    };
    for (let i = 0; i < 4; i++) addWeapon();

    const resize = () => {
      const wrap = wrapRef.current;
      const rect = wrap.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * ratio);
      canvas.height = Math.floor(rect.height * ratio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const s = stateRef.current;
      s.w = rect.width; s.h = rect.height; s.battleH = rect.height * .82;
    };
    resize(); window.addEventListener('resize', resize);

    const monImg = new Image();
    monImg.src = monSheetUrl;
    const zomImg = new Image();
    zomImg.src = zomSheetUrl;
    const bossImg = new Image();
    bossImg.src = bossSheetUrl;
    const battleBgImg = new Image();
    battleBgImg.src = battleBgUrl;
    const weaponSheetImgs = {};
    for (const type of TYPES) {
      weaponSheetImgs[type] = new Image();
      weaponSheetImgs[type].src = WEAPONS[type].sheet;
    }

    function drawEnemySprite(ctx, s, e) {
      const frameCount = 4;
      const frame = Math.floor((s.animTime * (e.boss ? 6 : e.type === 'MON' ? 10 : 7) + e.animSeed) % frameCount);
      const img = e.boss ? bossImg : e.type === 'MON' ? monImg : zomImg;
      const srcSize = e.boss ? 96 : 64;
      const size = e.boss ? 96 : e.type === 'MON' ? 42 : 46;
      const bob = Math.sin((s.animTime * (e.type === 'MON' ? 12 : 8)) + e.animSeed) * (e.boss ? 1.2 : 2);
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = .30;
      ctx.fillStyle = e.boss ? '#321006' : e.type === 'MON' ? '#1c1130' : '#102116';
      ctx.beginPath();
      ctx.ellipse(e.x, e.y + size * .34, size * .32, size * .10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (e.boss) {
        ctx.shadowColor = '#ff6a1a';
        ctx.shadowBlur = 18;
      } else if (e.type === 'MON') {
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 6;
      }
      if (e.flash > 0) ctx.filter = 'brightness(2.5) saturate(.25)';
      if (img.complete && img.naturalWidth) {
        ctx.drawImage(img, frame * srcSize, 0, srcSize, srcSize, e.x - size / 2, e.y - size / 2 + bob, size, size);
      } else {
        drawPixelPerson(ctx, e.x, e.y, e.boss ? '#ff6a1a' : e.type === 'MON' ? '#b084ff' : '#75d36a', 'enemy', e.flash, e.frozen);
      }
      ctx.filter = 'none';
      ctx.shadowBlur = 0;
      if (e.frozen > 0) {
        ctx.strokeStyle = '#bdf6ff';
        ctx.lineWidth = e.boss ? 5 : 3;
        ctx.globalAlpha = .78;
        ctx.strokeRect(e.x - size * .38, e.y - size * .48, size * .76, size * .9);
        ctx.globalAlpha = 1;
      }
      if (!e.boss) {
        const hpRatio = Math.max(0, e.hp / e.maxHp);
        const barW = 34;
        const barH = 5;
        const barY = e.y - 30;
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(18, 10, 12, .82)';
        ctx.fillRect(e.x - barW / 2, barY, barW, barH);
        ctx.fillStyle = hpRatio > .5 ? '#80e35a' : hpRatio > .25 ? '#ffd45a' : '#ff5a55';
        ctx.fillRect(e.x - barW / 2, barY, barW * hpRatio, barH);
        ctx.strokeStyle = 'rgba(0,0,0,.72)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(e.x - barW / 2, barY, barW, barH);
      }
      ctx.restore();
    }

    const toPoint = e => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left), y: (e.clientY - r.top) };
    };
    const startDraw = e => {
      const s = stateRef.current, p = toPoint(e);
      if (!selectedRef.current || p.y > s.battleH || s.gameOver) return;
      e.preventDefault(); canvas.setPointerCapture(e.pointerId); s.pointerId = e.pointerId;
      s.path = [p]; s.isDrawing = true; s.drawTime = 1;
      setUi(v => ({ ...v, drawing: true, timer: 1 }));
    };
    const moveDraw = e => {
      const s = stateRef.current; if (!s.isDrawing || e.pointerId !== s.pointerId) return;
      const p = toPoint(e); if (p.y <= s.battleH && p.y >= 0) {
        const last = s.path[s.path.length - 1];
        if (!last || dist(last, p) > 5) {
          // 玩家畫線時只留下能量軌跡本身；不再噴粒子，讓期待感集中在手繪線的發光與蓄力感。
          s.path.push(p);
        }
      }
    };
    const endDraw = e => {
      const s = stateRef.current; if (!s.isDrawing || e.pointerId !== s.pointerId) return;
      launchWeapon(); s.isDrawing = false; s.drawTime = 0; s.pointerId = null;
      setUi(v => ({ ...v, drawing: false, timer: 0 }));
    };
    canvas.addEventListener('pointerdown', startDraw); canvas.addEventListener('pointermove', moveDraw); canvas.addEventListener('pointerup', endDraw); canvas.addEventListener('pointercancel', endDraw);

    function getTierInfo(item) {
      const tier = item?.tier || 1;
      return { tier, power: tier === 3 ? 2 : tier === 2 ? 1.5 : 1 };
    }
    function launchWeapon() {
      const s = stateRef.current, item = selectedRef.current; if (!item || s.path.length < 2) return;
      const base = WEAPONS[item.type]; const tierInfo = getTierInfo(item);
      const weaponPath = [...s.path];
      s.path = [];
      s.weapons.push({ id: uid(), type: item.type, path: weaponPath, seg: 0, t: 0, x: weaponPath[0].x, y: weaponPath[0].y, radius: base.radius * tierInfo.power, damage: base.damage * tierInfo.power, hitCd: {}, trail: [], combo: tierInfo.tier, trailColor: tierTrailColor(item.type, tierInfo.tier), damageColor: tierEffectColor(item.type, tierInfo.tier) });
      // 任何武器被消耗後，都立刻重新正規化隊列。
      // 這樣因為空格產生的新相鄰同武器會立即合併，不會等下一次生成才合成。
      queueRef.current = normalizeWeaponQueue(queueRef.current.filter(x => x.id !== item.id));
      selectedRef.current = null;
      if (tierInfo.tier >= 2) s.floatTexts.push({ id: uid(), text: tierInfo.tier === 3 ? base.triple : base.label, x: s.w / 2, y: s.battleH / 2, vy: -10, life: 1.2, color: tierInfo.tier === 3 ? '#ffd76a' : '#d38cff', size: tierInfo.tier === 3 ? 34 : 26 });
      setUi(v => ({ ...v, queue: queueRef.current, selected: null }));
    }

    function waveConfig(wave) {
      const boss = wave === 5 || wave === 10;
      return {
        total: boss ? 26 + wave * 3 : 28 + wave * 8,
        interval: Math.max(0.16, 0.42 - wave * 0.025),
        hp: 16 + wave * 4,
        speed: (s => (s.battleH - 86) / Math.max(7.5, 16 - wave * 0.45)),
        boss,
      };
    }
    function startWave(s) {
      s.wave++;
      const cfg = waveConfig(s.wave);
      s.waveState = 'wave';
      s.waveSpawnTimer = 0;
      s.waveSpawned = 0;
      s.waveTotal = cfg.total;
      s.waveElapsed = 0;
      s.berserkActive = false;
      s.berserkTriggered = false;
      s.berserkScheduled = Math.random() < 0.55;
      s.berserkAt = rand(3, Math.max(4, cfg.total * cfg.interval * 0.65));
      s.bannerLife = 1.6;
      s.floatTexts.push({ id: uid(), text: cfg.boss ? `第 ${s.wave} 波 BOSS 來襲！` : `第 ${s.wave} 波開始！`, x: s.w/2, y: 96, vy: -8, life: 1.4, color: cfg.boss ? '#ffdf6e' : '#ffffff', size: cfg.boss ? 32 : 26 });
      setUi(v => ({ ...v, wave: s.wave, waveState: s.waveState, rest: 0, enemiesLeft: s.waveTotal - s.waveSpawned + s.enemies.length, banner: cfg.boss ? `第 ${s.wave} 波 BOSS 來襲！` : `第 ${s.wave} 波開始！` }));
    }
    function enterRest(s) {
      if (s.wave >= 10) {
        s.gameOver = '十波清完，遊戲勝利！';
        return;
      }
      s.waveState = 'rest';
      s.berserkActive = false;
      s.berserkScheduled = false;
      s.restTime = s.restDuration;
      s.waveSpawnTimer = 0;
      s.bannerLife = 1.4;
      s.floatTexts.push({ id: uid(), text: `休息 ${s.restDuration} 秒`, x: s.w/2, y: 100, vy: -8, life: 1.2, color: '#d9ecff', size: 26 });
      setUi(v => ({ ...v, waveState: 'rest', rest: Math.ceil(s.restTime), enemiesLeft: 0, banner: `休息 ${s.restDuration} 秒` }));
    }
    function spawnEnemy(s) {
      const cfg = waveConfig(s.wave);
      const isBoss = cfg.boss && s.waveSpawned === cfg.total - 1;
      const hp = isBoss ? 280 + s.wave * 35 : cfg.hp;
      const enemyType = isBoss ? 'BOSS' : (Math.random() < 0.45 ? 'MON' : 'ZOM');
      const speedMul = enemyType === 'MON' ? 1.45 : 1;
      s.enemies.push({
        id: uid(), type: enemyType, x: rand(s.w*.12, s.w*.88), y: isBoss ? 30 : 42,
        hp, maxHp: hp, atk: isBoss ? 25 : 5 + s.wave, cd: 0,
        speed: isBoss ? (s.battleH-86)/34 : cfg.speed(s) * speedMul, flash:0, frozen:0, animSeed: Math.random() * 4,
        boss: isBoss, radius: isBoss ? 30 : enemyType === 'MON' ? 11 : 13,
      });
      s.waveSpawned++;
    }
    function damageEnemy(s, e, dmg, color) {
      e.hp -= dmg; e.flash = .08;
      const isTierColor = color === '#c084fc' || color === '#ffd76a';
      s.floatTexts.push({
        id: uid(), text: Math.round(dmg).toString(), x: e.x + rand(-8,8), y: e.y - (e.boss ? 34 : 18),
        vy: isTierColor ? -58 : -45, life: isTierColor ? .82 : .65, color,
        size: (e.boss ? 20 : 16) + (color === '#ffd76a' ? 6 : color === '#c084fc' ? 3 : 0),
        glow: isTierColor
      });
      const count = (e.boss ? 12 : 7) + (color === '#ffd76a' ? 8 : color === '#c084fc' ? 4 : 0);
      for (let i=0;i<count;i++) s.particles.push({
        id: uid(), x:e.x, y:e.y, vx:rand(-90,90), vy:rand(-90,90),
        life: color === '#ffd76a' ? .5 : color === '#c084fc' ? .42 : .35, color,
        size: color === '#ffd76a' ? rand(3,7) : color === '#c084fc' ? rand(2,6) : 4, glow: isTierColor
      });
    }
    function killEnemy(s, e) {
      s.kills++;
      const n = e.boss ? 36 : 14;
      for (let i=0;i<n;i++) s.particles.push({ id: uid(), x:e.x, y:e.y, vx:rand(-160,160), vy:rand(-160,160), life:.65, color:e.boss ? '#ffdf6e' : '#ffcc99' });
      if (e.boss) s.floatTexts.push({ id: uid(), text: 'BOSS 擊破！', x: e.x, y: e.y - 40, vy: -22, life: 1.2, color:'#ffdf6e', size:28 });
    }

    function update(dt) {
      const s = stateRef.current; if (s.gameOver) return;
      s.animTime += dt;
      if (s.isDrawing) {
        s.drawTime -= dt;
        setUi(v => ({ ...v, timer: Math.max(0, s.drawTime) }));
        if (s.drawTime <= 0) {
          launchWeapon();
          s.isDrawing = false;
          setUi(v => ({ ...v, drawing:false, timer:0 }));
        }
        return;
      }
      s.autoWeapon += dt;
      if (s.autoWeapon >= 3) {
        // 滿格時不生成也不重置計時；一有空位就會立刻補進新武器。
        if (addWeapon()) s.autoWeapon = 0;
      }

      if (s.waveState === 'rest') {
        s.restTime -= dt;
        if (s.restTime <= 3 && s.restTime + dt > 3) s.floatTexts.push({ id: uid(), text: `下一波倒數 3`, x: s.w/2, y: 120, vy: -8, life: .9, color:'#fff6a8', size:28 });
        if (s.restTime <= 2 && s.restTime + dt > 2) s.floatTexts.push({ id: uid(), text: `2`, x: s.w/2, y: 120, vy: -8, life: .9, color:'#fff6a8', size:32 });
        if (s.restTime <= 1 && s.restTime + dt > 1) s.floatTexts.push({ id: uid(), text: `1`, x: s.w/2, y: 120, vy: -8, life: .9, color:'#fff6a8', size:32 });
        if (s.restTime <= 0) startWave(s);
      } else if (s.waveState === 'wave') {
        const cfg = waveConfig(s.wave);
        s.waveElapsed += dt;
        if (s.berserkScheduled && !s.berserkTriggered && s.waveElapsed >= s.berserkAt) {
          s.berserkTriggered = true;
          s.berserkActive = true;
          s.floatTexts.push({ id: uid(), text: '怪物狂暴！速度 +30%', x: s.w/2, y: 122, vy: -10, life: 1.4, color:'#ff6644', size:30 });
        }
        s.waveSpawnTimer += dt;
        while (s.waveSpawned < s.waveTotal && s.waveSpawnTimer >= cfg.interval) {
          spawnEnemy(s);
          s.waveSpawnTimer -= cfg.interval;
        }
        if (s.waveSpawned >= s.waveTotal && s.enemies.length === 0) enterRest(s);
      }

      for (const e of s.enemies) {
        e.flash=Math.max(0,e.flash-dt); e.cd-=dt; e.frozen=Math.max(0,e.frozen-dt);
        if(e.frozen<=0) e.y += e.speed * (s.berserkActive ? 1.3 : 1) * dt;
        if(e.y>s.battleH-28){s.allyHp-= e.boss ? 20 : 1; e.hp=0;}
      }
      s.enemies = s.enemies.filter(e=>{ if(e.hp<=0){ if(e.y<=s.battleH-28) killEnemy(s,e); return false;} return true; });
      for (const w of s.weapons) {
        const base=WEAPONS[w.type]; const next=w.path[w.seg+1]; const cur=w.path[w.seg];
        if(!next){ w.done=true; continue; }
        const len=Math.max(1, dist(cur,next)); w.t += base.speed*dt/len;
        while(w.t>=1 && w.seg < w.path.length-2){ w.t-=1; w.seg++; }
        if (w.seg >= w.path.length - 2 && w.t >= 1) { w.t = 1; w.done = true; }
        const p0=w.path[w.seg], p1=w.path[w.seg+1] || p0; w.x=lerp(p0.x,p1.x,clamp(w.t,0,1)); w.y=lerp(p0.y,p1.y,clamp(w.t,0,1));
        w.trail.push({x:w.x,y:w.y,life:.35}); w.trail.forEach(t=>t.life-=dt); w.trail=w.trail.filter(t=>t.life>0).slice(-18);
        for (const key of Object.keys(w.hitCd)) w.hitCd[key] = Math.max(0, w.hitCd[key] - dt);
        for(const e of s.enemies){
          const hitKey = String(e.id);
          if((w.hitCd[hitKey] || 0) <= 0 && Math.hypot(e.x-w.x,e.y-w.y)<=w.radius + (e.boss ? 10 : 0)){
            w.hitCd[hitKey] = 0.12;
            damageEnemy(s,e,w.damage,w.damageColor || base.color);
            if(base.freeze) e.frozen=Math.max(e.frozen,base.freeze);
          }
        }
      }
      s.weapons = s.weapons.filter(w=>!w.done);
      s.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;}); s.particles=s.particles.filter(p=>p.life>0);
      s.floatTexts.forEach(f=>{f.y+=f.vy*dt;f.life-=dt;}); s.floatTexts=s.floatTexts.filter(f=>f.life>0);
      if(s.allyHp<=0) s.gameOver='我方基地陷落';
      setUi(v => ({ ...v, kills:s.kills, allyHp:Math.max(0,Math.ceil(s.allyHp)), wave:s.wave, waveState:s.waveState, rest:Math.max(0,Math.ceil(s.restTime)), enemiesLeft:Math.max(0, s.waveTotal - s.waveSpawned + s.enemies.length), gameOver:s.gameOver }));
    }

    function render() {
      const s=stateRef.current; ctx.clearRect(0,0,s.w,s.h);
      if (battleBgImg.complete && battleBgImg.naturalWidth) {
        // 新草地背景滿版 cover：不留黑邊，畫面完整鋪滿戰場。
        ctx.imageSmoothingEnabled = false;
        const iw = battleBgImg.naturalWidth, ih = battleBgImg.naturalHeight;
        const scale = Math.max(s.w / iw, s.battleH / ih);
        const sw = s.w / scale, sh = s.battleH / scale;
        const sx = (iw - sw) / 2, sy = (ih - sh) / 2;
        ctx.drawImage(battleBgImg, sx, sy, sw, sh, 0, 0, s.w, s.battleH);
        ctx.fillStyle='rgba(12,24,12,.08)'; ctx.fillRect(0,0,s.w,s.battleH);
      } else {
        const g=ctx.createLinearGradient(0,0,0,s.battleH); g.addColorStop(0,'#2f6e35'); g.addColorStop(.52,'#4f9142'); g.addColorStop(1,'#6caf55'); ctx.fillStyle=g; ctx.fillRect(0,0,s.w,s.battleH);
      }
      const rg=ctx.createRadialGradient(s.w/2,s.battleH*.45,20,s.w/2,s.battleH*.45,s.battleH*.72); rg.addColorStop(0,'rgba(255,255,255,.08)'); rg.addColorStop(1,'rgba(0,0,0,.25)'); ctx.fillStyle=rg; ctx.fillRect(0,0,s.w,s.battleH);
      ctx.fillStyle='rgba(255,255,255,.10)'; ctx.fillRect(s.w*.06,42,s.w*.010,s.battleH-92); ctx.fillRect(s.w*.93,42,s.w*.010,s.battleH-92);
      ctx.fillStyle=s.berserkActive ? 'rgba(150,35,25,.62)' : 'rgba(80,30,30,.40)'; ctx.fillRect(0,0,s.w,42); ctx.fillStyle='#ffd6d6'; ctx.font='bold 15px system-ui'; ctx.textAlign='center'; ctx.fillText(s.waveState === 'rest' ? `休息中：${Math.max(0,Math.ceil(s.restTime))} 秒` : `第 ${s.wave} 波  剩餘 ${Math.max(0, s.waveTotal - s.waveSpawned + s.enemies.length)}${s.berserkActive ? '  狂暴中' : ''}`,s.w/2,28);
      const boss = s.enemies.find(e => e.boss && e.hp > 0);
      if (boss) {
        const ratio = clamp(boss.hp / boss.maxHp, 0, 1);
        const barY = 42;
        const barH = 28;
        ctx.save();
        ctx.fillStyle = 'rgba(22, 8, 12, .92)';
        ctx.fillRect(0, barY, s.w, barH);
        const bossG = ctx.createLinearGradient(0, barY, s.w, barY);
        bossG.addColorStop(0, '#ff3b3b');
        bossG.addColorStop(.55, '#ff9f43');
        bossG.addColorStop(1, '#ffe066');
        ctx.fillStyle = bossG;
        ctx.shadowColor = '#ff6644';
        ctx.shadowBlur = 14;
        ctx.fillRect(0, barY, s.w * ratio, barH);
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,.18)';
        ctx.fillRect(0, barY, s.w * ratio, 5);
        ctx.strokeStyle = 'rgba(255,255,255,.55)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, barY, s.w, barH);
        ctx.fillStyle = '#fff7d1';
        ctx.font = '900 15px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'rgba(0,0,0,.75)';
        ctx.lineWidth = 4;
        const label = `BOSS HP  ${Math.ceil(boss.hp)} / ${boss.maxHp}`;
        ctx.strokeText(label, s.w / 2, barY + barH / 2 + 1);
        ctx.fillText(label, s.w / 2, barY + barH / 2 + 1);
        ctx.restore();
      }
      const baseG=ctx.createLinearGradient(0,s.battleH-52,0,s.battleH); baseG.addColorStop(0,'#2d70c9'); baseG.addColorStop(1,'#17458f'); ctx.fillStyle=baseG; ctx.fillRect(0,s.battleH-46,s.w,40); ctx.fillStyle='rgba(255,255,255,.16)'; ctx.fillRect(0,s.battleH-46,s.w,5); ctx.fillStyle='#dff4ff'; ctx.fillText(`我方基地 HP ${Math.max(0,Math.ceil(s.allyHp))}`,s.w/2,s.battleH-20);
      ctx.fillStyle='rgba(255,255,255,.15)'; ctx.fillRect(0,s.battleH/2-1,s.w,2);
      s.enemies.forEach(e=>drawEnemySprite(ctx, s, e));
      for(const w of s.weapons){
        const base=WEAPONS[w.type];
        ctx.save();
        // 武器發動後不再額外墊彩色圓圈或彩色殘影，避免蓋住 sprite 本身。
        ctx.globalAlpha = 1;
        const sheet = weaponSheetImgs[w.type];
        const frame = Math.floor(s.animTime * 12) % 3;
        const size = Math.max(86, Math.min(180, w.radius * 2.25 * (base.effectScale || 1)));
        ctx.shadowColor=base.color;
        ctx.shadowBlur=10;
        ctx.imageSmoothingEnabled = false;
        if (sheet && sheet.complete && sheet.naturalWidth) {
          const fw = sheet.naturalWidth / 3;
          const fh = sheet.naturalHeight;
          const drawW = size;
          const drawH = size * (fh / fw);
          if (base.rotate360) {
            // 劍類武器：沿軌跡移動時額外做 360 度高速旋轉，保留原本 3-frame 斬擊動畫。
            ctx.translate(w.x, w.y);
            ctx.rotate((s.animTime * Math.PI * 2 * 2.2) + (w.seg * 0.35));
            ctx.drawImage(sheet, frame * fw, 0, fw, fh, -drawW/2, -drawH/2, drawW, drawH);
          } else {
            ctx.drawImage(sheet, frame * fw, 0, fw, fh, w.x - drawW/2, w.y - drawH/2, drawW, drawH);
          }
        } else {
          ctx.font='30px serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('✦',w.x,w.y);
        }
        ctx.restore();
      }
      if(s.path.length>1){
        const tier = selectedRef.current?.tier || 1;
        const drawColor = tier >= 3 ? '#ffd76a' : tier >= 2 ? '#c084fc' : '#ffffff';
        const pulse = 0.65 + Math.sin(s.animTime * (tier >= 3 ? 14 : 10)) * 0.35;
        ctx.lineCap='round'; ctx.lineJoin='round';

        const drawPath = () => {
          ctx.beginPath();
          s.path.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
          ctx.stroke();
        };

        if (tier === 1) {
          // 一階：乾淨白線，讓普通武器有基準手感。
          ctx.save();
          ctx.strokeStyle='#ffffff'; ctx.shadowColor='#ffffff'; ctx.shadowBlur=4; ctx.lineWidth=4;
          ctx.globalAlpha=.95; drawPath();
          ctx.restore();
        } else if (tier === 2) {
          // 二階：紫色能量線 + 閃爍紫光。玩家畫的當下就能感覺這波比較強。
          ctx.save();
          ctx.strokeStyle='#7c3aed'; ctx.shadowColor='#c084fc';
          ctx.globalAlpha=.22 + pulse * .10; ctx.lineWidth=18; ctx.shadowBlur=26; drawPath();
          ctx.globalAlpha=.48 + pulse * .18; ctx.lineWidth=10; ctx.shadowBlur=20; drawPath();
          ctx.globalAlpha=1; ctx.strokeStyle='#f4e8ff'; ctx.lineWidth=4; ctx.shadowBlur=14; drawPath();
          ctx.restore();
        } else {
          // 三階：金色主線 + 強外光 + 金色氣息繚繞，強調「蓄力等待爆發」。
          ctx.save();
          ctx.strokeStyle='#8a5a00'; ctx.shadowColor='#ffd76a';
          ctx.globalAlpha=.24 + pulse * .12; ctx.lineWidth=24; ctx.shadowBlur=42; drawPath();
          ctx.globalAlpha=.55 + pulse * .18; ctx.strokeStyle='#ffbf2f'; ctx.lineWidth=14; ctx.shadowBlur=34; drawPath();
          ctx.globalAlpha=1; ctx.strokeStyle='#fff4b8'; ctx.lineWidth=5; ctx.shadowBlur=22; drawPath();

          // 金色氣息：沿著軌跡附近緩慢繞動的小弧線，不是爆炸粒子。
          const auraCount = Math.min(28, Math.max(8, Math.floor(s.path.length / 2)));
          for (let i=0; i<auraCount; i++) {
            const idx = (i * 3 + Math.floor(s.animTime * 9)) % s.path.length;
            const p = s.path[idx];
            const angle = s.animTime * 4 + i * 1.37;
            const r = 8 + Math.sin(s.animTime * 3 + i) * 4;
            const x = p.x + Math.cos(angle) * r;
            const y = p.y + Math.sin(angle) * r;
            ctx.globalAlpha = .28 + pulse * .18;
            ctx.strokeStyle = i % 2 ? '#ffd76a' : '#fff0a3';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#ffd76a';
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.arc(x, y, 4 + (i % 3), angle, angle + Math.PI * .78);
            ctx.stroke();
          }
          ctx.restore();
        }
      }
      s.particles.forEach(p=>{ctx.save();ctx.globalAlpha=clamp(p.life*2,0,1);ctx.fillStyle=p.color;if(p.glow){ctx.shadowColor=p.color;ctx.shadowBlur=12;}const ps=p.size||4;ctx.fillRect(p.x-ps/2,p.y-ps/2,ps,ps);ctx.restore();});
      s.floatTexts.forEach(f=>{ctx.save();ctx.globalAlpha=clamp(f.life,0,1);ctx.fillStyle=f.color;ctx.strokeStyle='rgba(0,0,0,.7)';ctx.lineWidth=f.glow?6:4;if(f.glow){ctx.shadowColor=f.color;ctx.shadowBlur=18;}ctx.font=`900 ${f.size}px system-ui`;ctx.textAlign='center';ctx.strokeText(f.text,f.x,f.y);ctx.fillText(f.text,f.x,f.y);ctx.restore();});
      ctx.fillStyle='rgba(18,23,33,.95)'; ctx.fillRect(0,s.battleH,s.w,s.h-s.battleH);
    }
    function loop(now){ const s=stateRef.current; const dt=Math.min(.033,(now-s.last)/1000); s.last=now; update(dt); render(); requestAnimationFrame(loop); }
    const raf=requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); canvas.removeEventListener('pointerdown', startDraw); canvas.removeEventListener('pointermove', moveDraw); canvas.removeEventListener('pointerup', endDraw); canvas.removeEventListener('pointercancel', endDraw); };
  }, []);

  return <div className="page"><div className="phone" ref={wrapRef}>
    <canvas ref={canvasRef} />
    <div className="hud"><div className="title">武器軌跡割草</div><div className="wave">第 {ui.wave || 1}/10 波</div><div className="kills">擊殺：{ui.kills}</div></div>
    {ui.drawing && <div className="timer">畫軌跡：{ui.timer.toFixed(1)}s</div>}
    {ui.gameOver && <div className="gameOver"><b>{ui.gameOver}</b><button onClick={()=>location.reload()}>重新開始</button></div>}
    <div className="queue">
      <div className="blocks">{ui.queue.map((item) => {
        const w=WEAPONS[item.type]; const tier=item.tier || 1;
        return <button key={item.id} onClick={()=>selectBlock(item)} className={`block ${ui.selected===item.id?'selected':''} tier${tier} ${item.mergedAt ? 'merged' : ''} mergeTier${item.mergeTier || tier}`} style={{'--c':w.color}}><span><img className="weaponIcon" src={w.icon} alt={w.name} /></span>{tier>=2 && <em>{tier}階</em>}</button>
      })}</div>
    </div>
  </div></div>;
}

createRoot(document.getElementById('root')).render(<App />);
