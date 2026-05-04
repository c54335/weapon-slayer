import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import monSheetUrl from './assets/mon.png';
import zomSheetUrl from './assets/zom.png';
import bossSheetUrl from './assets/boss.png';
import finalBossSheetUrl from './assets/v-boss.png';
import finalBossSummonSheetUrl from './assets/v-boss-summon.png';
import finalBossHurtSheetUrl from './assets/v-boss-hurt.png';
import vBatSheetUrl from './assets/v-bat.png';
import dBossFireSheetUrl from './assets/d-boss-fire.png';
import battleBgUrl from './assets/background.png';
import swordIconUrl from './assets/sword-icon.png';
import bombIconUrl from './assets/bomb-icon.png';
import lightningIconUrl from './assets/lightning-icon.png';
import iceIconUrl from './assets/ice-icon.png';
import shieldIconUrl from './assets/shield-icon.svg';
import bowIconUrl from './assets/bow-icon.svg';
import swordSheetUrl from './assets/sword-sheet.png';
import bombSheetUrl from './assets/bomb-sheet.png';
import lightningSheetUrl from './assets/lightning-sheet.png';
import iceSheetUrl from './assets/ice-sheet.png';
import swordHitSheetUrl from './assets/sword-hit-sheet.png';
import iceHitSheetUrl from './assets/ice-hit-sheet.png';
import lightningHitSheetUrl from './assets/lightning-hit-sheet.png';
import bombHitSheetUrl from './assets/bomb-hit-sheet.png';

const WEAPON_ASSETS = {
  sword: { icon: swordIconUrl, sheet: swordSheetUrl, hitSheet: swordHitSheetUrl },
  bomb: { icon: bombIconUrl, sheet: bombSheetUrl, hitSheet: bombHitSheetUrl },
  lightning: { icon: lightningIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl },
  ice: { icon: iceIconUrl, sheet: iceSheetUrl, hitSheet: iceHitSheetUrl },
  shield: { icon: shieldIconUrl, sheet: swordSheetUrl, hitSheet: swordHitSheetUrl },
  bow: { icon: bowIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl },
};

const WEAPONS = {
  sword: { name: '劍', icon: swordIconUrl, sheet: swordSheetUrl, hitSheet: swordHitSheetUrl, color: '#f0c040', radius: 40, speed: 720, formula: '4 × STR', label: '二階劍！', triple: '三階劍！', frames: 8, fps: 18, hitFrames: 6, hitSize: 34 },
  bomb: { name: '火焰法杖', icon: bombIconUrl, sheet: bombSheetUrl, hitSheet: bombHitSheetUrl, color: '#ff6644', radius: 75, speed: 330, formula: '5 × INT', label: '二階火焰！', triple: '三階烈焰！', frames: 8, fps: 20, rotateToPath: true, hitFrames: 6, hitSize: 34 },
  ice: { name: '冰霜法杖', icon: iceIconUrl, sheet: iceSheetUrl, hitSheet: iceHitSheetUrl, color: '#88ddff', radius: 30, speed: 500, formula: '4 × INT + 1 × DEX', freeze: 3, label: '二階冰霜！', triple: '三階冰霜！', frames: 8, fps: 20, rotateToPath: true, hitFrames: 6, hitSize: 34 },
  lightning: { name: '雷電法杖', icon: lightningIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl, color: '#ccaaff', radius: 55, speed: 920, formula: '3 × INT', label: '二階雷電！', triple: '三階雷鏈！', frames: 8, fps: 22, rotateToPath: true, hitFrames: 6, hitSize: 34 },
  shield: { name: '盾', icon: shieldIconUrl, sheet: swordSheetUrl, hitSheet: swordHitSheetUrl, color: '#9ca3af', radius: 40, speed: 300, formula: '5 × VIT', knockback: 42, label: '二階盾擊！', triple: '三階盾擊！', frames: 8, fps: 14, hitFrames: 6, hitSize: 34 },
  bow: { name: '弓箭', icon: bowIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl, color: '#84cc16', radius: 50, speed: 0, formula: '5 × DEX', aim: true, label: '二階箭雨！', triple: '三階箭雨！', frames: 8, fps: 18, hitFrames: 6, hitSize: 34 },
};
const TYPES = Object.keys(WEAPONS);
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const uid = (() => { let n = 1; return () => n++; })();

