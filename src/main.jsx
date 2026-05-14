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
import greatswordIconUrl from './assets/greatsword-icon.svg';
import katanaIconUrl from './assets/katana-icon.svg';
import kingswordIconUrl from './assets/kingsword-icon.svg';
import greatshieldIconUrl from './assets/greatshield-icon.svg';
import gianthammerIconUrl from './assets/gianthammer-icon.svg';
import holyshieldIconUrl from './assets/holyshield-icon.svg';
import crossbowIconUrl from './assets/crossbow-icon.svg';
import boomerangIconUrl from './assets/boomerang-icon.svg';
import giantbowIconUrl from './assets/giantbow-icon.svg';
import swordSheetUrl from './assets/sword-sheet.png';
import bombSheetUrl from './assets/bomb-sheet.png';
import lightningSheetUrl from './assets/lightning-sheet.png';
import iceSheetUrl from './assets/ice-sheet.png';
import swordHitSheetUrl from './assets/sword-hit-sheet.png';
import iceHitSheetUrl from './assets/ice-hit-sheet.png';
import lightningHitSheetUrl from './assets/lightning-hit-sheet.png';
import bombHitSheetUrl from './assets/bomb-hit-sheet.png';
import monsterDieSfxUrl from './assets/MONSTER-DIE.m4a';
import levelUpSfxUrl from './assets/LEVEL-UP.wav';
import bossHitSfxUrl from './assets/BOSS-HIT.wav';
import shootSfxUrl from './assets/SHOOT.wav';
import shieldHitSfxUrl from './assets/SHIELD-HIT.wav';
import swordHitSfxUrl from './assets/SWORD-HIT.ogg';

const WEAPON_ASSETS = {
  sword: { icon: swordIconUrl, sheet: swordSheetUrl, hitSheet: swordHitSheetUrl },
  bomb: { icon: bombIconUrl, sheet: bombSheetUrl, hitSheet: bombHitSheetUrl },
  lightning: { icon: lightningIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl },
  ice: { icon: iceIconUrl, sheet: iceSheetUrl, hitSheet: iceHitSheetUrl },
  shield: { icon: shieldIconUrl, sheet: shieldIconUrl, hitSheet: swordHitSheetUrl },
  bow: { icon: bowIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl },
};

const WEAPONS = {
  sword: { name: '劍', icon: swordIconUrl, sheet: swordSheetUrl, hitSheet: swordHitSheetUrl, color: '#f0c040', radius: 40, speed: 720, formula: '4 × 力量', label: '二階劍！', triple: '三階劍！', frames: 8, fps: 18, hitFrames: 6, hitSize: 34, swipeSlash: true, slashDepth: 300, slashName: '橫斬' },
  bomb: { name: '火焰法杖', icon: bombIconUrl, sheet: bombSheetUrl, hitSheet: bombHitSheetUrl, color: '#ff6644', radius: 75, speed: 330, formula: '5 × 智力', label: '二階火焰！', triple: '三階烈焰！', frames: 8, fps: 20, rotateToPath: true, hitFrames: 6, hitSize: 34 },
  ice: { name: '冰霜法杖', icon: iceIconUrl, sheet: iceSheetUrl, hitSheet: iceHitSheetUrl, color: '#88ddff', radius: 30, speed: 500, formula: '4 × 智力 + 1 × 敏捷', freeze: 3, label: '二階冰霜！', triple: '三階冰霜！', frames: 8, fps: 20, rotateToPath: true, hitFrames: 6, hitSize: 34 },
  lightning: { name: '雷電法杖', icon: lightningIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl, color: '#ccaaff', radius: 55, speed: 920, formula: '3 × 智力', label: '二階雷電！', triple: '三階雷鏈！', frames: 8, fps: 22, rotateToPath: true, hitFrames: 6, hitSize: 34 },
  shield: { name: '盾', icon: shieldIconUrl, sheet: shieldIconUrl, hitSheet: swordHitSheetUrl, color: '#9ca3af', radius: 40, speed: 300, formula: '5 × 體質', knockback: 42, label: '二階飛盾！', triple: '三階飛盾！', frames: 1, fps: 1, spin: true, spinSpeed: 12, hitFrames: 6, hitSize: 34, shieldClick: true, bounceRange: 150, bounces: 2 },
  bow: { name: '弓箭', icon: bowIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl, color: '#84cc16', radius: 50, speed: 0, formula: '5 × 敏捷', aim: true, label: '二階箭雨！', triple: '三階箭雨！', frames: 8, fps: 18, hitFrames: 6, hitSize: 34 },

  greatsword: { name: '大劍', quality: '藍色', icon: greatswordIconUrl, sheet: swordSheetUrl, hitSheet: swordHitSheetUrl, color: '#60a5fa', radius: 50, speed: 350, formula: '4.5 × 力量', label: '二階大劍！', triple: '三階大劍！', frames: 8, fps: 18, hitFrames: 6, hitSize: 34, swipeSlash: true, slashDepth: 400, slashName: '大橫斬', desc: '左右滑動斬擊；力量>15 追加 2×體質；力量>30 獲得 敏捷/100 爆擊率' },
  katana: { name: '武士刀', quality: '紫色', icon: katanaIconUrl, sheet: swordSheetUrl, hitSheet: swordHitSheetUrl, color: '#c084fc', radius: 40, speed: 500, formula: '4 × 力量 + 1 × 敏捷', multiLine: true, label: '二階武士刀！', triple: '三階武士刀！', frames: 8, fps: 22, hitFrames: 6, hitSize: 34, desc: '時間內可畫多條線；力量+敏捷>25 造成流血；>50 攻擊流血目標強化' },
  kingsword: { name: '王者之劍', quality: '金色', icon: kingswordIconUrl, sheet: swordSheetUrl, hitSheet: swordHitSheetUrl, color: '#ffd76a', radius: 60, speed: 0, formula: '6 × 力量', aim: true, label: '二階王者之劍！', triple: '三階王者之劍！', frames: 8, fps: 18, hitFrames: 6, hitSize: 34, desc: '力量>35 攻擊造成兩次；力量>50 攻擊後全場追加 2×力量 傷害' },
  greatshield: { name: '巨盾', quality: '藍色', icon: greatshieldIconUrl, sheet: shieldIconUrl, hitSheet: swordHitSheetUrl, color: '#60a5fa', radius: 50, speed: 300, formula: '5.5 × 體質', spin: true, spinSpeed: 14, label: '二階巨盾！', triple: '三階巨盾！', frames: 1, fps: 1, hitFrames: 6, hitSize: 34, shieldClick: true, bounceRange: 150, bounces: 2, desc: '點擊召喚飛盾追蹤最近敵人並彈射；體質>15 暈眩2秒；體質>30 命中暈眩目標時拖曳目標跟隨盾牌' },
  gianthammer: { name: '巨槌', quality: '紫色', icon: gianthammerIconUrl, sheet: shieldIconUrl, hitSheet: swordHitSheetUrl, color: '#c084fc', radius: 45, speed: 0, formula: '6 × 體質 + 2 × 力量', aim: true, label: '二階巨槌！', triple: '三階巨槌！', frames: 1, fps: 1, hitFrames: 6, hitSize: 34, desc: '體質>25 目標受傷+30% 3秒；體質+力量>55 暴露弱點，下次受傷必定爆擊' },
  holyshield: { name: '黃金聖盾', quality: '金色', icon: holyshieldIconUrl, sheet: shieldIconUrl, hitSheet: swordHitSheetUrl, color: '#ffd76a', radius: 50, speed: 350, formula: '6 × 體質', spin: true, spinSpeed: 15, label: '二階聖盾！', triple: '三階聖盾！', frames: 1, fps: 1, hitFrames: 6, hitSize: 34, desc: '體質>30 聖光標記緩速50%；體質+力量>55 命中標記目標造成小範圍 2×體質 傷害' },
  crossbow: { name: '弩箭', quality: '藍色', icon: crossbowIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl, color: '#60a5fa', radius: 55, speed: 0, formula: '5 × 敏捷', aim: true, label: '二階弩箭！', triple: '三階弩箭！', frames: 8, fps: 18, hitFrames: 6, hitSize: 34, desc: '敏捷>15 附帶 敏捷/100 爆擊率；敏捷>30 爆擊傷害300%' },
  boomerang: { name: '迴力鏢', quality: '紫色', icon: boomerangIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl, color: '#c084fc', radius: 35, speed: 500, formula: '3 × 敏捷', returnPath: true, label: '二階迴力鏢！', triple: '三階迴力鏢！', frames: 8, fps: 20, rotateToPath: true, hitFrames: 6, hitSize: 34, desc: '敏捷>20 跑完軌跡後反向回來；敏捷>40 爆擊傷害300%' },
  giantbow: { name: '巨人弓', quality: '金色', icon: giantbowIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl, color: '#ffd76a', radius: 60, speed: 0, formula: '5 × 敏捷 + 2 × 力量', aim: true, label: '二階巨人弓！', triple: '三階巨人弓！', frames: 8, fps: 18, hitFrames: 6, hitSize: 34, desc: '敏捷+力量>35 點擊位置持續3秒每秒50%傷害；>60 半徑85' },
};
const SFX_URLS = {
  monsterDie: monsterDieSfxUrl,
  levelUp: levelUpSfxUrl,
  bossHit: bossHitSfxUrl,
  shoot: shootSfxUrl,
  shieldHit: shieldHitSfxUrl,
  swordHit: swordHitSfxUrl,
};
const SWORD_TYPES = new Set(['sword', 'greatsword', 'katana', 'kingsword']);
const SHIELD_TYPES = new Set(['shield', 'greatshield', 'gianthammer', 'holyshield']);
const SHOOT_TYPES = new Set(['bow', 'crossbow', 'boomerang', 'giantbow']);

const TYPES = Object.keys(WEAPONS);
const INITIAL_WEAPONS = ['sword', 'shield', 'bow'];
const ADVENTURE_NODES = [
  { type: 'wave', wave: 1 },
  { type: 'wave', wave: 3 },
  { type: 'wave', wave: 5 },
  { type: 'shop' },
  { type: 'wave', wave: 7 },
  { type: 'wave', wave: 8 },
  { type: 'wave', wave: 9 },
  { type: 'shop' },
  { type: 'wave', wave: 10 },
];
const SHOP_WEAPON_POOL = TYPES.filter(t => !INITIAL_WEAPONS.includes(t));
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
        keepSelected: !!(a.keepSelected || b.keepSelected),
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
  if (type === 'greatsword') return 4.5 * STR + (STR > 15 ? 2 * VIT : 0);
  if (type === 'katana') return 4 * STR + DEX;
  if (type === 'kingsword') return 6 * STR;
  if (type === 'greatshield') return 5.5 * VIT;
  if (type === 'gianthammer') return 6 * VIT + 2 * STR;
  if (type === 'holyshield') return 6 * VIT;
  if (type === 'crossbow') return 5 * DEX;
  if (type === 'boomerang') return 3 * DEX;
  if (type === 'giantbow') return 5 * DEX + 2 * STR;
  return 1;
}
function globalDamageMultiplier(stats = {}) {
  return 1 + ((stats.STR || 0) * 0.01);
}
function blockSpawnInterval(stats = {}) {
  return Math.max(1.2, 2.5 - ((stats.DEX || 0) * 0.025));
}
function baseRegenPerTick(stats = {}) {
  return (stats.VIT || 0) * 0.1;
}
function chargeMultiplier(stats = {}) {
  return 1 + ((stats.INT || 0) * 0.01);
}