function randomWeapon(pool = TYPES) {
  const usable = (pool && pool.length ? pool : TYPES).filter(Boolean);
  return usable[Math.floor(Math.random() * usable.length)] || 'sword';
}
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
function weaponBaseDamage(type, stats = {}) {
  const STR = stats.STR || 0, DEX = stats.DEX || 0, INT = stats.INT || 0, VIT = stats.VIT || 0;
  if (type === 'sword') return 4 * STR;
  if (type === 'bomb') return 5 * INT;
  if (type === 'ice') return 4 * INT + DEX;
  if (type === 'lightning') return 3 * INT;
  if (type === 'shield') return 5 * VIT;
  if (type === 'bow') return 5 * DEX;
  return 1;
}
function weaponDamageText(type, stats = {}, tier = 1) {
  const mul = tier === 3 ? 2 : tier === 2 ? 1.5 : 1;
  return `${Math.round(weaponBaseDamage(type, stats) * mul)}（${WEAPONS[type]?.formula || ''}${tier > 1 ? ` × ${mul}` : ''}）`;
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
  const WARRIOR = { name: '戰士', stats: { STR: 5, DEX: 3, INT: 1, VIT: 3 }, bagCapacity: 3, initialBag: ['sword', 'shield', 'bow'] };
  const [ui, setUi] = useState({ queue: [], selected: null, kills: 0, allyHp: 100, wave: 0, waveState: 'rest', rest: 5, enemiesLeft: 0, banner: '準備開始', drawing: false, timer: 0, gameOver: '', level: 1, exp: 0, expNeed: 80, upgrading: false, upgradeOptions: [], classChosen: false, playerClass: null, stats: WARRIOR.stats, bag: [], bagCapacity: WARRIOR.bagCapacity, showBag: false, selectedBagIndex: 0 });
  const selectedRef = useRef(null);
  const queueRef = useRef([]);
  const bagRef = useRef([]);

  const addWeapon = (reason = '') => {
    // 武器列滿 7 格時暫停生成；不再自動擠掉最前面的武器。
    if (queueRef.current.length >= 7) return false;
    // 新武器進隊列的同一瞬間就合併相鄰同類武器，避免玩家看到兩格短暫停留後才合成。
    queueRef.current = normalizeWeaponQueue([...queueRef.current, { id: uid(), type: randomWeapon(bagRef.current), tier: 1, born: Date.now() }]);
    if (selectedRef.current && !queueRef.current.some(x => x.id === selectedRef.current.id)) selectedRef.current = null;
    setUi(v => ({ ...v, queue: queueRef.current, selected: selectedRef.current?.id ?? null }));
    if (reason && stateRef.current) stateRef.current.floatTexts.push({ id: uid(), text: reason, x: rand(80, stateRef.current.w - 80), y: stateRef.current.h * .77, vy: -34, life: 1, color: '#fff6a8', size: 18 });
    return true;
  };

  const selectBlock = (item) => {
    selectedRef.current = item;
    setUi(v => ({ ...v, selected: item?.id ?? null }));
  };

  const startWarrior = () => {
    const s = stateRef.current;
    bagRef.current = [...WARRIOR.initialBag];
    queueRef.current = normalizeWeaponQueue([
      { id: uid(), type: 'sword', tier: 1, born: Date.now() },
      { id: uid(), type: 'sword', tier: 1, born: Date.now() },
    ]);
    selectedRef.current = null;
    if (s) {
      s.classChosen = true;
      s.playerClass = WARRIOR.name;
      s.stats = { ...WARRIOR.stats };
      s.bag = [...bagRef.current];
      s.bagCapacity = WARRIOR.bagCapacity;
      s.floatTexts.push({ id: uid(), text: '戰士出擊！', x: s.w / 2, y: 120, vy: -10, life: 1, color: '#fff3a3', size: 30, glow: true });
    }
    setUi(v => ({
      ...v, classChosen: true, playerClass: WARRIOR.name, stats: { ...WARRIOR.stats },
      bag: [...bagRef.current], bagCapacity: WARRIOR.bagCapacity, queue: queueRef.current, selected: null
    }));
  };

  const toggleBag = () => {
    const s = stateRef.current;
    if (s) s.showBag = !s.showBag;
    setUi(v => ({ ...v, showBag: s ? s.showBag : !v.showBag, bag: [...bagRef.current] }));
  };
  const selectBagWeapon = (idx) => {
    setUi(v => ({ ...v, selectedBagIndex: idx }));
  };

  const STAT_KEYS = ['STR', 'DEX', 'VIT', 'INT'];
  const STAT_LABEL = { STR: '力量 STR', DEX: '敏捷 DEX', VIT: '體魄 VIT', INT: '智力 INT' };
  const WARRIOR_STAT_WEIGHTS = [
    ['STR', 0.40], ['DEX', 0.30], ['VIT', 0.20], ['INT', 0.10],
  ];

  const rollWeightedStat = () => {
    const r = Math.random();
    let acc = 0;
    for (const [key, weight] of WARRIOR_STAT_WEIGHTS) {
      acc += weight;
      if (r <= acc) return key;
    }
    return 'INT';
  };

  const makeStatOption = () => {
    const boost = { STR: 0, DEX: 0, INT: 0, VIT: 0 };
    for (let i = 0; i < 5; i++) boost[rollWeightedStat()] += 1;
    const signature = STAT_KEYS.map(k => `${k}${boost[k]}`).join('-');
    return { id: uid(), boost, signature };
  };

  const drawUpgradeOptions = () => {
    const result = [];
    const seen = new Set();
    let guard = 0;
    while (result.length < 3 && guard++ < 80) {
      const opt = makeStatOption();
      if (seen.has(opt.signature)) continue;
      seen.add(opt.signature);
      result.push(opt);
    }
    while (result.length < 3) result.push(makeStatOption());
    return result;
  };


  const statUpgradeRank = (value = 0) => {
    if (value >= 5) return { cls: 'gold', arrows: 3 };
    if (value >= 3) return { cls: 'purple', arrows: 2 };
    return { cls: 'blue', arrows: 1 };
  };

  const topUpgradeStats = (boost = {}) => {
    return STAT_KEYS
      .map(key => ({ key, value: boost[key] || 0 }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value || STAT_KEYS.indexOf(a.key) - STAT_KEYS.indexOf(b.key))
      .slice(0, 2);
  };

  const renderUpgradeSummary = (boost = {}) => {
    const top = topUpgradeStats(boost);
    return top.map(({ key, value }) => {
      const rank = statUpgradeRank(value);
      return <div key={key} className={`upgradeMajor ${rank.cls}`}>
        <span className="upgradeStatName">{key}</span>
        <span className={`upgradeArrows arrows${rank.arrows}`}>{Array.from({ length: rank.arrows }).map((_, i) => <i key={i}>^</i>)}</span>
      </div>;
    });
  };

  const continueAfterUpgrade = (option = null) => {
    const s = stateRef.current;
    if (s && option?.boost) {
      for (const key of STAT_KEYS) s.stats[key] = (s.stats[key] || 0) + (option.boost[key] || 0);
      s.floatTexts.push({ id: uid(), text: '素質提升！', x: s.w / 2, y: s.battleH * .45, vy: -10, life: 1.1, color: '#fff3a3', size: 28, glow: true });
    }
    if (s) {
      s.upgrading = false;
      s.upgradeOptions = [];
      setUi(v => ({ ...v, upgrading: false, upgradeOptions: [], level: s.level, exp: s.exp, expNeed: s.level * 80, stats: { ...s.stats } }));
    }
  };


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    stateRef.current = {
      w: 390, h: 780, battleH: 585, last: performance.now(), autoWeapon: 0,
      wave: 0, waveState: 'rest', restTime: 5, restDuration: 5, waveSpawnTimer: 0, waveSpawned: 0, waveTotal: 0, bannerLife: 1.5,
      berserkActive: false, berserkScheduled: false, berserkTriggered: false, berserkAt: 0, waveElapsed: 0,
      allies: [], enemies: [], weapons: [], hitEffects: [], particles: [], floatTexts: [], path: [], isDrawing: false, drawTime: 0,
      allyHp: 100, kills: 0, level: 1, exp: 0, upgrading: false, upgradeOptions: [], gameOver: '', pointerId: null, animTime: 0,
      classChosen: false, playerClass: null, stats: { ...WARRIOR.stats }, bag: [], bagCapacity: WARRIOR.bagCapacity, showBag: false,
    };
    // 等玩家選職業後，才預載初始武器序列。

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
    const finalBossImg = new Image();
    finalBossImg.src = finalBossSheetUrl;
    const finalBossSummonImg = new Image();
    finalBossSummonImg.src = finalBossSummonSheetUrl;
    const finalBossHurtImg = new Image();
    finalBossHurtImg.src = finalBossHurtSheetUrl;
    const vBatImg = new Image();
    vBatImg.src = vBatSheetUrl;
    const dBossFireImg = new Image();
    dBossFireImg.src = dBossFireSheetUrl;
    const battleBgImg = new Image();
    battleBgImg.src = battleBgUrl;
    const weaponSheetImgs = {};
    const weaponHitSheetImgs = {};
    for (const type of TYPES) {
      weaponSheetImgs[type] = new Image();
      weaponSheetImgs[type].src = WEAPONS[type].sheet;
      if (WEAPONS[type].hitSheet) {
        weaponHitSheetImgs[type] = new Image();
        weaponHitSheetImgs[type].src = WEAPONS[type].hitSheet;
      }
    }

    function drawEnemySprite(ctx, s, e) {
      let img = null;
      let frameCount = 4;
      let srcW = 64;
      let srcH = 64;
      let size = 46;
      let fps = 7;

      if (e.type === 'BAT') {
        img = vBatImg; frameCount = 4; srcW = 32; srcH = 32; size = 30; fps = 12;
      } else if (e.type === 'FIREBALL') {
        img = dBossFireImg; frameCount = 6; srcW = 32; srcH = 32; size = 34; fps = 14;
      } else if (e.finalBoss) {
        if (e.skillState === 'summoning') {
          img = finalBossSummonImg; frameCount = 4; srcW = 96; srcH = 96; fps = 8;
        } else if (e.hurtAnim > 0) {
          img = finalBossHurtImg; frameCount = 2; srcW = 96; srcH = 96; fps = 12;
        } else {
          img = finalBossImg; frameCount = 4; srcW = 96; srcH = 96; fps = 6;
        }
        size = 96;
      } else if (e.boss) {
        img = bossImg; frameCount = 4; srcW = 96; srcH = 96; size = 96; fps = 6;
      } else if (e.type === 'MON') {
        img = monImg; frameCount = 4; srcW = 64; srcH = 64; size = 42; fps = 10;
      } else {
        img = zomImg; frameCount = 4; srcW = 64; srcH = 64; size = 46; fps = 7;
      }

      const frame = Math.floor((s.animTime * fps + e.animSeed) % frameCount);
      const bob = Math.sin((s.animTime * (e.type === 'MON' || e.type === 'BAT' ? 12 : 8)) + e.animSeed) * (e.boss ? 1.2 : 2);
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = .30;
      ctx.fillStyle = e.boss ? '#321006' : e.type === 'BAT' ? '#190825' : e.type === 'FIREBALL' ? '#341106' : e.type === 'MON' ? '#1c1130' : '#102116';
      ctx.beginPath();
      ctx.ellipse(e.x, e.y + size * .34, size * .32, size * .10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (e.boss) { ctx.shadowColor = e.finalBoss ? '#d56bff' : '#ff6a1a'; ctx.shadowBlur = 18; }
      else if (e.type === 'BAT') { ctx.shadowColor = '#d56bff'; ctx.shadowBlur = 8; }
      else if (e.type === 'FIREBALL') { ctx.shadowColor = '#ff9a2e'; ctx.shadowBlur = 10; }
      else if (e.type === 'MON') { ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 6; }

      if (e.flash > 0) ctx.filter = 'brightness(2.5) saturate(.25)';
      if (img && img.complete && img.naturalWidth) {
        ctx.drawImage(img, frame * srcW, 0, srcW, srcH, e.x - size / 2, e.y - size / 2 + bob, size, size);
      } else {
        drawPixelPerson(ctx, e.x, e.y, e.boss ? '#ff6a1a' : e.type === 'BAT' ? '#c084fc' : e.type === 'FIREBALL' ? '#ff9a2e' : e.type === 'MON' ? '#b084ff' : '#75d36a', 'enemy', e.flash, e.frozen);
      }
      ctx.filter = 'none';
      ctx.shadowBlur = 0;

      if (e.boss && (e.shielded || e.skillState === 'summoning' || e.skillState === 'fire')) {
        const shieldColor = e.finalBoss ? '#d56bff' : '#ffb257';
        const shieldFill = e.finalBoss ? '#b45cff' : '#ff7a18';
        ctx.globalAlpha = .65 + Math.sin(s.animTime * 8) * .15;
        ctx.strokeStyle = shieldColor;
        ctx.lineWidth = 4;
        ctx.shadowColor = shieldColor;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(e.x, e.y + bob, size * .55, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = .13;
        ctx.fillStyle = shieldFill;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      if (e.frozen > 0) {
        ctx.strokeStyle = '#bdf6ff';
        ctx.lineWidth = e.boss ? 5 : 3;
        ctx.globalAlpha = .78;
        ctx.strokeRect(e.x - size * .38, e.y - size * .48, size * .76, size * .9);
        ctx.globalAlpha = 1;
      }
      if (!e.boss) {
        const hpRatio = Math.max(0, e.hp / e.maxHp);
        const barW = e.type === 'BAT' ? 24 : e.type === 'FIREBALL' ? 26 : 34;
        const barH = 5;
        const barY = e.y - size * .52;
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
      e.preventDefault();
      const selectedWeapon = WEAPONS[selectedRef.current.type];
      if (s.isDrawing && selectedWeapon?.aim) {
        s.path.push(p);
        s.floatTexts.push({ id: uid(), text: '標記', x: p.x, y: p.y - 12, vy: -18, life: .45, color: '#d9ff99', size: 13, glow: true });
        return;
      }
      canvas.setPointerCapture(e.pointerId); s.pointerId = e.pointerId;
      s.path = [p]; s.isDrawing = true; s.drawTime = 1; s.aimMode = selectedWeapon?.aim ? 'bow' : 'trace';
      if (selectedWeapon?.aim) s.floatTexts.push({ id: uid(), text: '點擊地圖標記目標！', x: s.w/2, y: 96, vy: -8, life: .8, color: '#d9ff99', size: 20, glow: true });
      setUi(v => ({ ...v, drawing: true, timer: 1 }));
    };
    const moveDraw = e => {
      const s = stateRef.current; if (!s.isDrawing || e.pointerId !== s.pointerId || s.aimMode === 'bow') return;
      const p = toPoint(e); if (p.y <= s.battleH && p.y >= 0) {
        const last = s.path[s.path.length - 1];
        if (!last || dist(last, p) > 5) s.path.push(p);
      }
    };
    const endDraw = e => {
      const s = stateRef.current; if (!s.isDrawing || e.pointerId !== s.pointerId) return;
      if (s.aimMode !== 'bow') {
        launchWeapon(); s.isDrawing = false; s.drawTime = 0; s.pointerId = null; s.aimMode = '';
        setUi(v => ({ ...v, drawing: false, timer: 0 }));
      }
    };
    canvas.addEventListener('pointerdown', startDraw); canvas.addEventListener('pointermove', moveDraw); canvas.addEventListener('pointerup', endDraw); canvas.addEventListener('pointercancel', endDraw);

    function getTierInfo(item) {
      const tier = item?.tier || 1;
      return { tier, power: tier === 3 ? 2 : tier === 2 ? 1.5 : 1 };
    }
    function consumeSelectedWeapon(item, tierInfo) {
      queueRef.current = normalizeWeaponQueue(queueRef.current.filter(x => x.id !== item.id));
      selectedRef.current = null;
      const base = WEAPONS[item.type];
      if (tierInfo.tier >= 2) stateRef.current.floatTexts.push({ id: uid(), text: tierInfo.tier === 3 ? base.triple : base.label, x: stateRef.current.w / 2, y: stateRef.current.battleH / 2, vy: -10, life: 1.2, color: tierInfo.tier === 3 ? '#ffd76a' : '#d38cff', size: tierInfo.tier === 3 ? 34 : 26 });
      setUi(v => ({ ...v, queue: queueRef.current, selected: null }));
    }
    function launchBowAttack(s, item, tierInfo) {
      const base = WEAPONS[item.type];
      const points = s.path.length ? [...s.path] : [{ x: s.w / 2, y: s.battleH / 2 }];
      const dmg = weaponBaseDamage(item.type, s.stats) * tierInfo.power;
      for (const p of points) {
        s.hitEffects.push({ id: uid(), type: 'bow', x: p.x, y: p.y, age: 0, life: .34, combo: tierInfo.tier });
        for (const e of s.enemies) {
          if (Math.hypot(e.x - p.x, e.y - p.y) <= base.radius + (e.boss ? 10 : 0)) {
            damageEnemy(s, e, dmg, tierEffectColor(item.type, tierInfo.tier), { type: item.type, combo: tierInfo.tier });
          }
        }
        s.floatTexts.push({ id: uid(), text: '箭雨！', x: p.x, y: p.y - 20, vy: -28, life: .55, color: tierEffectColor(item.type, tierInfo.tier), size: 16, glow: tierInfo.tier >= 2 });
      }
      s.path = [];
      consumeSelectedWeapon(item, tierInfo);
    }
    function launchWeapon() {
      const s = stateRef.current, item = selectedRef.current; if (!item || s.path.length < 1) return;
      const base = WEAPONS[item.type]; const tierInfo = getTierInfo(item);
      if (base.aim) { launchBowAttack(s, item, tierInfo); return; }
      if (s.path.length < 2) return;
      const weaponPath = [...s.path];
      s.path = [];
      s.weapons.push({ id: uid(), type: item.type, path: weaponPath, seg: 0, t: 0, x: weaponPath[0].x, y: weaponPath[0].y, radius: base.radius, damage: weaponBaseDamage(item.type, s.stats) * tierInfo.power, hitCd: {}, trail: [], combo: tierInfo.tier, trailColor: tierTrailColor(item.type, tierInfo.tier), damageColor: tierEffectColor(item.type, tierInfo.tier) });
      consumeSelectedWeapon(item, tierInfo);
    }


    function waveConfig(wave) {
      const boss = wave === 5 || wave === 10;
      return {
        total: Math.ceil((boss ? 26 + wave * 3 : 28 + wave * 8) * 1.5),
        interval: Math.max(0.16, 0.42 - wave * 0.025),
        hp: Math.ceil((16 + wave * 4) * 1.5),
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
    function spawnBat(s, boss, index) {
      const cfg = waveConfig(s.wave);
      const hp = cfg.hp;
      const startX = boss.x + rand(-42, 42);
      const startY = boss.y + rand(8, 35);
      s.enemies.push({
        id: uid(), type: 'BAT', x: startX, y: startY,
        hp, maxHp: hp, atk: 5, cd: 0,
        speed: cfg.speed(s) * 1.45,
        flash: 0, frozen: 0, animSeed: Math.random() * 4,
        boss: false, finalBoss: false, radius: 10,
        targetX: rand(s.w * .10, s.w * .90), driftPhase: Math.random() * Math.PI * 2,
        driftAmp: rand(14, 42), summonOwner: boss.id,
      });
    }

    function spawnBossFireball(s, boss, index) {
      const cfg = waveConfig(s.wave);
      const hp = cfg.hp;
      s.enemies.push({
        id: uid(), type: 'FIREBALL', x: boss.x + (index - 1) * 34, y: boss.y + 28,
        hp, maxHp: hp, atk: 5, cd: 0,
        speed: cfg.speed(s) * 1.45,
        flash: 0, frozen: 0, animSeed: Math.random() * 4,
        boss: false, finalBoss: false, radius: 11,
        targetX: rand(s.w * .12, s.w * .88), driftPhase: Math.random() * Math.PI * 2,
        driftAmp: rand(8, 24), fireball: true, summonOwner: boss.id,
      });
    }

    function beginFinalBossSummon(s, boss) {
      boss.skillState = 'summoning';
      boss.skillTimer = 0;
      boss.skillDuration = 0.72;
      boss.shielded = true;
      s.floatTexts.push({ id: uid(), text: 'BOSS 召喚蝙蝠！', x: s.w/2, y: 96, vy: -8, life: 1.1, color:'#d56bff', size:28, glow:true });
    }

    function castDBossFire(s, boss) {
      boss.skillState = 'fire';
      boss.skillTimer = 0;
      boss.skillDuration = 0.48;
      boss.fireSpawned = 0;
      s.floatTexts.push({ id: uid(), text: 'BOSS 火球術！', x: s.w/2, y: 96, vy: -8, life: .9, color:'#ffb257', size:26, glow:true });
    }

    function spawnEnemy(s) {
      const cfg = waveConfig(s.wave);
      const isBoss = cfg.boss && s.waveSpawned === cfg.total - 1;
      const hp = isBoss ? (280 + s.wave * 35) * 5 : cfg.hp;
      const enemyType = isBoss ? 'BOSS' : (Math.random() < 0.45 ? 'MON' : 'ZOM');
      const speedMul = enemyType === 'MON' ? 1.45 : 1;
      s.enemies.push({
        id: uid(), type: enemyType, x: rand(s.w*.12, s.w*.88), y: isBoss ? 30 : 42,
        hp, maxHp: hp, atk: isBoss ? 25 : 5 + s.wave, cd: 0,
        speed: isBoss ? (s.battleH * .25 - 30) / 2.2 : cfg.speed(s) * speedMul, flash:0, frozen:0, animSeed: Math.random() * 4,
        boss: isBoss, finalBoss: isBoss && s.wave === 10, radius: isBoss ? 30 : enemyType === 'MON' ? 11 : 13,
        bossCenterX: s.w / 2, bossMovePhase: Math.random() * Math.PI * 2, bossMoveAmp: s.w * .25,
        skillCd: isBoss ? 5 : 0, skillState: '', skillTimer: 0, skillDuration: 0, shielded: false, hurtAnim: 0, fireSpawned: 0,
      });
      s.waveSpawned++;
    }
    function gainExp(s, amount) {
      if (s.gameOver || s.upgrading) return;
      s.exp += amount;
      let need = s.level * 80;
      if (s.exp >= need) {
        s.exp -= need;
        s.level += 1;
        s.upgrading = true;
        s.upgradeOptions = drawUpgradeOptions();
        s.floatTexts.push({ id: uid(), text: 'Level Up！', x: s.w / 2, y: s.battleH * .45, vy: -6, life: 1.1, color: '#fff4b8', size: 34, glow: true });
        setUi(v => ({ ...v, level: s.level, exp: s.exp, expNeed: s.level * 80, upgrading: true, upgradeOptions: s.upgradeOptions }));
      } else {
        setUi(v => ({ ...v, exp: s.exp, expNeed: s.level * 80, level: s.level }));
      }
    }

    function damageEnemy(s, e, dmg, color, weapon = null) {
      if (e.boss && e.shielded) {
        s.floatTexts.push({ id: uid(), text: '無效', x: e.x, y: e.y - 42, vy: -38, life: .55, color:'#d56bff', size:18, glow:true });
        for (let i=0;i<5;i++) s.particles.push({ id: uid(), x:e.x+rand(-28,28), y:e.y+rand(-36,36), vx:rand(-40,40), vy:rand(-40,40), life:.35, color:'#d56bff', size:3, glow:true });
        return;
      }
      e.hp -= dmg; e.flash = .08;
      if (e.finalBoss) e.hurtAnim = .18;
      const isTierColor = color === '#c084fc' || color === '#ffd76a';
      s.floatTexts.push({
        id: uid(), text: Math.round(dmg).toString(), x: e.x + rand(-8,8), y: e.y - (e.boss ? 34 : 18),
        vy: isTierColor ? -58 : -45, life: isTierColor ? .82 : .65, color,
        size: (e.boss ? 20 : 16) + (color === '#ffd76a' ? 6 : color === '#c084fc' ? 3 : 0),
        glow: isTierColor
      });
      if (weapon?.type && WEAPONS[weapon.type]?.hitSheet) {
        s.hitEffects.push({
          id: uid(),
          type: weapon.type,
          x: e.x,
          y: e.y,
          age: 0,
          life: .34,
          combo: weapon.combo || 1,
        });
      }
      const count = (e.boss ? 12 : 7) + (color === '#ffd76a' ? 8 : color === '#c084fc' ? 4 : 0);
      for (let i=0;i<count;i++) s.particles.push({
        id: uid(), x:e.x, y:e.y, vx:rand(-90,90), vy:rand(-90,90),
        life: color === '#ffd76a' ? .5 : color === '#c084fc' ? .42 : .35, color,
        size: color === '#ffd76a' ? rand(3,7) : color === '#c084fc' ? rand(2,6) : 4, glow: isTierColor
      });
    }
    function killEnemy(s, e) {
      s.kills++;
      gainExp(s, e.boss ? 100 : 10);
      const n = e.boss ? 36 : 14;
      for (let i=0;i<n;i++) s.particles.push({ id: uid(), x:e.x, y:e.y, vx:rand(-160,160), vy:rand(-160,160), life:.65, color:e.boss ? '#ffdf6e' : '#ffcc99' });
      if (e.boss) s.floatTexts.push({ id: uid(), text: 'BOSS 擊破！', x: e.x, y: e.y - 40, vy: -22, life: 1.2, color:'#ffdf6e', size:28 });
    }

    function update(dt) {
      const s = stateRef.current; if (s.gameOver) return;
      s.animTime += dt;
      if (!s.classChosen) {
        setUi(v => ({ ...v, classChosen: false, stats: { ...WARRIOR.stats }, bagCapacity: WARRIOR.bagCapacity }));
        return;
      }
      if (s.upgrading) {
        setUi(v => ({ ...v, level: s.level, exp: s.exp, expNeed: s.level * 80, upgrading: true, upgradeOptions: s.upgradeOptions }));
        return;
      }
      if (s.showBag) {
        setUi(v => ({ ...v, showBag: true, stats: { ...s.stats }, bag: [...bagRef.current] }));
        return;
      }
      if (s.isDrawing) {
        s.drawTime -= dt;
        setUi(v => ({ ...v, timer: Math.max(0, s.drawTime) }));
        if (s.drawTime <= 0) {
          launchWeapon();
          s.isDrawing = false;
          s.aimMode = '';
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
        e.flash = Math.max(0, e.flash - dt);
        e.hurtAnim = Math.max(0, (e.hurtAnim || 0) - dt);
        e.cd -= dt;
        e.frozen = Math.max(0, e.frozen - dt);

        if (e.boss) {
          const activeSummons = s.enemies.some(x => x.summonOwner === e.id && x.hp > 0);
          if (e.finalBoss) {
            e.shielded = activeSummons || e.skillState === 'summoning';
            e.skillCd -= dt;
            if (e.skillState === 'summoning') {
              e.skillTimer += dt;
              if (e.skillTimer >= e.skillDuration) {
                e.skillState = '';
                e.skillTimer = 0;
                for (let i = 0; i < 8; i++) spawnBat(s, e, i);
                e.shielded = true;
              }
            } else if (e.skillCd <= 0 && !activeSummons) {
              beginFinalBossSummon(s, e);
              e.skillCd = 5;
            }
          } else if (s.wave === 5) {
            const activeFireballs = s.enemies.some(x => x.summonOwner === e.id && x.hp > 0);
            e.shielded = activeFireballs || e.skillState === 'fire';
            e.skillCd -= dt;
            if (e.skillState === 'fire') {
              e.skillTimer += dt;
              while (e.fireSpawned < 3 && e.skillTimer >= e.fireSpawned * 0.16) {
                spawnBossFireball(s, e, e.fireSpawned);
                e.fireSpawned += 1;
              }
              if (e.skillTimer >= e.skillDuration) {
                e.skillState = '';
                e.skillTimer = 0;
                e.shielded = s.enemies.some(x => x.summonOwner === e.id && x.hp > 0);
              }
            } else if (e.skillCd <= 0 && !activeFireballs) {
              castDBossFire(s, e);
              e.skillCd = 5;
            }
          }
        }

        if (e.frozen <= 0) {
          if (e.boss) {
            // 第 5 / 第 10 波 BOSS 不再一路往基地衝。
            // 先進場到戰場上方 1/4 附近，之後左右巡航並持續施放技能。
            const targetY = s.battleH * .25;
            if (e.y < targetY) {
              e.y = Math.min(targetY, e.y + e.speed * dt);
            } else {
              e.y = targetY;
              e.x = clamp((e.bossCenterX || s.w / 2) + Math.sin(s.animTime * 1.15 + (e.bossMovePhase || 0)) * (e.bossMoveAmp || s.w * .25), 56, s.w - 56);
            }
          } else if (e.type === 'BAT' || e.type === 'FIREBALL') {
            const dy = Math.max(1, (s.battleH - 28) - e.y);
            const dx = ((e.targetX || e.x) - e.x) / dy;
            e.x += dx * e.speed * dt + Math.sin(s.animTime * 5 + (e.driftPhase || 0)) * (e.driftAmp || 0) * dt;
            e.y += e.speed * (s.berserkActive ? 1.3 : 1) * dt;
          } else {
            e.y += e.speed * (s.berserkActive ? 1.3 : 1) * dt;
          }
        }
        if (!e.boss && e.y > s.battleH - 28) {
          s.allyHp -= e.type === 'BAT' ? 5 : e.type === 'FIREBALL' ? 5 : 1;
          e.hp = 0;
          e.reachedBase = true;
        }
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
            damageEnemy(s,e,w.damage,w.damageColor || base.color,w);
            if(base.freeze) e.frozen=Math.max(e.frozen,base.freeze);
            if(base.knockback && !e.boss) e.y = Math.max(34, e.y - base.knockback);
          }
        }
      }
      s.weapons = s.weapons.filter(w=>!w.done);
      s.hitEffects.forEach(h=>{ h.age += dt; h.life -= dt; });
      s.hitEffects = s.hitEffects.filter(h=>h.life>0);
      s.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;}); s.particles=s.particles.filter(p=>p.life>0);
      s.floatTexts.forEach(f=>{f.y+=f.vy*dt;f.life-=dt;}); s.floatTexts=s.floatTexts.filter(f=>f.life>0);
      if(s.allyHp<=0) s.gameOver='我方基地陷落';
      setUi(v => ({ ...v, kills:s.kills, allyHp:Math.max(0,Math.ceil(s.allyHp)), wave:s.wave, waveState:s.waveState, rest:Math.max(0,Math.ceil(s.restTime)), enemiesLeft:Math.max(0, s.waveTotal - s.waveSpawned + s.enemies.length), level:s.level, exp:s.exp, expNeed:s.level * 80, upgrading:s.upgrading, upgradeOptions:s.upgradeOptions, gameOver:s.gameOver, classChosen:s.classChosen, playerClass:s.playerClass, stats:s.stats || WARRIOR.stats, bag:[...bagRef.current], bagCapacity: WARRIOR.bagCapacity, showBag: s.showBag || false }));
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
        const shieldText = boss.shielded ? '  防護罩啟動' : '';
        const label = `BOSS HP  ${Math.ceil(boss.hp)} / ${boss.maxHp}${shieldText}`;
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
        const frameCount = base.frames || 3;
        const fps = base.fps || 12;
        const frame = Math.floor(s.animTime * fps) % frameCount;
        // 攻擊動畫尺寸直接對齊目前判定直徑：一階=原半徑*2，二/三階跟著強化後半徑放大。
        const size = Math.max(18, w.radius * 2);
        ctx.shadowColor=base.color;
        ctx.shadowBlur=10;
        ctx.imageSmoothingEnabled = false;
        if (sheet && sheet.complete && sheet.naturalWidth) {
          const fw = sheet.naturalWidth / frameCount;
          const fh = sheet.naturalHeight;
          const drawW = size;
          const drawH = size * (fh / fw);
          if (base.rotateToPath) {
            // 火焰法杖：用細長火焰彈沿玩家軌跡方向飛行。
            const p0 = w.path[w.seg] || { x: w.x, y: w.y };
            const p1 = w.path[w.seg + 1] || p0;
            const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
            ctx.translate(w.x, w.y);
            ctx.rotate(angle);
            ctx.drawImage(sheet, frame * fw, 0, fw, fh, -drawW/2, -drawH/2, drawW, drawH);
          } else {
            ctx.drawImage(sheet, frame * fw, 0, fw, fh, w.x - drawW/2, w.y - drawH/2, drawW, drawH);
          }
        } else {
          ctx.font='30px serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('✦',w.x,w.y);
        }
        ctx.restore();
      }

      // 武器命中特效：火焰法杖命中時播放專用爆裂 sprite sheet。
      for (const h of s.hitEffects) {
        const base = WEAPONS[h.type];
        const sheet = weaponHitSheetImgs[h.type];
        if (!sheet || !sheet.complete || !sheet.naturalWidth) continue;
        const frames = base.hitFrames || 3;
        const fw = sheet.naturalWidth / frames;
        const fh = sheet.naturalHeight;
        const progress = clamp(h.age / Math.max(.01, h.age + h.life), 0, .999);
        const frame = Math.min(frames - 1, Math.floor(progress * frames));
        // 命中特效維持比小怪略小，避免遮住怪物本體；高階只微幅放大。
        const target = (base.hitSize || 34) * (h.combo >= 3 ? 1.18 : h.combo >= 2 ? 1.08 : 1);
        const drawW = target;
        const drawH = target * (fh / fw);
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.globalAlpha = clamp(h.life * 4, 0, 1);
        ctx.shadowColor = base.color;
        ctx.shadowBlur = h.combo >= 3 ? 26 : h.combo >= 2 ? 18 : 12;
        ctx.drawImage(sheet, frame * fw, 0, fw, fh, h.x - drawW / 2, h.y - drawH / 2, drawW, drawH);
        ctx.restore();
      }
      if(s.path.length>0 && selectedRef.current?.type === 'bow'){
        const tier = selectedRef.current?.tier || 1;
        const markerColor = tier >= 3 ? '#ffd76a' : tier >= 2 ? '#c084fc' : '#ffffff';
        for (const p of s.path) {
          ctx.save(); ctx.strokeStyle = markerColor; ctx.lineWidth = 3; ctx.shadowColor = markerColor; ctx.shadowBlur = tier >= 3 ? 24 : tier >= 2 ? 16 : 6; ctx.globalAlpha = .92;
          ctx.beginPath(); ctx.arc(p.x, p.y, 18 + Math.sin(s.animTime * 10) * 2, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(p.x - 24, p.y); ctx.lineTo(p.x + 24, p.y); ctx.moveTo(p.x, p.y - 24); ctx.lineTo(p.x, p.y + 24); ctx.stroke(); ctx.restore();
        }
      } else if(s.path.length>1){
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

  const expRatio = Math.max(0, Math.min(1, (ui.exp || 0) / Math.max(1, ui.expNeed || 80)));

  return <div className="page"><div className={`phone ${(ui.upgrading || ui.showBag) ? 'isPaused' : ''}`} ref={wrapRef}>
    <canvas ref={canvasRef} />
    {!ui.classChosen && <div className="classOverlay">
      <div className="classCard">
        <div className="classEyebrow">選擇職業</div>
        <h1>戰士</h1>
        <div className="classWeapon"><img src={WEAPONS.sword.icon} alt="長劍" /> 初始武器：長劍</div>
        <div className="statGrid">
          <span>STR <b>5</b></span><span>DEX <b>3</b></span><span>INT <b>1</b></span><span>VIT <b>3</b></span>
        </div>
        <div className="classNote">包包容量：3 格｜初始包包：劍 / 盾 / 弓箭｜開局序列預載 2 把劍</div>
        <button className="startClassBtn" onClick={startWarrior}>開始遊戲</button>
      </div>
    </div>}
    <div className="hud"><div className="title">武器軌跡割草</div><div className="wave">第 {ui.wave || 1}/10 波</div><div className="kills">擊殺：{ui.kills}</div></div>
    <div className="expHud">
      <div className="expText">Lv.{ui.level}　EXP {Math.floor(ui.exp || 0)} / {ui.expNeed || 80}</div>
      <div className="expTrack"><div className="expFill" style={{ width: `${expRatio * 100}%` }} /></div>
    </div>
    {ui.drawing && <div className="timer">畫軌跡：{ui.timer.toFixed(1)}s</div>}
    {ui.upgrading && <div className="levelOverlay">
      <div className="levelCard">
        <h2>Level Up！</h2>
        <div className="upgradeChoices">
          {(ui.upgradeOptions?.length ? ui.upgradeOptions : [{id:'a'}, {id:'b'}, {id:'c'}]).slice(0,3).map((opt, idx) =>
            <button key={opt.id || idx} className="upgradeChoice" onClick={() => continueAfterUpgrade(opt)} aria-label={`upgrade option ${idx + 1}`}>
              <span className="choiceIndex">{idx + 1}</span>
              <div className="upgradeStats">{renderUpgradeSummary(opt.boost || {})}</div>
            </button>
          )}
        </div>
        <button className="skipUpgrade" onClick={continueAfterUpgrade}>跳過選擇</button>
      </div>
    </div>}
    {ui.gameOver && <div className="gameOver"><b>{ui.gameOver}</b><button onClick={()=>location.reload()}>重新開始</button></div>}
    <div className="queue">
      <div className="blocks">{ui.queue.map((item) => {
        const w=WEAPONS[item.type]; const tier=item.tier || 1;
        return <button key={item.id} onClick={()=>selectBlock(item)} className={`block ${ui.selected===item.id?'selected':''} tier${tier} ${item.mergedAt ? 'merged' : ''} mergeTier${item.mergeTier || tier}`} style={{'--c':w.color}}><span><img className="weaponIcon" src={w.icon} alt={w.name} /></span>{tier>=2 && <em>{tier}階</em>}</button>
      })}</div>
      <button className="bagToggle" onClick={toggleBag}>包包 / 角色</button>
    </div>
    {ui.showBag && <div className="bagPanel">
      <div className="bagCard">
        <div className="bagHeader"><b>{ui.playerClass || '戰士'}</b><button onClick={toggleBag}>×</button></div>
        <div className="bagStats">
          <span>STR <b>{ui.stats?.STR ?? 5}</b></span><span>DEX <b>{ui.stats?.DEX ?? 3}</b></span><span>INT <b>{ui.stats?.INT ?? 1}</b></span><span>VIT <b>{ui.stats?.VIT ?? 3}</b></span>
        </div>
        <div className="bagTitle">武器包包 {ui.bag?.length || 0}/{ui.bagCapacity || 3}</div>
        <div className="bagSlots">{Array.from({length: ui.bagCapacity || 3}).map((_, idx) => {
          const type = ui.bag?.[idx]; const w = type ? WEAPONS[type] : null;
          return <button key={idx} className={`bagSlot ${ui.selectedBagIndex === idx ? 'active' : ''}`} onClick={() => selectBagWeapon(idx)}>{w ? <><img src={w.icon} alt={w.name}/><small>{w.name}</small><small className="bagDamage">傷害 {weaponDamageText(type, ui.stats || WARRIOR.stats)}</small><small className="bagFormula">半徑 {w.radius}｜{w.aim ? '點擊標記' : w.knockback ? '擊退' : w.freeze ? '凍結' : '軌跡'}</small></> : <small>空格</small>}</button>;
        })}</div>
        {ui.bag?.[ui.selectedBagIndex ?? 0] && (() => { const type = ui.bag[ui.selectedBagIndex ?? 0]; const w = WEAPONS[type]; return <div className="weaponDetail"><b>{w.name}</b><span>傷害：{weaponDamageText(type, ui.stats || WARRIOR.stats)}</span><span>半徑：{w.radius}</span><span>速度：{w.aim ? '指定地點打擊' : w.speed < 350 ? '慢' : w.speed > 800 ? '最快' : w.speed > 600 ? '快' : '中'}</span><span>特效：{w.knockback ? '擊中後怪物往後退' : w.freeze ? '凍結 3 秒' : w.aim ? '1 秒內點擊地圖標記，時間到後打擊標記地點' : '沿軌跡多段命中'}</span></div> })()}
        <p className="bagHint">序列生成會從包包武器隨機抽取。商店替換功能下一版實裝。</p>
      </div>
    </div>}
  </div></div>;
}

createRoot(document.getElementById('root')).render(<App />);