function critSpec(type, stats = {}) {
  const STR = stats.STR || 0, DEX = stats.DEX || 0;
  if (type === 'greatsword' && STR > 30) return { chance: Math.min(.85, DEX / 100), mult: 2 };
  if (type === 'crossbow' && DEX > 15) return { chance: Math.min(.85, DEX / 100), mult: DEX > 30 ? 3 : 2 };
  if (type === 'boomerang' && DEX > 40) return { chance: Math.min(.65, DEX / 100), mult: 3 };
  return { chance: 0, mult: 2 };
}
function weaponDamageText(type, stats = {}, tier = 1) {
  const mul = tier === 3 ? 2 : tier === 2 ? 1.5 : 1;
  const globalMul = globalDamageMultiplier(stats);
  return `${Math.round(weaponBaseDamage(type, stats) * mul * globalMul)}`;
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


function drawRegularPolygon(ctx, x, y, sides, radius, rotation = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const a = rotation + i * Math.PI * 2 / sides;
    const px = x + Math.cos(a) * radius;
    const py = y + Math.sin(a) * radius;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}
function weaponStatTags(type) {
  if (['sword','greatsword','kingsword'].includes(type)) return '受 STR 影響';
  if (type === 'katana') return '受 STR / DEX 影響';
  if (['bomb','lightning'].includes(type)) return '受 INT 影響';
  if (type === 'ice') return '受 INT / DEX 影響';
  if (['shield','greatshield','holyshield'].includes(type)) return '受 VIT 影響';
  if (type === 'gianthammer') return '受 VIT / STR 影響';
  if (['bow','crossbow','boomerang'].includes(type)) return '受 DEX 影響';
  if (type === 'giantbow') return '受 DEX / STR 影響';
  return '受素質影響';
}
function weaponControlText(type) {
  const w = WEAPONS[type] || {};
  if (w.swipeSlash) return '操作：左右滑動';
  if (w.shieldClick) return '操作：點擊發射';
  if (w.aim) return '操作：點擊指定位置';
  return '操作：畫線攻擊';
}

function App() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const stateRef = useRef(null);
  const queueSlotRef = useRef(null);   // 第一個武器格子
  const bagBtnRef = useRef(null);      // 包包按鈕
  const bagCloseRef = useRef(null);    // 包包關閉按鈕
  const energyBarRef = useRef(null);   // 能量條
  const [arrowPos, setArrowPos] = useState(null); // { top, left, dir }
  const WARRIOR = { name: '戰士', stats: { STR: 5, DEX: 3, INT: 1, VIT: 3 }, bagCapacity: 3, initialBag: ['sword', 'shield', 'bow'] };
  const [ui, setUi] = useState({ queue: [], selected: null, kills: 0, allyHp: 100, wave: 0, waveState: 'tutorial', rest: 0, enemiesLeft: 0, banner: '新手教學', drawing: false, timer: 0, gameOver: '', level: 1, exp: 0, expNeed: 80, weaponEnergy: 0, upgrading: false, upgradeOptions: [], showDev: false, classChosen: true, playerClass: '戰士', stats: WARRIOR.stats, bag: [...WARRIOR.initialBag], bagCapacity: WARRIOR.bagCapacity, showBag: false, selectedBagIndex: 0, tutorialActive: true, tutorialStep: 0, tutorialWeaponPicked: false, tutorialHighlight: 'battle', tutorialText: '怪物來了！', nodeIndex: 0, shopOpen: false, shopItems: [], shopMessage: '', replaceOffer: null, shopBoughtFx: 0 });
  const selectedRef = useRef(null);
  const blockNextPointerDown = useRef(false); // 點武器方塊時，阻擋下一次canvas pointerdown
  const queueRef = useRef([]);
  const bagRef = useRef([]);
  const sfxRef = useRef({});

  const playSfx = (name, volume = 0.85) => {
    try {
      const base = sfxRef.current[name];
      if (!base) return;
      const audio = base.cloneNode(true);
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (_) {}
  };

  const playSfxCooldown = (s, name, ms = 70, volume = 0.85) => {
    if (!s) return;
    const now = performance.now();
    s.sfxCooldowns = s.sfxCooldowns || {};
    if ((s.sfxCooldowns[name] || 0) > now) return;
    s.sfxCooldowns[name] = now + ms;
    playSfx(name, volume);
  };

  useEffect(() => {
    sfxRef.current = Object.fromEntries(Object.entries(SFX_URLS).map(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      return [key, audio];
    }));
  }, []);

  const normalizeQueuePreservingSelection = (items) => {
    const selectedId = selectedRef.current?.id;
    const marked = items.map(x => selectedId && x.id === selectedId ? { ...x, keepSelected: true } : { ...x });
    const normalized = normalizeWeaponQueue(marked);
    const kept = normalized.find(x => x.keepSelected);
    queueRef.current = normalized.map(({ keepSelected, ...rest }) => rest);
    if (kept) {
      selectedRef.current = queueRef.current.find(x => x.id === kept.id) || null;
    } else if (selectedRef.current && !queueRef.current.some(x => x.id === selectedRef.current.id)) {
      selectedRef.current = null;
    }
    return queueRef.current;
  };

  const addWeapon = (reason = '') => {
    // 武器列滿 7 格時暫停生成；不再自動擠掉最前面的武器。
    if (queueRef.current.length >= 7) return false;
    // 新武器進隊列的同一瞬間就合併相鄰同類武器，避免玩家看到兩格短暫停留後才合成。
    normalizeQueuePreservingSelection([...queueRef.current, { id: uid(), type: randomWeapon(bagRef.current), tier: 1, born: Date.now() }]);
    if (selectedRef.current && !queueRef.current.some(x => x.id === selectedRef.current.id)) selectedRef.current = null;
    setUi(v => ({ ...v, queue: queueRef.current, selected: selectedRef.current?.id ?? null }));
    if (reason && stateRef.current) stateRef.current.floatTexts.push({ id: uid(), text: reason, x: rand(80, stateRef.current.w - 80), y: stateRef.current.h * .77, vy: -34, life: 1, color: '#fff6a8', size: 18 });
    return true;
  };

  const selectBlock = (item) => {
    const s = stateRef.current;
    blockNextPointerDown.current = true; // 阻擋這次點擊穿透到canvas
    setTimeout(() => { blockNextPointerDown.current = false; }, 300); // 300ms後解除

    // 若玩家正在上一把武器的施法時間內點另一個方塊：
    // 立即結算上一把武器，然後在下一個 update 內選中新方塊，避免操作被鎖住。
    if (s?.isDrawing && selectedRef.current && item?.id && selectedRef.current.id !== item.id) {
      s.forceFinishCast = true;
      s.pendingSelectAfterCast = item;
      setUi(v => ({ ...v, timer: 0 }));
      return;
    }

    selectedRef.current = item;
    if (s?.tutorialActive) {
      if (s.tutorialStep === 12 && item?.type === 'shield') {
        s.tutorialWeaponPicked = true;
        s.tutorialPracticeType = 'shield';
        s.tutorialStep = 120;
        syncTutorialUi(120);
      } else if (s.tutorialStep === 10 && item) {
        s.tutorialWeaponPicked = true;
        // 能量條教學是獨立流程：點任意武器只代表「開始充能實戰」。
        // 不能把 tutorialPracticeType 改成 bow / shield / sword，否則點弓會回到弓箭教學邏輯。
        s.tutorialStep = 11;
        s.tutorialPracticeType = 'energy';
        s.tutorialStepGrace = .35;
        syncTutorialUi(11);
      } else if (s.tutorialStep === 1 && item?.type === 'sword') {
        // 點下劍後立刻進入可操作狀態：怪物開始往前走，提示框收起，玩家可以畫線攻擊。
        s.tutorialPracticeType = 'sword';
        s.tutorialSpawned = true; // 使用一開始已出現的怪，不重生。
        s.tutorialWeaponPicked = true;
        s.tutorialStep = 2;
        syncTutorialUi(2);
      } else if (s.tutorialStep === 8 && item?.type === 'shield') {
        s.tutorialWeaponPicked = true;
        s.tutorialStep = 80;
        syncTutorialUi(80);
      } else if (s.tutorialStep === 9 && item?.type === 'bow') {
        s.tutorialWeaponPicked = true;
        s.tutorialStep = 90;
        syncTutorialUi(90);
      }
    }
    setUi(v => ({ ...v, selected: item?.id ?? null, tutorialWeaponPicked: s?.tutorialWeaponPicked ?? v.tutorialWeaponPicked }));
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
    if (s) {
      const wasOpen = !!s.showBag;
      s.showBag = !s.showBag;
      if (s.tutorialActive && s.tutorialStep === 6 && !wasOpen && s.showBag) {
        s.tutorialStep = 7;
        setUi(v => ({ ...v, showBag: true, tutorialStep: 7, tutorialText: tutorialTexts[7].text, tutorialHighlight: tutorialTexts[7].highlight, bag: [...bagRef.current] }));
        setTimeout(() => updateArrow(7), 100); // 等包包DOM渲染後再定位箭頭
        return;
      }
      if (s.tutorialActive && s.tutorialStep === 7 && wasOpen && !s.showBag) {
        // 關包包後進入盾牌教學（只在第一次，還沒跑過盾實戰）
        if (!s.tutorialShieldDone) {
          startTutorialPractice('shield', 8);
        } else {
          // 盾已完成，進入弓箭教學
          startTutorialPractice('bow', 9);
        }
        return;
      }
    }
    setUi(v => ({ ...v, showBag: s ? s.showBag : !v.showBag, bag: [...bagRef.current] }));
  };
  const selectBagWeapon = (idx) => {
    setUi(v => ({ ...v, selectedBagIndex: idx }));
  };

  const tutorialTexts = {
    0: { text: '怪物來了！', highlight: 'battle', button: '' },
    1: { text: '點這把劍 👇', highlight: 'queue', button: '' },
    2: { text: '滑動畫面攻擊！', highlight: 'battle', button: '' },
    3: { text: '', highlight: 'battle', button: '' },
    5: { text: '選一個變強！', highlight: 'level', button: '' },
    6: { text: '這是你的武器包 👇 點開看看', highlight: 'bagButton', button: '' },
    7: { text: '請關閉包包', highlight: 'bagClose', button: '' },
    8: { text: '點這面盾 👇', highlight: 'queue', button: '' },
    80: { text: '連點擊螢幕召喚盾牌！', highlight: 'battle', button: '' },
    9: { text: '點這把弓 👇', highlight: 'queue', button: '' },
    90: { text: '點擊怪物發射弓箭！', highlight: 'battle', button: '' },
    10: { text: '殺怪填滿能量條，獲得新武器！', highlight: 'energy', button: '' },
    11: { text: '', highlight: 'battle', button: '' },
    12: { text: '同樣方塊相鄰升階！', highlight: 'queue', button: '' },
    120: { text: '', highlight: 'battle', button: '' },
    13: { text: '準備好了，出發！', highlight: 'none', button: '開始冒險' },
  };

  const syncTutorialUi = (step) => {
    const data = tutorialTexts[step] || tutorialTexts[0];
    setUi(v => ({ ...v, tutorialActive: true, tutorialStep: step, tutorialText: data.text, tutorialHighlight: data.highlight, tutorialWeaponPicked: stateRef.current?.tutorialWeaponPicked || false, classChosen: true, playerClass: WARRIOR.name }));
    setTimeout(() => updateArrow(step), 50);
  };

  const updateArrow = (step) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wb = wrap.getBoundingClientRect();

    const visualBox = (el) => {
      if (!el) return null;
      // 教學箭頭要對到玩家看到的圖案，不是外層按鈕的整個 hitbox。
      const inner = el.querySelector?.('.weaponIcon, img, svg') || el;
      return inner.getBoundingClientRect();
    };

    const pointAt = (el, dir = 'down', opts = {}) => {
      const b = visualBox(el);
      if (!b) { setArrowPos(null); return; }
      const pad = opts.pad ?? 18;
      const cx = b.left + b.width / 2 - wb.left;
      const cy = b.top + b.height / 2 - wb.top;
      let top = cy;
      let left = cx;
      if (dir === 'down') { top = b.top - wb.top - pad - 30; left = cx; }
      if (dir === 'up') { top = b.bottom - wb.top + pad; left = cx; }
      if (dir === 'left') { top = cy; left = b.right - wb.left + pad + 14; }
      if (dir === 'right') { top = cy; left = b.left - wb.left - pad - 14; }
      setArrowPos({ top, left, dir });
    };

    if ([1, 8, 9].includes(step)) pointAt(queueSlotRef.current, 'down', { pad: 20 });
    else if (step === 6) pointAt(bagBtnRef.current, 'left', { pad: 14 });
    else if (step === 7) pointAt(bagCloseRef.current, 'left', { pad: 12 });
    else if (step === 10) {
      const canvas = canvasRef.current;
      if (canvas) {
        const b = canvas.getBoundingClientRect();
        // 能量條在基地血條上方，箭頭固定指向能量條中央偏左。
        setArrowPos({ top: b.bottom - wb.top - 96, left: b.left - wb.left + Math.min(86, b.width * .22), dir: 'up' });
      }
    }
    else setArrowPos(null);
  };

  const tutorialSetQueue = (type, count = 1) => {
    queueRef.current = Array.from({ length: count }, () => ({ id: uid(), type, tier: 1, born: Date.now() }));
    selectedRef.current = null;
    setUi(v => ({ ...v, queue: queueRef.current, selected: null }));
  };

  const resetForAdventure = () => {
    const s = stateRef.current;
    bagRef.current = [...WARRIOR.initialBag];
    queueRef.current = normalizeWeaponQueue([
      { id: uid(), type: 'sword', tier: 1, born: Date.now() },
      { id: uid(), type: 'sword', tier: 1, born: Date.now() },
    ]);
    selectedRef.current = null;
    if (s) {
      Object.assign(s, {
        tutorialActive: false, tutorialStep: 0, tutorialWeaponPicked: false, tutorialPracticeType: '', tutorialSpawned: false,
        wave: 0, nodeIndex: 0, waveState: 'rest', restTime: 5, restDuration: 5, waveSpawnTimer: 0, waveSpawned: 0, waveTotal: 0, shopOpen: false, shopItems: [], shopMessage: '', replaceOffer: null, shopBoughtFx: 0,
        enemies: [], weapons: [], hitEffects: [], particles: [], floatTexts: [], path: [], isDrawing: false, drawTime: 0,
        allyHp: 100, weaponEnergy: 0, kills: 0, level: 1, exp: 0, upgrading: false, upgradeOptions: [], gameOver: '', autoWeapon: 0, baseRegenTimer: 0,
        classChosen: true, playerClass: WARRIOR.name, stats: { ...WARRIOR.stats }, bag: [...bagRef.current], bagCapacity: WARRIOR.bagCapacity, showBag: false,
      });
      s.floatTexts.push({ id: uid(), text: '冒險開始！', x: s.w / 2, y: 110, vy: -10, life: 1.2, color: '#fff3a3', size: 30, glow: true });
    }
    setUi(v => ({ ...v, tutorialActive: false, tutorialStep: 0, tutorialWeaponPicked: false, tutorialText: '', tutorialHighlight: 'none', queue: queueRef.current, selected: null, classChosen: true, playerClass: WARRIOR.name, stats: { ...WARRIOR.stats }, bag: [...bagRef.current], bagCapacity: WARRIOR.bagCapacity, showBag: false, wave: 0, nodeIndex: 0, waveState: 'rest', rest: 5, enemiesLeft: 0, shopOpen: false, shopItems: [], shopMessage: '', replaceOffer: null, shopBoughtFx: 0, kills: 0, allyHp: 100, weaponEnergy: 0, level: 1, exp: 0, expNeed: 80, upgrading: false, upgradeOptions: [], gameOver: '' }));
  };

  const startTutorialPractice = (type, step) => {
    const s = stateRef.current;
    if (!s) return;
    s.tutorialStep = step;
    s.tutorialPracticeType = type;
    s.tutorialWeaponPicked = false;
    s.tutorialSpawned = false;
    s.tutorialAdvancePending = '';
    s.tutorialAdvanceDelay = 0;
    s.tutorialStepGrace = .35;
    s.enemies = [];
    s.weapons = [];
    s.hitEffects = [];
    s.particles = [];
    s.path = [];
    s.isDrawing = false;
    s.waveState = 'tutorial';
    s.wave = step === 3 ? 1 : (step === 8 || step === 80) ? 2 : 3;
    s.autoWeapon = 0;
    tutorialSetQueue(type, Math.min(3, type === 'sword' ? 2 : 1));
    syncTutorialUi(step);
  };

  const handleTutorialPrimary = () => {
    const step = ui.tutorialStep;
    if (step === 13) { resetForAdventure(); return; }
  };

  const skipTutorial = () => resetForAdventure();

  const STAT_KEYS = ['STR', 'DEX', 'VIT', 'INT'];
  const STAT_LABEL = { STR: '力量', DEX: '敏捷', VIT: '體質', INT: '智力' };
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
        <span className="upgradeStatName">{STAT_LABEL[key] || key}</span>
        <span className={`upgradeArrows arrows${rank.arrows}`}>{Array.from({ length: rank.arrows }).map((_, i) => <i key={i}>^</i>)}</span>
      </div>;
    });
  };


  const weaponQualityMeta = (type) => {
    const q = WEAPONS[type]?.quality || '普通';
    if (q.includes('金')) return { key: 'gold', label: '金色', price: 150 };
    if (q.includes('紫')) return { key: 'purple', label: '紫色', price: 100 };
    if (q.includes('藍')) return { key: 'blue', label: '藍色', price: 50 };
    return { key: 'blue', label: '藍色', price: 50 };
  };

  const rollShopItems = () => {
    const byQ = (q) => SHOP_WEAPON_POOL.filter(t => (WEAPONS[t]?.quality || '藍色').includes(q));
    const blue = byQ('藍');
    const purple = byQ('紫');
    const all = SHOP_WEAPON_POOL;
    const pick = (arr, used = new Set()) => {
      const candidates = arr.filter(t => !used.has(t));
      return candidates[Math.floor(Math.random() * candidates.length)] || arr[0] || 'greatsword';
    };
    const used = new Set();
    const b = pick(blue, used); used.add(b);
    const p = pick(purple, used); used.add(p);
    const r = pick(all, used);
    return [b, p, r].map(type => ({ id: uid(), type, ...weaponQualityMeta(type), bought: false }));
  };

  const openShopNode = (s) => {
    s.shopOpen = true;
    s.waveState = 'shop';
    s.shopItems = rollShopItems();
    s.shopMessage = '';
    s.replaceOffer = null;
    s.shopBoughtFx = 0;
    setUi(v => ({ ...v, shopOpen: true, waveState: 'shop', shopItems: s.shopItems, shopMessage: '', replaceOffer: null, shopBoughtFx: 0, nodeIndex: s.nodeIndex }));
  };

  const leaveShop = () => {
    const s = stateRef.current;
    if (!s) return;
    s.shopOpen = false;
    s.shopItems = [];
    s.shopMessage = '';
    s.replaceOffer = null;
    s.shopBoughtFx = 0;
    s.nodeIndex = Math.min((s.nodeIndex || 0) + 1, ADVENTURE_NODES.length - 1);
    s.waveState = 'rest';
    s.restTime = s.restDuration || 5;
    s.floatTexts.push({ id: uid(), text: '離開商店', x: s.w / 2, y: 110, vy: -8, life: 1, color: '#fff6a8', size: 24, glow: true });
    setUi(v => ({ ...v, shopOpen: false, shopItems: [], shopMessage: '', replaceOffer: null, shopBoughtFx: 0, nodeIndex: s.nodeIndex, waveState: 'rest', rest: Math.ceil(s.restTime) }));
  };

  const buyShopWeapon = (offer) => {
    const s = stateRef.current;
    if (!s || !offer || offer.bought) return;
    const price = offer.price || weaponQualityMeta(offer.type).price;
    if ((s.kills || 0) < price) {
      s.shopMessage = '擊殺數不足';
      setUi(v => ({ ...v, shopMessage: '擊殺數不足', shopItems: [...(s.shopItems || [])] }));
      return;
    }
    if (bagRef.current.length < (s.bagCapacity || 3)) {
      s.kills -= price;
      bagRef.current = [...bagRef.current, offer.type];
      s.bag = [...bagRef.current];
      offer.bought = true;
      s.shopMessage = `購入 ${WEAPONS[offer.type].name}！`;
      s.shopBoughtFx = Date.now();
      setUi(v => ({ ...v, kills: s.kills, bag: [...bagRef.current], shopItems: [...s.shopItems], shopMessage: s.shopMessage, shopBoughtFx: s.shopBoughtFx }));
      return;
    }
    s.replaceOffer = offer;
    s.shopMessage = '包包已滿，請選擇要替換的武器';
    setUi(v => ({ ...v, replaceOffer: offer, shopMessage: s.shopMessage }));
  };

  const replaceBagWeapon = (idx) => {
    const s = stateRef.current;
    if (!s?.replaceOffer) return;
    const offer = s.replaceOffer;
    const price = offer.price || weaponQualityMeta(offer.type).price;
    if ((s.kills || 0) < price) {
      s.shopMessage = '擊殺數不足';
      setUi(v => ({ ...v, shopMessage: s.shopMessage }));
      return;
    }
    s.kills -= price;
    bagRef.current = bagRef.current.map((t, i) => i === idx ? offer.type : t);
    s.bag = [...bagRef.current];
    offer.bought = true;
    s.replaceOffer = null;
    s.shopMessage = `已替換為 ${WEAPONS[offer.type].name}！`;
    s.shopBoughtFx = Date.now();
    setUi(v => ({ ...v, kills: s.kills, bag: [...bagRef.current], replaceOffer: null, shopItems: [...s.shopItems], shopMessage: s.shopMessage, shopBoughtFx: s.shopBoughtFx }));
  };

  const buyHeal = () => {
    const s = stateRef.current;
    if (!s) return;
    if ((s.allyHp || 0) >= 100) {
      s.shopMessage = '基地 HP 已滿';
      setUi(v => ({ ...v, shopMessage: s.shopMessage }));
      return;
    }
    if ((s.kills || 0) < 40) {
      s.shopMessage = '擊殺數不足';
      setUi(v => ({ ...v, shopMessage: s.shopMessage }));
      return;
    }
    s.kills -= 40;
    s.allyHp = Math.min(100, (s.allyHp || 0) + 20);
    s.shopMessage = '基地回復 20 HP！';
    s.shopBoughtFx = Date.now();
    setUi(v => ({ ...v, kills: s.kills, allyHp: Math.ceil(s.allyHp), shopMessage: s.shopMessage, shopBoughtFx: s.shopBoughtFx }));
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
      if (s.tutorialActive && s.tutorialStep === 5) {
        s.tutorialStep = 6;
        syncTutorialUi(6);
      }
      setUi(v => ({ ...v, upgrading: false, upgradeOptions: [], level: s.level, exp: s.exp, expNeed: s.level * 80, stats: { ...s.stats }, tutorialStep: s.tutorialStep || v.tutorialStep, tutorialText: tutorialTexts[s.tutorialStep]?.text || v.tutorialText, tutorialHighlight: tutorialTexts[s.tutorialStep]?.highlight || v.tutorialHighlight, nodeIndex: s.nodeIndex || 0, shopOpen: s.shopOpen || false, shopItems: s.shopItems || [], shopMessage: s.shopMessage || '', replaceOffer: s.replaceOffer || null, shopBoughtFx: s.shopBoughtFx || 0 }));
    }
  };


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    stateRef.current = {
      w: 390, h: 780, battleH: 585, last: performance.now(), autoWeapon: 0, baseRegenTimer: 0,
      wave: 0, nodeIndex: 0, waveState: 'rest', restTime: 5, restDuration: 5, waveSpawnTimer: 0, waveSpawned: 0, waveTotal: 0, shopOpen: false, shopItems: [], shopMessage: '', replaceOffer: null, shopBoughtFx: 0, bannerLife: 1.5,
      berserkActive: false, berserkScheduled: false, berserkTriggered: false, berserkAt: 0, waveElapsed: 0,
      allies: [], enemies: [], weapons: [], shieldShots: [], slashes: [], hitEffects: [], particles: [], floatTexts: [], path: [], isDrawing: false, drawTime: 0,
      allyHp: 100, weaponEnergy: 0, kills: 0, level: 1, exp: 0, upgrading: false, upgradeOptions: [], gameOver: '', baseRegenTimer: 0, pointerId: null, animTime: 0, sfxCooldowns: {},
      classChosen: true, playerClass: WARRIOR.name, stats: { ...WARRIOR.stats }, bag: [...WARRIOR.initialBag], bagCapacity: WARRIOR.bagCapacity, showBag: false,
      tutorialActive: true, tutorialStep: 0, tutorialWeaponPicked: false, tutorialHighlight: 'battle', tutorialPracticeType: '', tutorialIntroSpawned: false, tutorialStepTimer: 0, tutorialSpawned: false,
    };
    bagRef.current = [...WARRIOR.initialBag];
    queueRef.current = [];
    selectedRef.current = null;
    // v36：開局直接進入獨立新手教學場景，不再先選職業。

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
      const bob = Math.sin((s.animTime * 8) + (e.animSeed || 0)) * (e.boss ? 1.2 : 2);
      const cy = e.y + bob;
      const isSummon = e.type === 'BAT' || e.type === 'FIREBALL';
      let size = e.boss ? 96 : e.type === 'CHARGER' ? 48 : e.type === 'RUSHER' ? 42 : e.type === 'RANGED' ? 40 : isSummon ? 30 : 38;
      let sides = 32;
      let fill = '#8b5cf6';
      let stroke = '#ddd6fe';
      let label = '';
      let rot = -Math.PI / 2 + (s.animTime * 0.8);

      if (e.boss) { sides = 8; fill = e.finalBoss ? '#6d28d9' : '#b45309'; stroke = e.finalBoss ? '#e9d5ff' : '#fed7aa'; label = 'B'; rot = Math.PI / 8; }
      else if (e.type === 'RUSHER') { sides = 3; fill = '#dc2626'; stroke = '#fecaca'; label = '衝'; rot = -Math.PI / 2 + s.animTime * 4; }
      else if (e.type === 'RANGED') { sides = 4; fill = '#ca8a04'; stroke = '#fef08a'; label = '遠'; rot = Math.PI / 4; }
      else if (e.type === 'CHARGER') { sides = 6; fill = '#7c3aed'; stroke = '#ddd6fe'; label = '蓄'; rot = Math.PI / 6; }
      else if (e.type === 'BAT') { sides = 3; fill = '#9333ea'; stroke = '#f0abfc'; label = ''; rot = Math.PI + Math.sin(s.animTime * 8) * .25; }
      else if (e.type === 'FIREBALL') { sides = 32; fill = '#f97316'; stroke = '#fed7aa'; label = ''; }
      else if (e.type === 'MON') { sides = 32; fill = '#22c55e'; stroke = '#bbf7d0'; label = ''; }
      else { sides = 32; fill = '#38bdf8'; stroke = '#bae6fd'; label = ''; }

      ctx.save();
      ctx.globalAlpha = .28;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(e.x, e.y + size * .36, size * .38, size * .12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowColor = stroke;
      ctx.shadowBlur = e.boss ? 22 : e.type === 'RUSHER' ? 18 : 10;
      ctx.fillStyle = e.flash > 0 ? '#ffffff' : fill;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = e.boss ? 4 : 3;
      drawRegularPolygon(ctx, e.x, cy, sides, size * .42, rot);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (e.type === 'RUSHER') {
        ctx.strokeStyle = 'rgba(254,202,202,.65)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(e.x - size * (.58 + i * .16), cy + size * (.14 - i * .10));
          ctx.lineTo(e.x - size * (.22 + i * .08), cy + size * (.08 - i * .06));
          ctx.stroke();
        }
      }
      if (e.type === 'RANGED') {
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(e.x + size * .18, cy, size * .20, -Math.PI * .55, Math.PI * .55);
        ctx.stroke();
      }
      if (e.type === 'CHARGER' && e.chargeState === 'charging') {
        ctx.strokeStyle = '#ddd6fe';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.arc(e.x, cy, size * (.55 + Math.sin(s.animTime * 8) * .05), 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
      }
      if (label) {
        ctx.fillStyle = '#fff';
        ctx.font = `900 ${e.boss ? 24 : 13}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'rgba(0,0,0,.75)';
        ctx.lineWidth = 4;
        ctx.strokeText(label, e.x, cy + 1);
        ctx.fillText(label, e.x, cy + 1);
      }
      if (e.frozen > 0) {
        ctx.strokeStyle = '#bdf6ff';
        ctx.lineWidth = e.boss ? 5 : 3;
        ctx.globalAlpha = .78;
        ctx.strokeRect(e.x - size * .44, cy - size * .44, size * .88, size * .88);
        ctx.globalAlpha = 1;
      }
      if (!e.boss) {
        const hpRatio = Math.max(0, e.hp / e.maxHp);
        const barW = e.type === 'BAT' ? 24 : e.type === 'FIREBALL' ? 26 : 34;
        const barH = 5;
        const barY = e.y - size * .52;
        ctx.fillStyle = 'rgba(18, 10, 12, .82)';
        ctx.fillRect(e.x - barW / 2, barY, barW, barH);
        ctx.fillStyle = hpRatio > .5 ? '#80e35a' : hpRatio > .25 ? '#ffd45a' : '#ff5a55';
        ctx.fillRect(e.x - barW / 2, barY, barW * hpRatio, barH);
        ctx.strokeStyle = 'rgba(0,0,0,.72)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(e.x - barW / 2, barY, barW, barH);
        if ((e.maxShieldHp || 0) > 0 && (e.shieldHp || 0) > 0) {
          const shieldRatio = clamp(e.shieldHp / e.maxShieldHp, 0, 1);
          ctx.fillStyle = 'rgba(10,18,35,.88)';
          ctx.fillRect(e.x - barW / 2, barY - 7, barW, 4);
          ctx.fillStyle = '#8fb8ff';
          ctx.fillRect(e.x - barW / 2, barY - 7, barW * shieldRatio, 4);
          ctx.strokeStyle = 'rgba(210,230,255,.75)';
          ctx.strokeRect(e.x - barW / 2, barY - 7, barW, 4);
        }
        if (e.type === 'CHARGER' && e.chargeState === 'charging') {
          const chargeRatio = clamp((e.chargeTimer || 0) / (e.chargeDuration || 5), 0, 1);
          ctx.fillStyle = 'rgba(30,12,45,.86)';
          ctx.fillRect(e.x - barW / 2, barY - 13, barW, 5);
          ctx.fillStyle = '#a78bfa';
          ctx.fillRect(e.x - barW / 2, barY - 13, barW * chargeRatio, 5);
          ctx.strokeStyle = 'rgba(240,220,255,.85)';
          ctx.strokeRect(e.x - barW / 2, barY - 13, barW, 5);
        }
      }
      ctx.restore();
    }

    const toPoint = e => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left), y: (e.clientY - r.top) };
    };
    const releasePointer = (e) => {
      try {
        if (e?.pointerId != null && canvas.hasPointerCapture?.(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch (_) {}
    };
    const startDraw = e => {
      if (blockNextPointerDown.current) return; // 點武器方塊觸發的，忽略
      const s = stateRef.current, p = toPoint(e);
      if (!selectedRef.current || p.y > s.battleH || s.gameOver) return;
      e.preventDefault();
      const selectedWeapon = WEAPONS[selectedRef.current.type];
      if (s.isDrawing && selectedWeapon?.aim) {
        // 150ms保護期：防止選武器的點擊立刻射擊
        const elapsed = performance.now() - (s.aimStartTime || 0);
        if (elapsed < 300) return;
        s.path.push(p);
        s.floatTexts.push({ id: uid(), text: '標記', x: p.x, y: p.y - 12, vy: -18, life: .45, color: '#d9ff99', size: 13, glow: true });
        return;
      }
      if (s.isDrawing && selectedWeapon?.shieldClick) {
        // 施放窗口已經開啟時，每次點擊只生成新的飛盾，不能重置或增加倒數。
        spawnShieldShot(s, selectedRef.current, getTierInfo(selectedRef.current));
        s.floatTexts.push({ id: uid(), text: '飛盾！', x: p.x, y: p.y - 12, vy: -18, life: .45, color: '#d7e4ff', size: 14, glow: true });
        return;
      }
      if (s.isDrawing && selectedWeapon?.swipeSlash) {
        // 施放窗口已經開啟時，新的按壓只作為下一次滑動的起點，不能重置或增加倒數。
        canvas.setPointerCapture(e.pointerId);
        s.pointerId = e.pointerId;
        s.lastSlashX = p.x;
        s.lastSlashTime = performance.now();
        s.swipeTriggered = false; // 新的一次按壓 = 新的一次滑動，可再產生 1 條劍氣
        s.path = [p];
        return;
      }
      if (s.isDrawing && selectedWeapon?.multiLine) {
        canvas.setPointerCapture(e.pointerId); s.pointerId = e.pointerId;
        s.multiPaths = s.multiPaths || [];
        s.multiPaths.push([p]);
        s.path = s.multiPaths.flat();
        return;
      }
      canvas.setPointerCapture(e.pointerId); s.pointerId = e.pointerId;
      s.path = [p]; s.multiPaths = selectedWeapon?.multiLine ? [[p]] : []; s.isDrawing = true;
      s.aimMode = selectedWeapon?.aim ? 'bow' : selectedWeapon?.shieldClick ? 'shieldClick' : selectedWeapon?.swipeSlash ? 'swipeSlash' : selectedWeapon?.multiLine ? 'multiTrace' : 'trace';
      s.drawTime = 1;
      s.aimStartTime = performance.now(); // 記錄弓箭啟動時間，防止立即射擊
      if (selectedWeapon?.aim) s.floatTexts.push({ id: uid(), text: '點擊位置標記目標！', x: s.w/2, y: 96, vy: -8, life: .8, color: '#d9ff99', size: 20, glow: true });
      // 弓箭第一次啟動不加標記（避免選武器的點擊直接射擊）
      if (selectedWeapon?.shieldClick) { spawnShieldShot(s, selectedRef.current, getTierInfo(selectedRef.current)); s.floatTexts.push({ id: uid(), text: '連點螢幕召喚飛盾！', x: s.w/2, y: 96, vy: -8, life: .8, color: '#d7e4ff', size: 20, glow: true }); }
      if (selectedWeapon?.swipeSlash) { s.lastSlashX = p.x; s.lastSlashTime = performance.now(); s.swipeTriggered = false; s.floatTexts.push({ id: uid(), text: '左右滑動產生一條劍氣！', x: s.w/2, y: 96, vy: -8, life: .8, color: '#fff3b0', size: 18, glow: true }); }
      if (selectedWeapon?.multiLine) s.floatTexts.push({ id: uid(), text: '可畫多條線！時間到後一起發動', x: s.w/2, y: 96, vy: -8, life: .8, color: '#e9d5ff', size: 18, glow: true });
      setUi(v => ({ ...v, drawing: true, timer: s.drawTime }));
    };
    const moveDraw = e => {
      const s = stateRef.current; if (!s.isDrawing || e.pointerId !== s.pointerId || s.aimMode === 'bow' || s.aimMode === 'shieldClick') return;
      const p = toPoint(e); if (p.y <= s.battleH && p.y >= 0) {
        if (s.aimMode === 'swipeSlash') {
          if (s.swipeTriggered) return;
          const dx = p.x - (s.lastSlashX ?? p.x);
          const now = performance.now();
          const elapsed = Math.max(16, now - (s.lastSlashTime || now));
          const speedX = Math.abs(dx) / elapsed;
          const threshold = 28;
          if (Math.abs(dx) >= threshold) {
            const slashItem = selectedRef.current;
            const slashTier = getTierInfo(slashItem);
            s.swipeTriggered = true;
            launchSwipeSlash(s, slashItem, slashTier, dx > 0 ? 1 : -1, speedX);
            if (s.tutorialActive && s.tutorialStep === 2) { s.tutorialStep = 3; s.tutorialStepTimer = 0; s.tutorialSpawned = true; syncTutorialUi(3); }
            // 同一次按壓只產生一條劍氣；不消耗、不結束 1 秒施放窗口。
            // 玩家放開後可立刻再次按壓滑動；1 秒內滑 3 次 = 3 條劍氣。
            return;
          }
          s.path = [p];
          return;
        }
        if (s.aimMode === 'multiTrace') {
          const current = s.multiPaths?.[s.multiPaths.length - 1];
          const last = current?.[current.length - 1];
          if (!last || dist(last, p) > 5) { current.push(p); s.path = s.multiPaths.flat(); }
        } else {
          const last = s.path[s.path.length - 1];
          if (!last || dist(last, p) > 5) s.path.push(p);
        }
      }
    };
    const endDraw = e => {
      const s = stateRef.current; if (!s.isDrawing || e.pointerId !== s.pointerId) return;
      if (s.aimMode === 'multiTrace') {
        releasePointer(e);
        s.pointerId = null;
        return;
      }
      if (s.aimMode === 'swipeSlash') {
        // 放開手指後仍維持 1 秒施放窗口，可再次按壓滑動；不結束、不重置倒數。
        releasePointer(e);
        s.pointerId = null;
        return;
      }
      if (s.aimMode !== 'bow' && s.aimMode !== 'shieldClick') {
        launchWeapon(); s.isDrawing = false; s.drawTime = 0; s.pointerId = null; s.aimMode = '';
        releasePointer(e);
        setUi(v => ({ ...v, drawing: false, timer: 0 }));
      }
    };
    canvas.addEventListener('pointerdown', startDraw); canvas.addEventListener('pointermove', moveDraw); canvas.addEventListener('pointerup', endDraw); canvas.addEventListener('pointercancel', endDraw);

    function getTierInfo(item) {
      const tier = item?.tier || 1;
      return { tier, power: tier === 3 ? 2 : tier === 2 ? 1.5 : 1 };
    }
    function consumeSelectedWeapon(item, tierInfo) {
      normalizeQueuePreservingSelection(queueRef.current.filter(x => x.id !== item.id));
      selectedRef.current = null;
      const base = WEAPONS[item.type];
      if (tierInfo.tier >= 2) stateRef.current.floatTexts.push({ id: uid(), text: tierInfo.tier === 3 ? base.triple : base.label, x: stateRef.current.w / 2, y: stateRef.current.battleH / 2, vy: -10, life: 1.2, color: tierInfo.tier === 3 ? '#ffd76a' : '#d38cff', size: tierInfo.tier === 3 ? 34 : 26 });
      setUi(v => ({ ...v, queue: queueRef.current, selected: null }));
    }
    function applyPostAttackAllEnemies(s, item) {
      const stats = s.stats || {};
      const STR = stats.STR || 0, DEX = stats.DEX || 0;
      if (item.type === 'kingsword' && STR > 50) {
        for (const e of s.enemies) damageEnemy(s, e, 2 * STR, '#ffd76a', { type: item.type, combo: item.tier || 1, stats });
        s.floatTexts.push({ id: uid(), text: '王者餘威！全場斬擊', x: s.w/2, y: 128, vy: -10, life: .9, color:'#ffd76a', size:22, glow:true });
      }
    }
    function launchSwipeSlash(s, item, tierInfo, direction = 1, speedX = 1) {
      if (!item) return;
      const base = WEAPONS[item.type];
      const stats = { ...(s.stats || {}) };
      const depth = base.slashDepth || 300;
      const top = Math.max(0, s.battleH - depth);
      const dmg = weaponBaseDamage(item.type, stats) * tierInfo.power;
      const color = tierEffectColor(item.type, tierInfo.tier);
      const y = top + depth * 0.5;
      const slashSpeed = clamp(620 + speedX * 760, 680, 1550);
      const startX = direction > 0 ? -60 : s.w + 60;
      const vx = direction > 0 ? slashSpeed : -slashSpeed;
      s.slashes = s.slashes || [];
      s.slashes.push({
        id: uid(), x: startX, y, top, depth, direction, vx,
        age: 0, life: (s.w + 160) / slashSpeed,
        color, tier: tierInfo.tier, type: item.type,
        damage: dmg, stats, hitIds: []
      });
      const label = direction > 0 ? '右斬！' : '左斬！';
      s.floatTexts.push({ id: uid(), text: label, x: s.w/2, y: top + 24, vy: -22, life: .35, color, size: speedX > 0.9 ? 17 : 14, glow: true });
    }


    function nearestEnemy(s, x, y, except = new Set(), within = Infinity) {
      let best = null, bestD = within;
      for (const e of s.enemies) {
        if (e.hp <= 0 || except.has(e.id)) continue;
        const d = Math.hypot(e.x - x, e.y - y);
        if (d < bestD) { best = e; bestD = d; }
      }
      return best;
    }

    function spawnShieldShot(s, item, tierInfo) {
      if (!item) return;
      const base = WEAPONS[item.type];
      const origin = { x: s.w / 2, y: Math.max(40, s.battleH - 58) };
      const target = nearestEnemy(s, origin.x, origin.y);
      if (!target) {
        s.floatTexts.push({ id: uid(), text: '沒有目標', x: origin.x, y: origin.y - 28, vy: -18, life: .45, color: '#cbd5e1', size: 14 });
        return;
      }
      const stats = { ...(s.stats || {}) };
      s.shieldShots = s.shieldShots || [];
      s.shieldShots.push({ id: uid(), type: item.type, x: origin.x, y: origin.y, targetId: target.id, damage: weaponBaseDamage(item.type, stats) * tierInfo.power, speed: 720, radius: base.radius, combo: tierInfo.tier, color: tierEffectColor(item.type, tierInfo.tier), stats, hitIds: [], bouncesLeft: base.bounces ?? 2, bounceRange: base.bounceRange || 150, age: 0 });
    }

    function launchBowAttack(s, item, tierInfo) {
      const base = WEAPONS[item.type];
      const points = s.path.length ? [...s.path] : [{ x: s.w / 2, y: s.battleH / 2 }];
      const stats = { ...(s.stats || {}) };
      const radius = (item.type === 'giantbow' && (stats.DEX || 0) + (stats.STR || 0) > 60) ? 85 : base.radius;
      const dmg = weaponBaseDamage(item.type, stats) * tierInfo.power;
      for (const p of points) {
        s.hitEffects.push({ id: uid(), type: item.type, x: p.x, y: p.y, age: 0, life: .34, combo: tierInfo.tier });
        for (const e of s.enemies) {
          if (Math.hypot(e.x - p.x, e.y - p.y) <= radius + (e.boss ? 10 : 0)) {
            const reps = (item.type === 'kingsword' && (stats.STR || 0) > 35) ? 2 : 1;
            for (let r = 0; r < reps; r++) damageEnemy(s, e, dmg, tierEffectColor(item.type, tierInfo.tier), { type: item.type, combo: tierInfo.tier, stats });
          }
        }
        if (item.type === 'giantbow' && (stats.DEX || 0) + (stats.STR || 0) > 35) {
          s.zones = s.zones || [];
          s.zones.push({ id: uid(), type: item.type, x: p.x, y: p.y, radius, damage: dmg * 0.5, tick: 1, life: 3, color: tierEffectColor(item.type, tierInfo.tier), stats });
        }
        s.floatTexts.push({ id: uid(), text: base.name + '！', x: p.x, y: p.y - 20, vy: -28, life: .55, color: tierEffectColor(item.type, tierInfo.tier), size: 16, glow: tierInfo.tier >= 2 });
      }
      applyPostAttackAllEnemies(s, item);
      s.path = [];
      consumeSelectedWeapon(item, tierInfo);
    }
    function launchWeapon() {
      const s = stateRef.current, item = selectedRef.current; if (!item || s.path.length < 1) return;
      const base = WEAPONS[item.type]; const tierInfo = getTierInfo(item);
      if (base.aim) { launchBowAttack(s, item, tierInfo); return; }
      if (base.swipeSlash || base.shieldClick) { s.path = []; s.multiPaths = []; consumeSelectedWeapon(item, tierInfo); return; }
      const paths = base.multiLine ? (s.multiPaths || []).filter(path => path.length >= 2) : [s.path].filter(path => path.length >= 2);
      if (!paths.length) return;
      const stats = { ...(s.stats || {}) };
      s.path = []; s.multiPaths = [];
      for (const weaponPath of paths) {
        s.weapons.push({ id: uid(), type: item.type, path: weaponPath, seg: 0, t: 0, x: weaponPath[0].x, y: weaponPath[0].y, radius: base.radius, damage: weaponBaseDamage(item.type, stats) * tierInfo.power, hitCd: {}, hitIds: [], trail: [], combo: tierInfo.tier, trailColor: tierTrailColor(item.type, tierInfo.tier), damageColor: tierEffectColor(item.type, tierInfo.tier), stats, returning: false });
      }
      consumeSelectedWeapon(item, tierInfo);
      if (s.tutorialActive && s.tutorialStep === 2) {
        s.tutorialStep = 3;
        s.tutorialStepTimer = 0;
        s.tutorialSpawned = true; // 使用一開始已經出現在場上的怪，不重新生成。
        syncTutorialUi(3);
      }
    }


    function forceFinishCurrentCastAndSelectNext(s) {
      const oldItem = selectedRef.current;
      const nextItem = s.pendingSelectAfterCast;
      s.forceFinishCast = false;
      s.pendingSelectAfterCast = null;

      if (oldItem) {
        launchWeapon();
        // 若上一把因為路徑太短沒有產生攻擊，也視為施法被結束，避免卡住舊武器。
        if (selectedRef.current && selectedRef.current.id === oldItem.id) {
          s.path = [];
          s.multiPaths = [];
          consumeSelectedWeapon(oldItem, getTierInfo(oldItem));
        }
      }

      s.isDrawing = false;
      s.drawTime = 0;
      s.aimMode = '';
      s.pointerId = null;
      s.path = [];
      s.multiPaths = [];

      if (nextItem && queueRef.current.some(x => x.id === nextItem.id)) {
        selectedRef.current = nextItem;
        s.floatTexts.push({ id: uid(), text: '連段切換！', x: s.w / 2, y: s.battleH - 110, vy: -18, life: .55, color: '#fff6a8', size: 16, glow: true });
      }

      setUi(v => ({ ...v, selected: selectedRef.current?.id ?? null, drawing: false, timer: 0, queue: queueRef.current }));
    }

    function showPendingLevelUpIfReady(s) {
      if (!s.pendingLevelUp || s.upgrading || s.isDrawing || selectedRef.current) return false;
      s.pendingLevelUp = false;
      s.upgrading = true;
      if (!s.upgradeOptions?.length) s.upgradeOptions = drawUpgradeOptions();
      if (s.tutorialActive) s.tutorialStep = 5;
      playSfxCooldown(s, 'levelUp', 500, 0.95);
      s.floatTexts.push({ id: uid(), text: 'Level Up！', x: s.w / 2, y: s.battleH * .45, vy: -6, life: 1.1, color: '#fff4b8', size: 34, glow: true });
      setUi(v => ({ ...v, level: s.level, exp: s.exp, expNeed: s.level * 80, upgrading: true, upgradeOptions: s.upgradeOptions, tutorialStep: s.tutorialStep || v.tutorialStep, tutorialText: tutorialTexts[s.tutorialStep]?.text || v.tutorialText, tutorialHighlight: tutorialTexts[s.tutorialStep]?.highlight || v.tutorialHighlight }));
      return true;
    }

    function waveConfig(wave) {
      const boss = wave === 5 || wave === 10;
      const fixedTotals = { 7: 60, 8: 65, 9: 70, 10: 84 };
      return {
        total: fixedTotals[wave] || Math.ceil((boss ? 26 + wave * 3 : 28 + wave * 8) * 1.5),
        interval: Math.max(0.16, 0.42 - wave * 0.025),
        hp: Math.ceil((16 + wave * 4) * 3),
        speed: (s => (s.battleH - 86) / Math.max(7.5, 16 - wave * 0.45)),
        boss,
      };
    }
    function startCurrentNode(s) {
      const node = ADVENTURE_NODES[s.nodeIndex || 0];
      if (!node) { s.gameOver = '冒險完成，遊戲勝利！'; return; }
      if (node.type === 'shop') { openShopNode(s); return; }
      s.wave = node.wave;
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
      setUi(v => ({ ...v, nodeIndex: s.nodeIndex || 0, wave: s.wave, waveState: s.waveState, rest: 0, enemiesLeft: s.waveTotal - s.waveSpawned + s.enemies.length, banner: cfg.boss ? `第 ${s.wave} 波 BOSS 來襲！` : `第 ${s.wave} 波開始！` }));
    }
    function enterRest(s) {
      if ((s.nodeIndex || 0) >= ADVENTURE_NODES.length - 1) {
        s.gameOver = '冒險完成，遊戲勝利！';
        return;
      }
      s.nodeIndex = (s.nodeIndex || 0) + 1;
      s.berserkActive = false;
      s.berserkScheduled = false;
      s.waveSpawnTimer = 0;
      s.bannerLife = 1.4;
      const next = ADVENTURE_NODES[s.nodeIndex];
      if (next?.type === 'shop') {
        openShopNode(s);
        return;
      }
      s.waveState = 'rest';
      s.restTime = s.restDuration;
      s.floatTexts.push({ id: uid(), text: `休息 ${s.restDuration} 秒`, x: s.w/2, y: 100, vy: -8, life: 1.2, color: '#d9ecff', size: 26 });
      setUi(v => ({ ...v, nodeIndex: s.nodeIndex, waveState: 'rest', rest: Math.ceil(s.restTime), enemiesLeft: 0, banner: `休息 ${s.restDuration} 秒` }));
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
        driftAmp: rand(14, 42), summonOwner: boss.id, summonBatchId: boss.summonBatchId || '',
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
        driftAmp: rand(8, 24), fireball: true, summonOwner: boss.id, summonBatchId: boss.summonBatchId || '',
      });
    }

    function beginFinalBossSummon(s, boss) {
      boss.skillState = 'summoning';
      boss.skillTimer = 0;
      boss.skillDuration = 0.72;
      boss.shielded = false; // no boss invulnerability
      boss.broken = false;
      boss.summonBatchId = uid();
      boss.summonBatchAlive = 8;
      s.floatTexts.push({ id: uid(), text: 'BOSS 召喚蝙蝠！', x: s.w/2, y: 96, vy: -8, life: 1.1, color:'#d56bff', size:28, glow:true });
    }

    function castDBossFire(s, boss) {
      boss.skillState = 'fire';
      boss.skillTimer = 0;
      boss.skillDuration = 0.48;
      boss.fireSpawned = 0;
      boss.shielded = false; // no boss invulnerability
      boss.broken = false;
      boss.summonBatchId = uid();
      boss.summonBatchAlive = 3;
      s.floatTexts.push({ id: uid(), text: 'BOSS 火球術！', x: s.w/2, y: 96, vy: -8, life: .9, color:'#ffb257', size:26, glow:true });
    }

    function baseEnemyType() {
      return Math.random() < 0.45 ? 'MON' : 'ZOM';
    }

    function activeRangedCount(s) {
      return (s.enemies || []).filter(e => e.type === 'RANGED' && e.hp > 0).length;
    }

    function chooseEnemyType(wave, spawnedIndex, total, s) {
      const roll = Math.random();
      if (wave === 7) return roll < .30 ? 'RUSHER' : baseEnemyType();
      if (wave === 8) return (roll < .20 && activeRangedCount(s) < 3) ? 'RANGED' : baseEnemyType();
      if (wave === 9) return roll < .15 ? 'CHARGER' : baseEnemyType();
      if (wave === 10) {
        if (roll < .10 && activeRangedCount(s) < 3) return 'RANGED';
        if (roll < .20) return 'RUSHER';
        if (roll < .30) return 'CHARGER';
      }
      return baseEnemyType();
    }

    function makeEnemyStats(type, cfg, s) {
      const waveHp = cfg.hp;
      const baseSpeed = cfg.speed(s);
      if (type === 'RANGED') return { hp: Math.ceil(waveHp * .8), speed: baseSpeed * .65, atk: 1, radius: 12, exp: 12, stopY: s.battleH * .42, shootCd: rand(3.2, 5.0), projectileDamage: 3, projectileSpeed: baseSpeed * 2.2 };
      if (type === 'RUSHER') return { hp: Math.ceil(waveHp * .6), speed: baseSpeed * 2.0, atk: 5, radius: 12, exp: 15 };
      if (type === 'CHARGER') return { hp: Math.ceil(waveHp * .8), speed: baseSpeed * 1.0, atk: 10, radius: 17, exp: 15, chargeStopY: s.battleH - 150, chargeDuration: 5, rushSpeed: baseSpeed * 3.0 };
      if (type === 'MON') return { hp: waveHp, speed: baseSpeed * 1.45, atk: 5 + s.wave, radius: 11, exp: 10 };
      return { hp: waveHp, speed: baseSpeed, atk: 5 + s.wave, radius: 13, exp: 10 };
    }

    function spawnEnemy(s) {
      const cfg = waveConfig(s.wave);
      const isBoss = cfg.boss && s.waveSpawned === cfg.total - 1;
      const enemyType = isBoss ? 'BOSS' : chooseEnemyType(s.wave, s.waveSpawned, cfg.total, s);
      const st = isBoss
        ? { hp: s.wave === 10 ? 25000 : 12000, speed: (s.battleH * .25 - 30) / 2.2, atk: 25, radius: 30, exp: 100, defense: s.wave === 10 ? 150 : 50 }
        : makeEnemyStats(enemyType, cfg, s);
      s.enemies.push({
        id: uid(), type: enemyType, x: rand(s.w*.12, s.w*.88), y: isBoss ? 30 : 42,
        hp: st.hp, maxHp: st.hp, atk: st.atk, cd: 0, exp: st.exp || 10,
        speed: st.speed, flash:0, frozen:0, animSeed: Math.random() * 4,
        boss: isBoss, finalBoss: isBoss && s.wave === 10, radius: st.radius,
        shieldHp: st.shield || 0, maxShieldHp: st.shield || 0,
        stopY: st.stopY || 0, shootCd: st.shootCd || 0, projectileDamage: st.projectileDamage || 0, projectileSpeed: st.projectileSpeed || 0,
        chargeStopY: st.chargeStopY || 0, chargeDuration: st.chargeDuration || 5, chargeTimer: 0, chargeState: st.chargeStopY ? 'moving' : '', rushSpeed: st.rushSpeed || 0,
        bossCenterX: s.w / 2, bossMovePhase: Math.random() * Math.PI * 2, bossMoveAmp: s.w * .25, bossMoveTime: 0,
        skillCd: isBoss ? 5 : 0, skillState: '', skillTimer: 0, skillDuration: 0, shielded: false, hurtAnim: 0, fireSpawned: 0,
        defense: st.defense || 0, broken: false, summonBatchId: '', summonBatchAlive: 0,
      });
      s.waveSpawned++;
    }
    function gainExp(s, amount) {
      if (s.gameOver || s.upgrading) return;
      if (s.tutorialActive && s.tutorialStep !== 3) {
        s.exp = Math.min((s.level * 80) - 1, s.exp + amount);
        setUi(v => ({ ...v, exp: s.exp, expNeed: s.level * 80, level: s.level }));
        return;
      }
      s.exp += amount;
      let need = s.level * 80;
      if (s.exp >= need) {
        s.exp -= need;
        s.level += 1;
        s.upgradeOptions = drawUpgradeOptions();
        // 升級視窗延後到玩家沒有施法、也沒有選中武器方塊時才彈出，避免打斷連段。
        if (s.isDrawing || selectedRef.current) {
          s.pendingLevelUp = true;
          setUi(v => ({ ...v, level: s.level, exp: s.exp, expNeed: s.level * 80, upgrading: false, upgradeOptions: s.upgradeOptions }));
        } else {
          s.upgrading = true;
          if (s.tutorialActive) s.tutorialStep = 5;
          playSfxCooldown(s, 'levelUp', 500, 0.95);
          s.floatTexts.push({ id: uid(), text: 'Level Up！', x: s.w / 2, y: s.battleH * .45, vy: -6, life: 1.1, color: '#fff4b8', size: 34, glow: true });
          setUi(v => ({ ...v, level: s.level, exp: s.exp, expNeed: s.level * 80, upgrading: true, upgradeOptions: s.upgradeOptions, tutorialStep: s.tutorialStep || v.tutorialStep, tutorialText: tutorialTexts[s.tutorialStep]?.text || v.tutorialText, tutorialHighlight: tutorialTexts[s.tutorialStep]?.highlight || v.tutorialHighlight, nodeIndex: s.nodeIndex || 0, shopOpen: s.shopOpen || false, shopItems: s.shopItems || [], shopMessage: s.shopMessage || '', replaceOffer: s.replaceOffer || null, shopBoughtFx: s.shopBoughtFx || 0 }));
        }
      } else {
        setUi(v => ({ ...v, exp: s.exp, expNeed: s.level * 80, level: s.level }));
      }
    }

    function spawnTutorialMob(s, idx) {
      const hp = Math.ceil(18 * 1.5);
      s.enemies.push({
        id: uid(), type: idx % 2 === 0 ? 'ZOM' : 'MON', x: rand(s.w * .15, s.w * .85), y: 42 + rand(-8, 8),
        hp, maxHp: hp, atk: 3, cd: 0,
        speed: (s.battleH - 86) / 18 * (idx % 2 === 0 ? 1 : 1.25),
        flash: 0, frozen: 0, animSeed: Math.random() * 4,
        boss: false, finalBoss: false, radius: idx % 2 === 0 ? 13 : 11,
      });
    }

    function beginTutorialWave(s, type) {
      s.tutorialSpawned = true;
      s.enemies = [];
      const count = type === 'sword' ? 1 : type === 'energy' ? 1 : 2;
      for (let i = 0; i < count; i++) {
        spawnTutorialMob(s, i);
        const e = s.enemies[s.enemies.length - 1];
        if (e) { e.x = s.w * (count === 1 ? .5 : (i === 0 ? .42 : .58)); e.y = s.battleH - 300 + i * 18; }
      }
      s.floatTexts.push({ id: uid(), text: type === 'sword' ? '練習斬擊！' : type === 'shield' ? '盾牌練習！' : type === 'bow' ? '弓箭練習！' : '充能練習！', x: s.w / 2, y: 105, vy: -10, life: 1, color: '#fff3a3', size: 26, glow: true });
    }

    function updateTutorialPassive(s, dt) {
      s.hitEffects.forEach(h=>{ h.age += dt; h.life -= dt; });
      s.hitEffects = s.hitEffects.filter(h=>h.life>0);
      s.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;});
      s.particles=s.particles.filter(p=>p.life>0);
      s.floatTexts.forEach(f=>{f.y+=f.vy*dt;f.life-=dt;});
      s.floatTexts=s.floatTexts.filter(f=>f.life>0);
    }

    function resetTutorialStepOnFail(s) {
      // 教學失誤時回到上一個可理解的操作步驟，避免怪物撞基地後流程卡住。
      s.floatTexts.push({ id: uid(), text: '再試一次！', x: s.w / 2, y: 110, vy: -12, life: 1, color: '#fff3a3', size: 24, glow: true });
      s.enemies = [];
      s.weapons = [];
      s.shieldShots = [];
      s.slashes = [];
      s.path = [];
      s.multiPaths = [];
      s.isDrawing = false;
      s.drawTime = 0;
      s.tutorialAdvancePending = '';
      s.tutorialAdvanceDelay = 0;
      selectedRef.current = null;
      if ([2, 3].includes(s.tutorialStep)) {
        s.tutorialStep = 1;
        s.tutorialSpawned = false;
        s.tutorialIntroSpawned = false;
        queueRef.current = [];
      } else if ([80].includes(s.tutorialStep)) {
        startTutorialPractice('shield', 8);
        return;
      } else if ([90].includes(s.tutorialStep)) {
        // 若弓箭命中後正在切到能量教學，不要因殘留怪物/點擊狀態又跳回弓箭教學。
        if (s.tutorialAdvancePending === 'bow' || s.tutorialPracticeType === 'energy') {
          s.tutorialStep = 10;
          s.tutorialSpawned = false;
          s.weaponEnergy = 90;
          queueRef.current = [];
        } else {
          startTutorialPractice('bow', 9);
          return;
        }
      } else if ([10, 11].includes(s.tutorialStep)) {
        // 能量教學失誤只重開能量教學，不回退到弓箭教學。
        s.tutorialStep = 10;
        s.tutorialPracticeType = 'energy';
        s.tutorialSpawned = false;
        s.weaponEnergy = 90;
        queueRef.current = [];
      }
      setUi(v => ({ ...v, queue: queueRef.current, selected: null, tutorialStep: s.tutorialStep, tutorialText: tutorialTexts[s.tutorialStep]?.text || v.tutorialText, tutorialHighlight: tutorialTexts[s.tutorialStep]?.highlight || v.tutorialHighlight, weaponEnergy: s.weaponEnergy || v.weaponEnergy, drawing: false, timer: 0 }));
    }

    function tutorialUpdate(s, dt) {
      if (s.tutorialStepGrace) s.tutorialStepGrace = Math.max(0, s.tutorialStepGrace - dt);
      // 回傳 true 代表教學此步驟要完全暫停戰鬥時間，只保留動畫與 UI。
      if (s.tutorialStep === 0) {
        if (!s.tutorialIntroSpawned) {
          s.enemies = [];
          const hp = Math.ceil(18 * 1.5);
          s.enemies.push({
            id: uid(), type: 'ZOM', x: s.w * .5, y: s.battleH * .28,
            hp, maxHp: hp, atk: 3, cd: 0,
            speed: 0, flash: 0, frozen: 0, animSeed: Math.random() * 4,
            boss: false, finalBoss: false, radius: 13, tutorialTargetY: s.battleH - 285,
          });
          s.tutorialIntroSpawned = true;
          s.tutorialStepTimer = 0;
          s.wave = 1;
          s.waveState = 'tutorial';
          s.waveTotal = 1;
          s.waveSpawned = 1;
          syncTutorialUi(0);
        }
        s.tutorialStepTimer += dt;
        const e = s.enemies[0];
        if (e && s.tutorialStepTimer < 1.1) e.y = lerp(e.y, e.tutorialTargetY || (s.battleH - 285), Math.min(1, dt * 2.8));
        if (s.tutorialStepTimer >= 1.35) {
          s.tutorialStep = 1;
          s.tutorialStepTimer = 0;
          tutorialSetQueue('sword', 1);
          syncTutorialUi(1);
        }
        return true;
      }

      if (s.tutorialStep === 1 || s.tutorialStep === 6 || s.tutorialStep === 7 || s.tutorialStep === 12 || s.tutorialStep === 13) {
        return true;
      }
      if (s.tutorialStep === 10) {
        if (!s.tutorialSpawned) {
          s.weaponEnergy = 90;
          s.tutorialPracticeType = 'energy';
          s.tutorialWeaponPicked = false;
          queueRef.current = ['sword','shield','bow'].map(type => ({ id: uid(), type, tier: 1, born: Date.now() }));
          selectedRef.current = null;
          setUi(v => ({ ...v, weaponEnergy: 90, queue: queueRef.current, selected: null, tutorialStep: 10, tutorialText: tutorialTexts[10].text, tutorialHighlight: tutorialTexts[10].highlight }));
          beginTutorialWave(s, 'energy');
        }
        // 先暫停，讓玩家看懂能量條與方塊提示；點任意武器後才進入 step11 開始實戰。
        return true;
      }
      // 劍：點下武器後 step2 直接讓怪物開始移動，玩家可立即畫線。
      if (s.tutorialStep === 2) return false;
      // 盾 / 弓：先停住顯示「點武器方塊」教學；玩家點方塊後才進入實際操作步驟。
      if (s.tutorialStep === 8 || s.tutorialStep === 9) {
        if (!s.tutorialSpawned) beginTutorialWave(s, s.tutorialStep === 8 ? 'shield' : 'bow');
        // 強制autoWeapon只補對應武器
        const practiceType = s.tutorialStep === 8 ? 'shield' : 'bow';
        s.autoWeapon += dt;
        if (s.autoWeapon >= 1.2) {
          if (queueRef.current.length < 4) {
            normalizeQueuePreservingSelection([...queueRef.current, { id: uid(), type: practiceType, tier: 1, born: Date.now() }]);
            setUi(v => ({ ...v, queue: queueRef.current }));
          }
          s.autoWeapon = 0;
        }
        return true;
      }

      if (![3, 80, 90, 10, 11, 120].includes(s.tutorialStep)) return false;
      if (!s.tutorialSpawned) beginTutorialWave(s, s.tutorialPracticeType || (s.tutorialStep === 80 ? 'shield' : s.tutorialStep === 90 ? 'bow' : 'sword'));
      const forcedType = s.tutorialPracticeType === 'energy'
        ? null
        : (s.tutorialPracticeType || (s.tutorialStep === 80 || s.tutorialStep === 120 ? 'shield' : s.tutorialStep === 90 ? 'bow' : 'sword'));
      s.autoWeapon += dt;
      if (s.autoWeapon >= 0.9) {
        if (forcedType && queueRef.current.length < 7) {
          normalizeQueuePreservingSelection([...queueRef.current, { id: uid(), type: forcedType, tier: 1, born: Date.now() }]);
          setUi(v => ({ ...v, queue: queueRef.current }));
        }
        s.autoWeapon = 0;
      }
      if (s.tutorialAdvancePending) {
        s.tutorialAdvanceDelay = Math.max(0, (s.tutorialAdvanceDelay || 0) - dt);
        if (s.tutorialAdvanceDelay <= 0) {
          const pending = s.tutorialAdvancePending;
          s.tutorialAdvancePending = '';
          s.tutorialAdvanceDelay = 0;
          s.enemies = [];
          s.weapons = [];
          s.shieldShots = [];
          s.slashes = [];
          s.path = [];
          s.isDrawing = false;
          selectedRef.current = null;
          if (pending === 'shield') {
            s.tutorialShieldDone = true;
            tutorialSetQueue('bow', 1);
            s.tutorialStep = 9;
            s.tutorialWeaponPicked = false;
            s.tutorialSpawned = false;
            s.waveState = 'tutorial';
            syncTutorialUi(9);
            return true;
          }
          if (pending === 'bow') {
            s.tutorialStep = 10;
            s.tutorialPracticeType = 'energy';
            s.tutorialWeaponPicked = false;
            s.tutorialSpawned = false;
            s.tutorialStepGrace = .45;
            s.autoWeapon = 0;
            queueRef.current = [];
            selectedRef.current = null;
            setUi(v => ({ ...v, queue: [], selected: null, tutorialStep: 10, tutorialText: tutorialTexts[10].text, tutorialHighlight: tutorialTexts[10].highlight, weaponEnergy: 90, drawing: false, timer: 0 }));
            return true;
          }
          if (pending === 'merge') {
            s.tutorialStep = 13;
            s.tutorialSpawned = false;
            s.enemies = [];
            selectedRef.current = null;
            syncTutorialUi(13);
            return true;
          }
        }
      }
      if (s.tutorialSpawned && s.enemies.length === 0) {
        // 命中成功後若已排定教學切換，等待 pending 流程統一切換。
        // 否則同一幀會先因 enemies=0 切一次，1 秒後 pending 又切一次，造成弓/能量教學重複兩次。
        if (s.tutorialAdvancePending) return false;
        if (s.tutorialStep === 3 && !s.upgrading) {
          // 保險：如果剛好沒有因 EXP 進升級，仍強制觸發第一次升級教學。
          s.exp = Math.max(s.exp, s.level * 80);
          gainExp(s, 0);
        } else if (s.tutorialStep === 80) {
          // 盾打完：標記盾已完成，先暫停顯示「點這把弓」
          s.tutorialShieldDone = true;
          tutorialSetQueue('bow', 1);
          s.tutorialStep = 9;
          s.tutorialWeaponPicked = false;
          s.tutorialSpawned = false;
          s.waveState = 'tutorial';
          s.enemies = [];
          syncTutorialUi(9);
        } else if (s.tutorialStep === 90) {
          s.tutorialStep = 10;
          s.tutorialPracticeType = 'energy';
          s.tutorialWeaponPicked = false;
          s.tutorialSpawned = false;
          s.autoWeapon = 0;
          queueRef.current = [];
          selectedRef.current = null;
          setUi(v => ({ ...v, queue: [], selected: null, tutorialStep: 10, tutorialText: tutorialTexts[10].text, tutorialHighlight: tutorialTexts[10].highlight, weaponEnergy: 90 }));
        } else if (s.tutorialStep === 10 || s.tutorialStep === 11) {
          // 能量條教學完成後，進入方塊合成教學。
          // 給玩家 弓 + 盾 + 弓，讓玩家點掉中間的盾後，兩把弓會相鄰並立即合成。
          s.tutorialStep = 12;
          s.tutorialSpawned = false;
          s.tutorialPracticeType = 'shield';
          s.tutorialWeaponPicked = false;
          s.tutorialAdvancePending = '';
          s.tutorialAdvanceDelay = 0;
          s.enemies = [];
          s.weapons = [];
          s.shieldShots = [];
          s.slashes = [];
          queueRef.current = [
            { id: uid(), type: 'bow', tier: 1, born: Date.now() },
            { id: uid(), type: 'shield', tier: 1, born: Date.now() + 1 },
            { id: uid(), type: 'bow', tier: 1, born: Date.now() + 2 },
          ];
          selectedRef.current = null;
          setUi(v => ({ ...v, queue: queueRef.current, selected: null, tutorialStep: 12, tutorialText: tutorialTexts[12].text, tutorialHighlight: tutorialTexts[12].highlight, weaponEnergy: s.weaponEnergy, drawing: false, timer: 0 }));
          setTimeout(() => updateArrow(12), 50);
        }
      }
      return false;
    }



    function stunEnemyByShield(s, e, duration = 1) {
      if (!e || e.hp <= 0) return;
      if (e.type === 'CHARGER' && e.chargeState === 'charging') {
        e.chargeState = 'moving';
        e.chargeTimer = 0;
        e.chargeWarned = false;
        s.floatTexts.push({ id: uid(), text: '蓄力中斷！', x: e.x, y: e.y - 38, vy: -34, life: .65, color: '#d8b4fe', size: 16, glow: true });
      }
      e.stunned = Math.max(e.stunned || 0, duration);
    }

    function applyWeaponSpecialOnHit(s, e, weapon, finalDamage = 0) {
      if (!weapon?.type) return;
      const stats = weapon.stats || s.stats || {};
      const STR = stats.STR || 0, DEX = stats.DEX || 0, VIT = stats.VIT || 0;
      if (weapon.type === 'katana' && STR + DEX > 25) {
        e.bleedTime = Math.max(e.bleedTime || 0, 3);
        e.bleedPct = e.boss ? 0.005 : 0.02;
      }
      if (weapon.type === 'gianthammer') {
        if (VIT > 25) e.wounded = Math.max(e.wounded || 0, 3);
        if (VIT + STR > 55) e.weakpoint = true;
      }
      if (weapon.type === 'holyshield') {
        const wasMarked = (e.holyMark || 0) > 0;
        if (VIT > 30) e.holyMark = Math.max(e.holyMark || 0, 5);
        if (wasMarked && VIT + STR > 55) {
          for (const other of s.enemies) {
            if (other.id !== e.id && Math.hypot(other.x - e.x, other.y - e.y) <= 20 + (other.boss ? 10 : 0)) {
              damageEnemy(s, other, 2 * VIT, '#ffd76a', { type: weapon.type, combo: weapon.combo || 1, stats, noSpecial: true });
            }
          }
          s.floatTexts.push({ id: uid(), text: '聖光爆發', x:e.x, y:e.y-34, vy:-28, life:.55, color:'#ffd76a', size:16, glow:true });
        }
      }
    }

    function damageEnemy(s, e, dmg, color, weapon = null) {
      const stats = weapon?.stats || s.stats || {};
      let finalDmg = dmg * globalDamageMultiplier(stats);
      let crit = false;
      if (weapon?.type && SHIELD_TYPES.has(weapon.type)) stunEnemyByShield(s, e, 1);
      if (e.type === 'CHARGER' && e.chargeState === 'charging') {
        finalDmg *= .05;
        s.floatTexts.push({ id: uid(), text: '蓄力減傷', x: e.x, y: e.y - 36, vy: -30, life: .45, color:'#c4b5fd', size:13, glow:true });
      }
      if (e.boss) {
        if (e.broken) finalDmg *= 1.3;
        const defense = Math.max(0, (e.defense || 0) * (e.broken ? 0.5 : 1));
        if (defense > 0) {
          finalDmg = Math.max(0, finalDmg - defense);
          s.floatTexts.push({ id: uid(), text: `防禦 -${Math.round(defense)}`, x: e.x + rand(-8,8), y: e.y - 56, vy: -34, life: .5, color:'#9ca3af', size:14, glow:true });
        }
        if (finalDmg <= 0 && dmg > 0) {
          finalDmg = 1;
        }
      }
      if ((e.shieldHp || 0) > 0) {
        const shieldDamage = Math.min(e.shieldHp, finalDmg);
        e.shieldHp -= shieldDamage;
        finalDmg -= shieldDamage;
        e.flash = .08;
        s.floatTexts.push({ id: uid(), text: `護盾 -${Math.round(shieldDamage)}`, x: e.x + rand(-8,8), y: e.y - 24, vy: -42, life: .55, color:'#8fb8ff', size:15, glow:true });
        for (let i=0;i<4;i++) s.particles.push({ id: uid(), x:e.x+rand(-18,18), y:e.y+rand(-18,18), vx:rand(-45,45), vy:rand(-45,45), life:.35, color:'#8fb8ff', size:3, glow:true });
        if (e.shieldHp <= 0) s.floatTexts.push({ id: uid(), text: '破盾！', x: e.x, y: e.y - 38, vy: -48, life: .65, color:'#dbeafe', size:18, glow:true });
        if (finalDmg <= 0) return;
      }
      if (e.wounded > 0) finalDmg *= 1.3;
      if (e.weakpoint) { finalDmg *= 2; e.weakpoint = false; crit = true; }
      if (weapon?.type === 'katana' && (stats.STR || 0) + (stats.DEX || 0) > 50 && (e.bleedTime || 0) > 0) {
        finalDmg *= 2;
        finalDmg += e.maxHp * (e.boss ? 0.03 : 0.25);
      }
      const critInfo = critSpec(weapon?.type, stats);
      if (!crit && critInfo.chance > 0 && Math.random() < critInfo.chance) { finalDmg *= critInfo.mult; crit = true; }
      e.hp -= finalDmg; e.flash = .08;
      if (e.boss) { addWeaponCharge(s, 5); playSfxCooldown(s, 'bossHit', 90, 0.85); }
      if (weapon?.type) {
        if (SWORD_TYPES.has(weapon.type)) playSfxCooldown(s, 'swordHit', 55, 0.8);
        else if (SHIELD_TYPES.has(weapon.type)) playSfxCooldown(s, 'shieldHit', 70, 0.8);
        else if (SHOOT_TYPES.has(weapon.type)) playSfxCooldown(s, 'shoot', 55, 0.75);
      }
      applyWeaponSpecialOnHit(s, e, weapon, finalDmg);
      if (e.finalBoss) e.hurtAnim = .18;
      const isTierColor = color === '#c084fc' || color === '#ffd76a';
      s.floatTexts.push({
        id: uid(), text: `${crit ? '暴擊 ' : ''}${Math.round(finalDmg)}`, x: e.x + rand(-8,8), y: e.y - (e.boss ? 34 : 18),
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
      if (s.tutorialActive && !s.tutorialAdvancePending) {
        if (s.tutorialStep === 80 && weapon?.type === 'shield') {
          // 盾牌教學：玩家成功召喚飛盾並命中後，等待施法收尾 + 1 秒再進弓箭教學。
          s.tutorialAdvancePending = 'shield';
          s.tutorialAdvanceDelay = 1.1;
        } else if (s.tutorialStep === 90 && weapon?.type === 'bow') {
          // 弓箭教學：玩家成功命中後，等待演出 + 1 秒再進能量條教學。
          s.tutorialAdvancePending = 'bow';
          s.tutorialAdvanceDelay = 1.1;
        } else if (s.tutorialStep === 120 && weapon?.type === 'shield') {
          // 合成教學：玩家用盾命中後，盾方塊會被消耗，兩把弓相鄰並立即合成。
          s.tutorialAdvancePending = 'merge';
          s.tutorialAdvanceDelay = 1.1;
        }
      }
      const count = (e.boss ? 12 : 7) + (color === '#ffd76a' ? 8 : color === '#c084fc' ? 4 : 0);
      for (let i=0;i<count;i++) s.particles.push({
        id: uid(), x:e.x, y:e.y, vx:rand(-90,90), vy:rand(-90,90),
        life: color === '#ffd76a' ? .5 : color === '#c084fc' ? .42 : .35, color,
        size: color === '#ffd76a' ? rand(3,7) : color === '#c084fc' ? rand(2,6) : 4, glow: isTierColor
      });
    }
    function addWeaponCharge(s, amount = 10) {
      if (!s || s.gameOver) return;
      const gained = amount * chargeMultiplier(s.stats || {});
      s.weaponEnergy = Math.min(100, (s.weaponEnergy || 0) + gained);
      if (s.weaponEnergy >= 100) {
        s.weaponEnergy = 0;
        const created = addWeapon('充能完成！獲得武器');
        if (!created) {
          s.floatTexts.push({ id: uid(), text: '充能完成！武器列已滿', x: s.w / 2, y: s.battleH - 92, vy: -18, life: 1, color: '#7dd3fc', size: 18, glow: true });
        }
        if (s.tutorialActive && s.tutorialStep === 10) {
          s.tutorialStep = 12;
          s.tutorialPracticeType = 'shield';
          s.tutorialStepGrace = .35;
          s.tutorialSpawned = true;
          s.enemies = [];
          spawnTutorialMob(s, 0);
          const mergeEnemy = s.enemies[s.enemies.length - 1];
          if (mergeEnemy) { mergeEnemy.x = s.w * .5; mergeEnemy.y = s.battleH - 300; mergeEnemy.speed = (s.battleH - 86) / 22; }
          selectedRef.current = null;
          queueRef.current = [
            { id: uid(), type: 'bow', tier: 1, born: Date.now() },
            { id: uid(), type: 'shield', tier: 1, born: Date.now() },
            { id: uid(), type: 'bow', tier: 1, born: Date.now() },
          ];
          setUi(v => ({ ...v, queue: queueRef.current, selected: null, tutorialStep: 12, tutorialText: tutorialTexts[12].text, tutorialHighlight: tutorialTexts[12].highlight, weaponEnergy: s.weaponEnergy }));
        }
      }
    }

    function bomberExplode(s, e, hitBase = false) {
      if (!e.explodeRadius || e.exploded) return;
      e.exploded = true;
      s.floatTexts.push({ id: uid(), text: '爆炸！', x:e.x, y:e.y-26, vy:-34, life:.7, color:'#ff7a3d', size:20, glow:true });
      for (let i=0;i<28;i++) s.particles.push({ id: uid(), x:e.x, y:e.y, vx:rand(-210,210), vy:rand(-210,210), life:rand(.25,.65), color:i%2?'#ff7a3d':'#ffd15c', size:rand(3,6), glow:true });
      // 自爆怪死亡時只做範圍視覺與擊退；碰到基地時才扣基地血，避免玩家擊殺反而被懲罰。
      if (hitBase && !s.tutorialActive) s.allyHp -= e.explodeBaseDamage || 8;
      for (const other of s.enemies) {
        if (other.id === e.id || other.boss || other.hp <= 0) continue;
        const d = Math.hypot(other.x - e.x, other.y - e.y);
        if (d <= e.explodeRadius) other.y = Math.max(34, other.y - 36);
      }
    }

    function killEnemy(s, e) {
      playSfxCooldown(s, 'monsterDie', e.boss ? 260 : 80, e.boss ? 0.95 : 0.8);
      s.kills++;
      const isBossSummon = !!e.summonOwner;
      if (isBossSummon) {
        addWeaponCharge(s, 30);
        const owner = s.enemies.find(x => x.id === e.summonOwner && x.boss);
        if (owner && e.summonBatchId && owner.summonBatchId === e.summonBatchId) {
          owner.summonBatchAlive = Math.max(0, (owner.summonBatchAlive || 0) - 1);
          if (owner.summonBatchAlive === 0) {
            owner.broken = true;
            owner.shielded = false; // no boss invulnerability
            s.floatTexts.push({ id: uid(), text: 'BOSS 破防！防禦-50% 受傷+30%', x: owner.x, y: owner.y - 58, vy: -22, life: 1.2, color:'#ffdf6e', size:22, glow:true });
          }
        }
      } else if (!e.boss) addWeaponCharge(s, 10);
      // Boss 召喚物（蝙蝠 / 火球）不給經驗；特殊怪使用各自 EXP。
      if (e.boss) gainExp(s, 100);
      else if (!isBossSummon) gainExp(s, e.exp || 10);
      const n = e.boss ? 36 : 14;
      for (let i=0;i<n;i++) s.particles.push({ id: uid(), x:e.x, y:e.y, vx:rand(-160,160), vy:rand(-160,160), life:.65, color:e.boss ? '#ffdf6e' : e.type === 'RUSHER' ? '#ff4d4d' : e.type === 'CHARGER' ? '#a78bfa' : '#ffcc99' });
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
      if (s.shopOpen) {
        setUi(v => ({ ...v, shopOpen: true, shopItems: s.shopItems || [], shopMessage: s.shopMessage || '', replaceOffer: s.replaceOffer || null, kills: s.kills, allyHp: Math.ceil(s.allyHp), bag: [...bagRef.current], nodeIndex: s.nodeIndex || 0 }));
        return;
      }
      if (s.forceFinishCast) {
        forceFinishCurrentCastAndSelectNext(s);
      }
      if (showPendingLevelUpIfReady(s)) return;
      if (s.isDrawing) {
        s.drawTime -= dt;
        setUi(v => ({ ...v, timer: Math.max(0, s.drawTime) }));
        if (s.drawTime <= 0) {
          launchWeapon();
          s.isDrawing = false;
          s.aimMode = '';
          s.pointerId = null;
          setUi(v => ({ ...v, drawing:false, timer:0 }));
        }
        // 橫斬與飛盾是即時施放型：1秒施放期間戰場不時停，怪物與BOSS照常移動。
        if (!['swipeSlash', 'shieldClick'].includes(s.aimMode)) return;
      }
      if (s.tutorialActive) {
        const freezeTutorial = tutorialUpdate(s, dt);
        if (freezeTutorial) {
          updateTutorialPassive(s, dt);
          setUi(v => ({ ...v, kills:s.kills, allyHp:Math.max(0,Math.ceil(s.allyHp)), weaponEnergy: s.weaponEnergy || 0, wave:s.wave || 1, waveState:s.waveState, rest:0, enemiesLeft:s.enemies.length, level:s.level, exp:s.exp, expNeed:s.level * 80, upgrading:s.upgrading, upgradeOptions:s.upgradeOptions, gameOver:s.gameOver, classChosen:true, playerClass:s.playerClass, stats:s.stats || WARRIOR.stats, bag:[...bagRef.current], bagCapacity: WARRIOR.bagCapacity, showBag: s.showBag || false, tutorialActive:true, tutorialStep:s.tutorialStep || 0, tutorialWeaponPicked: s.tutorialWeaponPicked || false, tutorialText:tutorialTexts[s.tutorialStep]?.text || v.tutorialText, tutorialHighlight:tutorialTexts[s.tutorialStep]?.highlight || v.tutorialHighlight }));
          return;
        }
      } else {
        s.baseRegenTimer = (s.baseRegenTimer || 0) + dt;
        if (s.baseRegenTimer >= 10) {
          s.baseRegenTimer -= 10;
          const heal = baseRegenPerTick(s.stats || {});
          if (heal > 0 && (s.allyHp || 0) < 100) {
            s.allyHp = Math.min(100, (s.allyHp || 0) + heal);
            s.floatTexts.push({ id: uid(), text: `基地 +${heal.toFixed(1)}`, x: s.w / 2, y: s.battleH - 72, vy: -18, life: .8, color:'#86efac', size:16, glow:true });
          }
        }

        s.autoWeapon += dt;
        const spawnInterval = blockSpawnInterval(s.stats || {});
        if (s.autoWeapon >= spawnInterval) {
          // 滿格時不生成也不重置計時；一有空位就會立刻補進新武器。
          if (addWeapon()) s.autoWeapon = 0;
        }

        if (s.waveState === 'rest') {
          s.restTime -= dt;
          if (s.restTime <= 3 && s.restTime + dt > 3) s.floatTexts.push({ id: uid(), text: `下一波倒數 3`, x: s.w/2, y: 120, vy: -8, life: .9, color:'#fff6a8', size:28 });
          if (s.restTime <= 2 && s.restTime + dt > 2) s.floatTexts.push({ id: uid(), text: `2`, x: s.w/2, y: 120, vy: -8, life: .9, color:'#fff6a8', size:32 });
          if (s.restTime <= 1 && s.restTime + dt > 1) s.floatTexts.push({ id: uid(), text: `1`, x: s.w/2, y: 120, vy: -8, life: .9, color:'#fff6a8', size:32 });
          if (s.restTime <= 0) startCurrentNode(s);
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
      }

      for (const e of s.enemies) {
        e.flash = Math.max(0, e.flash - dt);
        e.hurtAnim = Math.max(0, (e.hurtAnim || 0) - dt);
        e.cd -= dt;
        e.frozen = Math.max(0, e.frozen - dt);
        e.stunned = Math.max(0, (e.stunned || 0) - dt);
        e.wounded = Math.max(0, (e.wounded || 0) - dt);
        e.holyMark = Math.max(0, (e.holyMark || 0) - dt);
        if ((e.bleedTime || 0) > 0) {
          e.bleedTime = Math.max(0, e.bleedTime - dt);
          e.hp -= e.maxHp * (e.bleedPct || 0) * dt;
        }
        if (e.boss && (e.stunned || 0) <= 0) {
          const activeSummons = s.enemies.some(x => x.summonOwner === e.id && x.hp > 0);
          if (e.finalBoss) {
            e.shielded = false; // no boss invulnerability
            e.skillCd -= dt;
            if (e.skillState === 'summoning') {
              e.skillTimer += dt;
              if (e.skillTimer >= e.skillDuration) {
                e.skillState = '';
                e.skillTimer = 0;
                for (let i = 0; i < 8; i++) spawnBat(s, e, i);
                e.shielded = false; // no boss invulnerability
              }
            } else if (e.skillCd <= 0 && !activeSummons) {
              beginFinalBossSummon(s, e);
              e.skillCd = 5;
            }
          } else if (s.wave === 5) {
            const activeFireballs = s.enemies.some(x => x.summonOwner === e.id && x.hp > 0);
            e.shielded = false; // no boss invulnerability
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
                e.shielded = false; // no boss invulnerability
              }
            } else if (e.skillCd <= 0 && !activeFireballs) {
              castDBossFire(s, e);
              e.skillCd = 5;
            }
          }
        }

        if (e.frozen <= 0 && (e.stunned || 0) <= 0) {
          if (e.boss) {
            // 第 5 / 第 10 波 BOSS 不再一路往基地衝。
            // 先進場到戰場上方 1/4 附近，之後左右巡航並持續施放技能。
            const targetY = s.battleH * .25;
            if (e.y < targetY) {
              e.y = Math.min(targetY, e.y + e.speed * dt);
            } else {
              e.y = targetY;
              // BOSS 左右移動時間只在遊戲未時停時累積，避免玩家畫線時 BOSS 累積相位，解除時停後瞬移。
              e.bossMoveTime = (e.bossMoveTime || 0) + dt;
              e.x = clamp((e.bossCenterX || s.w / 2) + Math.sin(e.bossMoveTime * 1.15 + (e.bossMovePhase || 0)) * (e.bossMoveAmp || s.w * .25), 56, s.w - 56);
            }
          } else if (e.type === 'BAT' || e.type === 'FIREBALL') {
            const dy = Math.max(1, (s.battleH - 28) - e.y);
            const dx = ((e.targetX || e.x) - e.x) / dy;
            e.x += dx * e.speed * dt + Math.sin(s.animTime * 5 + (e.driftPhase || 0)) * (e.driftAmp || 0) * dt;
            e.y += e.speed * (s.berserkActive ? 1.3 : 1) * ((e.holyMark || 0) > 0 ? 0.5 : 1) * dt;
          } else if (e.type === 'RANGED') {
            const targetY = e.stopY || s.battleH * .42;
            if (e.y < targetY) e.y += e.speed * (s.berserkActive ? 1.3 : 1) * dt;
            else {
              e.y = targetY;
              e.x += Math.sin(s.animTime * 1.7 + e.animSeed) * 10 * dt;
              e.shootCd -= dt;
              if (e.shootCd <= 0) {
                e.shootCd = 5;
                s.enemyProjectiles = s.enemyProjectiles || [];
                s.enemyProjectiles.push({ id: uid(), x:e.x, y:e.y+10, vy:e.projectileSpeed || 130, damage:e.projectileDamage || 3, radius:5, life:5 });
                s.floatTexts.push({ id: uid(), text:'射擊', x:e.x, y:e.y-28, vy:-22, life:.45, color:'#ffdf6e', size:14, glow:true });
              }
            }
          } else if (e.type === 'CHARGER') {
            const stopY = e.chargeStopY || s.battleH - 150;
            if (e.chargeState === 'rushing') {
              e.y += (e.rushSpeed || e.speed * 3) * (s.berserkActive ? 1.3 : 1) * dt;
            } else if (e.y < stopY) {
              e.chargeState = 'moving';
              e.y += e.speed * (s.berserkActive ? 1.3 : 1) * dt;
            } else {
              e.y = stopY;
              e.chargeState = 'charging';
              e.chargeTimer = (e.chargeTimer || 0) + dt;
              if (!e.chargeWarned) {
                e.chargeWarned = true;
                s.floatTexts.push({ id: uid(), text:'蓄力中！', x:e.x, y:e.y-32, vy:-22, life:.65, color:'#a78bfa', size:15, glow:true });
              }
              if (e.chargeTimer >= (e.chargeDuration || 5)) {
                e.chargeState = 'rushing';
                s.floatTexts.push({ id: uid(), text:'衝鋒！', x:e.x, y:e.y-34, vy:-26, life:.65, color:'#ff6b6b', size:17, glow:true });
              }
            }
          } else {
            e.y += e.speed * (s.berserkActive ? 1.3 : 1) * dt;
          }
        }
        if (!e.boss && e.y > s.battleH - 28) {
          if (s.tutorialActive) {
            e.hp = 0;
            e.reachedBase = true;
            resetTutorialStepOnFail(s);
          } else {
            s.allyHp -= e.atk || (e.type === 'BAT' ? 5 : e.type === 'FIREBALL' ? 5 : 1);
            e.hp = 0;
            e.reachedBase = true;
          }
        }
      }
      s.enemyProjectiles = s.enemyProjectiles || [];
      for (const pr of s.enemyProjectiles) {
        pr.y += pr.vy * dt;
        pr.life -= dt;
        if (pr.y >= s.battleH - 32 && !s.tutorialActive) {
          s.allyHp -= pr.damage || 3;
          pr.life = 0;
          for (let i=0;i<10;i++) s.particles.push({ id: uid(), x:pr.x, y:s.battleH-34, vx:rand(-80,80), vy:rand(-120,-20), life:.45, color:'#ffdf6e', size:3, glow:true });
          s.floatTexts.push({ id: uid(), text:`基地 -${pr.damage || 3}`, x:pr.x, y:s.battleH-54, vy:-26, life:.6, color:'#ffdf6e', size:15, glow:true });
        }
      }
      s.enemyProjectiles = s.enemyProjectiles.filter(pr => pr.life > 0 && pr.y < s.battleH + 30);
      s.enemies = s.enemies.filter(e=>{ if(e.hp<=0){ if(e.y<=s.battleH-28) killEnemy(s,e); return false;} return true; });
      s.zones = s.zones || [];
      for (const z of s.zones) {
        z.life -= dt; z.tick -= dt;
        if (z.tick <= 0) {
          z.tick += 1;
          for (const e of s.enemies) {
            if (Math.hypot(e.x - z.x, e.y - z.y) <= z.radius + (e.boss ? 10 : 0)) {
              damageEnemy(s, e, z.damage, z.color || '#ffd76a', { type: z.type, combo: 1, stats: z.stats });
            }
          }
        }
      }
      s.zones = s.zones.filter(z => z.life > 0);
      for (const sl of (s.slashes || [])) {
        sl.age = (sl.age || 0) + dt;
        sl.life -= dt;
        sl.x += (sl.vx || 0) * dt;
        const slashHitWidth = sl.type === 'greatsword' ? 54 : 42;
        for (const e of s.enemies) {
          if (e.hp <= 0 || sl.hitIds?.includes(e.id)) continue;
          if (e.y >= sl.top && e.y <= s.battleH - 8 && Math.abs(e.x - sl.x) <= slashHitWidth + (e.boss ? 16 : 0)) {
            damageEnemy(s, e, sl.damage, sl.color, { type: sl.type, combo: sl.tier, stats: sl.stats });
            sl.hitIds.push(e.id);
          }
        }
      }
      s.slashes = (s.slashes || []).filter(sl => sl.life > 0 && sl.x > -120 && sl.x < s.w + 120);
      for (const shot of (s.shieldShots || [])) {
        shot.age += dt;
        let target = s.enemies.find(e => e.id === shot.targetId && e.hp > 0);
        if (!target) {
          target = nearestEnemy(s, shot.x, shot.y, new Set(shot.hitIds), shot.bounceRange || Infinity);
          if (target) shot.targetId = target.id;
        }
        if (!target) { shot.done = true; continue; }
        const dx = target.x - shot.x, dy = target.y - shot.y;
        const d = Math.max(1, Math.hypot(dx, dy));
        const step = shot.speed * dt;
        if (d <= step) {
          shot.x = target.x; shot.y = target.y;
          damageEnemy(s, target, shot.damage, shot.color, { type: shot.type, combo: shot.combo, stats: shot.stats });
          const base = WEAPONS[shot.type];
          shot.hitIds.push(target.id);
          if (shot.bouncesLeft > 0) {
            const nextTarget = nearestEnemy(s, target.x, target.y, new Set(shot.hitIds), shot.bounceRange);
            if (nextTarget) { shot.targetId = nextTarget.id; shot.bouncesLeft--; }
            else shot.done = true;
          } else shot.done = true;
        } else {
          shot.x += dx / d * step;
          shot.y += dy / d * step;
        }
      }
      s.shieldShots = (s.shieldShots || []).filter(sh => !sh.done && sh.age < 3);
      for (const w of s.weapons) {
        const base=WEAPONS[w.type]; const next=w.path[w.seg+1]; const cur=w.path[w.seg];
        if(!next){ w.done=true; continue; }
        const len=Math.max(1, dist(cur,next)); w.t += base.speed*dt/len;
        while(w.t>=1 && w.seg < w.path.length-2){ w.t-=1; w.seg++; }
        if (w.seg >= w.path.length - 2 && w.t >= 1) {
          if (base.returnPath && (w.stats?.DEX || 0) > 20 && !w.returning) {
            w.path = [...w.path].reverse(); w.seg = 0; w.t = 0; w.returning = true; w.hitCd = {}; w.hitIds = [];
          } else { w.t = 1; w.done = true; }
        }
        const p0=w.path[w.seg], p1=w.path[w.seg+1] || p0; w.x=lerp(p0.x,p1.x,clamp(w.t,0,1)); w.y=lerp(p0.y,p1.y,clamp(w.t,0,1));
        w.trail.push({x:w.x,y:w.y,life:.35}); w.trail.forEach(t=>t.life-=dt); w.trail=w.trail.filter(t=>t.life>0).slice(-18);
        for (const key of Object.keys(w.hitCd)) w.hitCd[key] = Math.max(0, w.hitCd[key] - dt);
        for(const e of s.enemies){
          const hitKey = String(e.id);
          const swordSingleHit = SWORD_TYPES.has(w.type);
          if (swordSingleHit && w.hitIds?.includes(e.id)) continue;
          if((!swordSingleHit && (w.hitCd[hitKey] || 0) <= 0 || swordSingleHit) && Math.hypot(e.x-w.x,e.y-w.y)<=w.radius + (e.boss ? 10 : 0)){
            if (swordSingleHit) w.hitIds = [...(w.hitIds || []), e.id];
            else w.hitCd[hitKey] = 0.12;
            damageEnemy(s,e,w.damage,w.damageColor || base.color,w);
            if(base.freeze) e.frozen=Math.max(e.frozen,base.freeze);
          }
        }
      }
      s.weapons = s.weapons.filter(w=>!w.done);
      s.hitEffects.forEach(h=>{ h.age += dt; h.life -= dt; });
      s.hitEffects = s.hitEffects.filter(h=>h.life>0);
      s.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;}); s.particles=s.particles.filter(p=>p.life>0);
      s.floatTexts.forEach(f=>{f.y+=f.vy*dt;f.life-=dt;}); s.floatTexts=s.floatTexts.filter(f=>f.life>0);
      if(s.allyHp<=0) s.gameOver='我方基地陷落';
      setUi(v => ({ ...v, kills:s.kills, allyHp:Math.max(0,Math.ceil(s.allyHp)), weaponEnergy: s.weaponEnergy || 0, wave:s.wave, waveState:s.waveState, rest:Math.max(0,Math.ceil(s.restTime)), enemiesLeft:Math.max(0, s.waveTotal - s.waveSpawned + s.enemies.length), level:s.level, exp:s.exp, expNeed:s.level * 80, upgrading:s.upgrading, upgradeOptions:s.upgradeOptions, gameOver:s.gameOver, classChosen:s.classChosen, playerClass:s.playerClass, stats:s.stats || WARRIOR.stats, bag:[...bagRef.current], bagCapacity: WARRIOR.bagCapacity, showBag: s.showBag || false, tutorialActive: s.tutorialActive || false, tutorialStep: s.tutorialStep || 0, tutorialWeaponPicked: s.tutorialWeaponPicked || false, tutorialText: tutorialTexts[s.tutorialStep]?.text || v.tutorialText, tutorialHighlight: tutorialTexts[s.tutorialStep]?.highlight || v.tutorialHighlight, nodeIndex: s.nodeIndex || 0, shopOpen: s.shopOpen || false, shopItems: s.shopItems || [], shopMessage: s.shopMessage || '', replaceOffer: s.replaceOffer || null, shopBoughtFx: s.shopBoughtFx || 0 }));
    }

    function render() {
      const s=stateRef.current; ctx.clearRect(0,0,s.w,s.h);
      const g=ctx.createLinearGradient(0,0,0,s.battleH);
      g.addColorStop(0,'#111827');
      g.addColorStop(.58,'#172554');
      g.addColorStop(1,'#0f172a');
      ctx.fillStyle=g;
      ctx.fillRect(0,0,s.w,s.battleH);
      ctx.fillStyle='rgba(255,255,255,.035)';
      for (let y = 72; y < s.battleH - 70; y += 48) ctx.fillRect(0, y, s.w, 1);
      for (let x = 32; x < s.w; x += 48) ctx.fillRect(x, 42, 1, s.battleH - 96);
      const rg=ctx.createRadialGradient(s.w/2,s.battleH*.45,20,s.w/2,s.battleH*.45,s.battleH*.72); rg.addColorStop(0,'rgba(255,255,255,.07)'); rg.addColorStop(1,'rgba(0,0,0,.28)'); ctx.fillStyle=rg; ctx.fillRect(0,0,s.w,s.battleH);
      ctx.fillStyle='rgba(255,255,255,.10)'; ctx.fillRect(s.w*.06,42,s.w*.010,s.battleH-92); ctx.fillRect(s.w*.93,42,s.w*.010,s.battleH-92);
      ctx.fillStyle=s.berserkActive ? 'rgba(150,35,25,.62)' : 'rgba(80,30,30,.40)'; ctx.fillRect(0,0,s.w,42); ctx.fillStyle='#ffd6d6'; ctx.font='bold 15px system-ui'; ctx.textAlign='center'; ctx.fillText(s.waveState === 'rest' ? `休息中：${Math.max(0,Math.ceil(s.restTime))} 秒` : `剩餘 ${Math.max(0, s.waveTotal - s.waveSpawned + s.enemies.length)}${s.berserkActive ? '  狂暴中' : ''}`,s.w/2,28);
      const boss = s.enemies.find(e => e.boss && e.hp > 0);
      if (boss) {
        const ratio = clamp(boss.hp / boss.maxHp, 0, 1);
        const barY = 72;
        const barH = 26;
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
      const energyRatio = clamp((s.weaponEnergy || 0) / 100, 0, 1);
      ctx.save();
      ctx.fillStyle='rgba(2,8,23,.72)'; ctx.fillRect(10,s.battleH-57,s.w-20,7);
      const energyG=ctx.createLinearGradient(10,s.battleH-57,s.w-10,s.battleH-57); energyG.addColorStop(0,'#2563eb'); energyG.addColorStop(1,'#7dd3fc');
      ctx.fillStyle=energyG; ctx.shadowColor='#38bdf8'; ctx.shadowBlur=8; ctx.fillRect(10,s.battleH-57,(s.w-20)*energyRatio,7);
      ctx.shadowBlur=0; ctx.strokeStyle='rgba(255,255,255,.38)'; ctx.lineWidth=1; ctx.strokeRect(10,s.battleH-57,s.w-20,7);
      ctx.restore();
      const baseHpRatio = clamp(s.allyHp / 100, 0, 1);
      const baseG=ctx.createLinearGradient(0,s.battleH-52,0,s.battleH); baseG.addColorStop(0,'#19345f'); baseG.addColorStop(1,'#0f244a'); ctx.fillStyle=baseG; ctx.fillRect(0,s.battleH-46,s.w,40);
      ctx.fillStyle='rgba(120,15,20,.88)'; ctx.fillRect(10,s.battleH-35,s.w-20,16);
      const hpG=ctx.createLinearGradient(10,s.battleH-35,s.w-10,s.battleH-35); hpG.addColorStop(0,'#2f7dff'); hpG.addColorStop(1,'#68d7ff'); ctx.fillStyle=hpG; ctx.fillRect(10,s.battleH-35,(s.w-20)*baseHpRatio,16);
      ctx.fillStyle='rgba(255,255,255,.22)'; ctx.fillRect(10,s.battleH-35,(s.w-20)*baseHpRatio,4);
      ctx.strokeStyle='rgba(255,255,255,.55)'; ctx.lineWidth=2; ctx.strokeRect(10,s.battleH-35,s.w-20,16);
      ctx.fillStyle='#dff4ff'; ctx.font='bold 15px system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.strokeStyle='rgba(0,0,0,.75)'; ctx.lineWidth=4; const baseLabel=`我方基地 HP ${Math.max(0,Math.ceil(s.allyHp))}/100`; ctx.strokeText(baseLabel,s.w/2,s.battleH-27); ctx.fillText(baseLabel,s.w/2,s.battleH-27);
      ctx.fillStyle='rgba(255,255,255,.15)'; ctx.fillRect(0,s.battleH/2-1,s.w,2);
      s.enemies.forEach(e=>drawEnemySprite(ctx, s, e));
      for (const pr of (s.enemyProjectiles || [])) {
        ctx.save();
        ctx.globalAlpha = .95;
        ctx.fillStyle = '#ffdf6e';
        ctx.shadowColor = '#ffdf6e';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, pr.radius || 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = .35;
        ctx.fillRect(pr.x - 2, pr.y - 18, 4, 18);
        ctx.restore();
      }
      for (const sl of (s.slashes || [])) {
        const progress = clamp((sl.age || 0) / Math.max(.01, (sl.age || 0) + sl.life), 0, 1);
        ctx.save();
        ctx.globalAlpha = .92;
        ctx.strokeStyle = sl.color || '#fff';
        ctx.shadowColor = sl.color || '#fff';
        ctx.shadowBlur = sl.tier >= 3 ? 34 : sl.tier >= 2 ? 24 : 16;
        ctx.lineWidth = sl.type === 'greatsword' ? (sl.tier >= 3 ? 18 : 15) : (sl.tier >= 3 ? 14 : 11);
        ctx.lineCap = 'round';
        const lean = sl.direction > 0 ? 34 : -34;
        const y1 = sl.top + 18;
        const y2 = Math.min(s.battleH - 10, sl.top + sl.depth - 12);
        ctx.beginPath();
        ctx.moveTo(sl.x - lean, y1);
        ctx.lineTo(sl.x + lean, y2);
        ctx.stroke();
        ctx.globalAlpha = .28 * (1 - progress * .35);
        ctx.lineWidth *= 2.1;
        ctx.beginPath();
        ctx.moveTo(sl.x - lean * 1.15, y1);
        ctx.lineTo(sl.x + lean * 1.15, y2);
        ctx.stroke();
        ctx.restore();
      }
      for (const sh of (s.shieldShots || [])) {
        const base = WEAPONS[sh.type] || WEAPONS.shield;
        const img = weaponSheetImgs[sh.type] || weaponSheetImgs.shield;
        const size = Math.max(36, base.radius * 1.65);
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.translate(sh.x, sh.y);
        ctx.rotate(s.animTime * (base.spinSpeed || 13));
        ctx.shadowColor = base.color; ctx.shadowBlur = 14;
        if (img && img.complete && img.naturalWidth) ctx.drawImage(img, -size/2, -size/2, size, size);
        else { ctx.fillStyle = base.color; ctx.font='34px serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('🛡',0,0); }
        ctx.restore();
      }
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
          if (base.spin) {
            // 盾牌沿軌跡飛行時使用自身圖示，並持續高速 360 度旋轉。
            // 旋轉只影響視覺，不改變原本命中判定半徑與擊退效果。
            ctx.translate(w.x, w.y);
            ctx.rotate(s.animTime * (base.spinSpeed || 10));
            ctx.drawImage(sheet, frame * fw, 0, fw, fh, -drawW / 2, -drawH / 2, drawW, drawH);
          } else if (base.rotateToPath) {
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
      if(s.path.length>0 && WEAPONS[selectedRef.current?.type]?.aim){
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
          const drawOne = (path) => {
            if (!path || path.length < 2) return;
            ctx.beginPath();
            path.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
            ctx.stroke();
          };
          if (s.aimMode === 'multiTrace' && s.multiPaths?.length) {
            // 武士刀：多條線必須各自獨立，不把線段頭尾硬連在一起。
            s.multiPaths.forEach(drawOne);
          } else {
            drawOne(s.path);
          }
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

  const devAddWeapon = (type) => {
    if (queueRef.current.length >= 7) return;
    normalizeQueuePreservingSelection([...queueRef.current, { id: uid(), type, tier: 1, born: Date.now() }]);
    setUi(v => ({ ...v, queue: queueRef.current }));
  };
  const devAddStats = (key, amount = 5) => {
    const s = stateRef.current; if (!s) return;
    s.stats[key] = (s.stats[key] || 0) + amount;
    setUi(v => ({ ...v, stats: { ...s.stats } }));
  };
  const devJumpWave = (wave) => {
    const s = stateRef.current; if (!s) return;
    s.tutorialActive = false;
    s.enemies = []; s.weapons = []; s.shieldShots = []; s.slashes = []; s.enemyProjectiles = []; s.hitEffects = []; s.particles = []; s.path = [];
    const idx = Math.max(0, ADVENTURE_NODES.findIndex(n => n.type === 'wave' && n.wave === wave));
    s.nodeIndex = idx < 0 ? 0 : idx;
    s.wave = wave;
    s.shopOpen = false; s.shopItems = []; s.replaceOffer = null;
    s.waveState = 'rest'; s.restTime = .25; s.waveSpawned = 0; s.waveTotal = 0;
    setUi(v => ({ ...v, tutorialActive: false, wave: s.wave, waveState: 'rest', rest: 1, enemiesLeft: 0 }));
  };
  const toggleDev = () => setUi(v => ({ ...v, showDev: !v.showDev }));

  const tutorialData = tutorialTexts[ui.tutorialStep] || tutorialTexts[0];
  const hideTutorialBox = ui.drawing || [3, 11, 120].includes(ui.tutorialStep) || ([8, 9, 12].includes(ui.tutorialStep) && ui.tutorialWeaponPicked);

  return <div className="page"><div className={`phone ${(ui.upgrading || ui.showBag || ui.shopOpen) ? 'isPaused' : ''} ${ui.tutorialActive ? `tutorialMode highlight-${ui.tutorialHighlight || 'none'}` : ''}`} ref={wrapRef}>
    <canvas ref={canvasRef} />
    {ui.tutorialActive && !hideTutorialBox && <div className={`tutorialBox step${ui.tutorialStep}`}>
      <div className="tutorialTitle">新手教學</div>
      <div className="tutorialText">{ui.tutorialText || tutorialData.text}</div>
      <div className="tutorialActions">
        {tutorialData.button && <button className="tutorialPrimary" onClick={handleTutorialPrimary}>{tutorialData.button}</button>}
        <button className="tutorialSkip" onClick={skipTutorial}>跳過教學</button>
      </div>
    </div>}
    {ui.tutorialActive && ui.tutorialStep === 2 && !ui.drawing && <div className="tutorialHand">☝️<span></span></div>}
    {ui.tutorialActive && arrowPos && (() => {
      const arrowChar = { down:'⬇', up:'⬆', right:'➡', left:'⬅' }[arrowPos.dir] || '⬇';
      return <div className="tutorialArrow tutorialArrowDynamic" style={{ position:'absolute', top: arrowPos.top, left: arrowPos.left, transform:'translate(-50%, -50%)', zIndex:80, pointerEvents:'none', fontSize:36, color:'#FFD700', filter:'drop-shadow(0 2px 4px #000) drop-shadow(0 0 12px #FFD700)', animation:'tutorialArrowBob .75s ease-in-out infinite alternate' }}>{arrowChar}</div>;
    })()}
    <div className="hud"><button className="devToggle" onClick={toggleDev}>DEV</button><div className="title">武器軌跡割草</div><div className="kills">擊殺：{ui.kills}</div></div>
    {ui.showDev && <div className="devPanel">
      <div className="devTitle">開發者模式</div>
      <div className="devRow"><span>跳關</span>{[1,5,10].map(n => <button key={n} onClick={() => devJumpWave(n)}>第{n}波</button>)}</div>
      <div className="devRow"><span>數值 +5</span>{STAT_KEYS.map(k => <button key={k} onClick={() => devAddStats(k, 5)}>{STAT_LABEL[k] || k}</button>)}</div>
      <div className="devRow weaponDev"><span>生成方塊</span>{TYPES.map(t => <button key={t} onClick={() => devAddWeapon(t)}>{WEAPONS[t].name}</button>)}</div>
    </div>}
    <div className="expHud">
      <div className="expText">Lv.{ui.level}　EXP {Math.floor(ui.exp || 0)} / {ui.expNeed || 80}</div>
      <div className="expTrack"><div className="expFill" style={{ width: `${expRatio * 100}%` }} /></div>
    </div>
    {!ui.tutorialActive && <div className="waveMap" aria-label="adventure node progress">
      {ADVENTURE_NODES.map((node, idx) => {
        const current = (ui.nodeIndex || 0) === idx;
        const cleared = (ui.nodeIndex || 0) > idx;
        const boss = node.type === 'wave' && (node.wave === 5 || node.wave === 10);
        const shop = node.type === 'shop';
        return <div key={idx} className={`waveNode ${current ? 'current' : ''} ${cleared ? 'cleared' : ''} ${boss ? 'bossNode' : ''} ${shop ? 'shopNode' : ''}`}>
          <span>{shop ? '商' : boss ? '★' : node.wave}</span>
        </div>;
      })}
    </div>}
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
      </div>
    </div>}
    {ui.shopOpen && <div className="shopOverlay">
      <div className={`shopPanel ${ui.shopBoughtFx ? 'shopFlash' : ''}`}>
        <div className="shopTop"><h2>⚔️ 武器商店</h2><div className="shopKills">💀 擊殺：{ui.kills}</div></div>
        {ui.shopMessage && <div className={`shopMessage ${ui.shopMessage.includes('不足') ? 'bad' : ''}`}>{ui.shopMessage}</div>}
        <div className="shopGrid">
          {(ui.shopItems || []).map((offer) => {
            const w = WEAPONS[offer.type];
            const meta = weaponQualityMeta(offer.type);
            return <button key={offer.id} className={`shopCard ${meta.key} ${offer.bought ? 'bought' : ''} ${ui.shopMessage === '擊殺數不足' ? 'shake' : ''}`} onClick={() => buyShopWeapon(offer)} disabled={offer.bought}>
              <div className="shopIcon"><img src={w.icon} alt={w.name} /></div>
              <div className="shopName">{w.name}</div>
              <div className="shopFormula">{w.formula}</div>
              <div className="shopDesc">{w.desc || (w.swipeSlash ? '左右滑動斬擊' : w.shieldClick ? '點擊召喚飛盾彈射' : w.freeze ? '命中凍結敵人' : SHIELD_TYPES.has(offer.type) ? '命中暈眩敵人 1 秒' : w.aim ? '點擊指定地點打擊' : '沿軌跡多段命中')}</div>
              <div className="shopPrice">💀 {offer.price}</div>
            </button>;
          })}
          <button className={`shopCard heal ${(ui.allyHp || 0) >= 100 ? 'disabled' : ''}`} onClick={buyHeal} disabled={(ui.allyHp || 0) >= 100}>
            <div className="shopEmoji">❤️</div>
            <div className="shopName">基地修復</div>
            <div className="shopFormula">回復基地 20 HP</div>
            <div className="shopDesc">HP 不超過 100；滿血時不可購買</div>
            <div className="shopPrice">💀 40</div>
          </button>
        </div>
        {ui.replaceOffer && <div className="replaceBox">
          <div className="replaceTitle">包包已滿，選擇要替換掉的武器</div>
          <div className="replaceSlots">{(ui.bag || []).map((type, idx) => {
            const w = WEAPONS[type];
            return <button key={idx} className="replaceSlot" onClick={() => replaceBagWeapon(idx)}><img src={w.icon} alt={w.name}/><span>{w.name}</span></button>;
          })}</div>
        </div>}
        <button className="leaveShop" onClick={leaveShop}>離開商店</button>
      </div>
    </div>}
    {ui.gameOver && <div className="gameOver"><b>{ui.gameOver}</b><button onClick={()=>location.reload()}>重新開始</button></div>}
    <div className="queue">
      <div className="blocks">{ui.queue.map((item, idx) => {
        const w=WEAPONS[item.type]; const tier=item.tier || 1;
        return <button key={item.id} ref={idx === 0 ? queueSlotRef : null} onClick={()=>selectBlock(item)} className={`block ${ui.selected===item.id?'selected':''} tier${tier} ${item.mergedAt ? 'merged' : ''} mergeTier${item.mergeTier || tier}`} style={{'--c':w.color}}><span><img className="weaponIcon" src={w.icon} alt={w.name} /></span>{tier>=2 && <em>{tier}階</em>}</button>
      })}</div>
      <button ref={bagBtnRef} className="bagToggle" onClick={toggleBag}>包包 / 角色</button>
    </div>
    {ui.showBag && <div className="bagPanel">
      <div className="bagCard">
        <div className="bagHeader"><b>{ui.playerClass || '戰士'}</b><button ref={bagCloseRef} onClick={toggleBag}>×</button></div>
        <div className="bagStats simpleStats">
          <span>STR <b>{ui.stats?.STR ?? 5}</b></span>
          <span>DEX <b>{ui.stats?.DEX ?? 3}</b></span>
          <span>VIT <b>{ui.stats?.VIT ?? 3}</b></span>
          <span>INT <b>{ui.stats?.INT ?? 1}</b></span>
        </div>
        <div className="globalStatsPanel">
          <div className="globalStatsTitle">全域效果</div>
          <div className="globalStatItem globalStatStr"><b>全域傷害 ×{globalDamageMultiplier(ui.stats || WARRIOR.stats).toFixed(2)}</b><span>受 STR 影響</span></div>
          <div className="globalStatItem globalStatDex"><b>方塊生成 {blockSpawnInterval(ui.stats || WARRIOR.stats).toFixed(2)} 秒 / 個</b><span>受 DEX 影響</span></div>
          <div className="globalStatItem globalStatVit"><b>基地回復 +{baseRegenPerTick(ui.stats || WARRIOR.stats).toFixed(1)} / 10 秒</b><span>受 VIT 影響</span></div>
          <div className="globalStatItem globalStatInt"><b>能量效率 ×{chargeMultiplier(ui.stats || WARRIOR.stats).toFixed(2)}</b><span>受 INT 影響</span></div>
        </div>
        <div className="bagTitle">武器包包 {ui.bag?.length || 0}/{ui.bagCapacity || 3}</div>
        <div className="bagSlots">{Array.from({length: ui.bagCapacity || 3}).map((_, idx) => {
          const type = ui.bag?.[idx]; const w = type ? WEAPONS[type] : null;
          return <button key={idx} className={`bagSlot ${ui.selectedBagIndex === idx ? 'active' : ''}`} onClick={() => selectBagWeapon(idx)}>{w ? <><img src={w.icon} alt={w.name}/><small>{w.name}</small></> : <small>空格</small>}</button>;
        })}</div>
        {ui.bag?.[ui.selectedBagIndex ?? 0] && (() => { const type = ui.bag[ui.selectedBagIndex ?? 0]; const w = WEAPONS[type]; return <div className="weaponDetail"><b>{w.name}</b><span>傷害：{weaponDamageText(type, ui.stats || WARRIOR.stats)}</span><span>{weaponStatTags(type)}</span><span>{weaponControlText(type)}</span></div> })()}
        <p className="bagHint">序列生成會從包包武器隨機抽取。商店節點可購買新武器並替換包包內容。</p>
      </div>
    </div>}
  </div></div>;
}

createRoot(document.getElementById('root')).render(<App />);

