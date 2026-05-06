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

const WEAPON_ASSETS = {
  sword: { icon: swordIconUrl, sheet: swordSheetUrl, hitSheet: swordHitSheetUrl },
  bomb: { icon: bombIconUrl, sheet: bombSheetUrl, hitSheet: bombHitSheetUrl },
  lightning: { icon: lightningIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl },
  ice: { icon: iceIconUrl, sheet: iceSheetUrl, hitSheet: iceHitSheetUrl },
  shield: { icon: shieldIconUrl, sheet: shieldIconUrl, hitSheet: swordHitSheetUrl },
  bow: { icon: bowIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl },
};

const WEAPONS = {
  sword: { name: '劍', icon: swordIconUrl, sheet: swordSheetUrl, hitSheet: swordHitSheetUrl, color: '#f0c040', radius: 40, speed: 720, formula: '4 × STR', label: '二階劍！', triple: '三階劍！', frames: 8, fps: 18, hitFrames: 6, hitSize: 34, swipeSlash: true, slashDepth: 300, slashName: '橫斬' },
  bomb: { name: '火焰法杖', icon: bombIconUrl, sheet: bombSheetUrl, hitSheet: bombHitSheetUrl, color: '#ff6644', radius: 75, speed: 330, formula: '5 × INT', label: '二階火焰！', triple: '三階烈焰！', frames: 8, fps: 20, rotateToPath: true, hitFrames: 6, hitSize: 34 },
  ice: { name: '冰霜法杖', icon: iceIconUrl, sheet: iceSheetUrl, hitSheet: iceHitSheetUrl, color: '#88ddff', radius: 30, speed: 500, formula: '4 × INT + 1 × DEX', freeze: 3, label: '二階冰霜！', triple: '三階冰霜！', frames: 8, fps: 20, rotateToPath: true, hitFrames: 6, hitSize: 34 },
  lightning: { name: '雷電法杖', icon: lightningIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl, color: '#ccaaff', radius: 55, speed: 920, formula: '3 × INT', label: '二階雷電！', triple: '三階雷鏈！', frames: 8, fps: 22, rotateToPath: true, hitFrames: 6, hitSize: 34 },
  shield: { name: '盾', icon: shieldIconUrl, sheet: shieldIconUrl, hitSheet: swordHitSheetUrl, color: '#9ca3af', radius: 40, speed: 300, formula: '5 × VIT', knockback: 42, label: '二階飛盾！', triple: '三階飛盾！', frames: 1, fps: 1, spin: true, spinSpeed: 12, hitFrames: 6, hitSize: 34, shieldClick: true, bounceRange: 150, bounces: 2 },
  bow: { name: '弓箭', icon: bowIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl, color: '#84cc16', radius: 50, speed: 0, formula: '5 × DEX', aim: true, label: '二階箭雨！', triple: '三階箭雨！', frames: 8, fps: 18, hitFrames: 6, hitSize: 34 },

  greatsword: { name: '大劍', quality: '藍色', icon: greatswordIconUrl, sheet: swordSheetUrl, hitSheet: swordHitSheetUrl, color: '#60a5fa', radius: 50, speed: 350, formula: '4.5 × STR', label: '二階大劍！', triple: '三階大劍！', frames: 8, fps: 18, hitFrames: 6, hitSize: 34, swipeSlash: true, slashDepth: 400, slashName: '大橫斬', desc: '左右滑動斬擊；STR>15 追加 2×VIT；STR>30 獲得 DEX/100 爆擊率' },
  katana: { name: '武士刀', quality: '紫色', icon: katanaIconUrl, sheet: swordSheetUrl, hitSheet: swordHitSheetUrl, color: '#c084fc', radius: 40, speed: 500, formula: '4 × STR + 1 × DEX', multiLine: true, label: '二階武士刀！', triple: '三階武士刀！', frames: 8, fps: 22, hitFrames: 6, hitSize: 34, desc: '時間內可畫多條線；STR+DEX>25 造成流血；>50 攻擊流血目標強化' },
  kingsword: { name: '王者之劍', quality: '金色', icon: kingswordIconUrl, sheet: swordSheetUrl, hitSheet: swordHitSheetUrl, color: '#ffd76a', radius: 60, speed: 0, formula: '6 × STR', aim: true, label: '二階王者之劍！', triple: '三階王者之劍！', frames: 8, fps: 18, hitFrames: 6, hitSize: 34, desc: 'STR>35 攻擊造成兩次；STR>50 攻擊後全場追加 2×STR 傷害' },
  greatshield: { name: '巨盾', quality: '藍色', icon: greatshieldIconUrl, sheet: shieldIconUrl, hitSheet: swordHitSheetUrl, color: '#60a5fa', radius: 50, speed: 300, formula: '5.5 × VIT', spin: true, spinSpeed: 14, label: '二階巨盾！', triple: '三階巨盾！', frames: 1, fps: 1, hitFrames: 6, hitSize: 34, shieldClick: true, bounceRange: 150, bounces: 2, desc: '點擊召喚飛盾追蹤最近敵人並彈射；VIT>15 暈眩2秒；VIT>30 命中暈眩目標時拖曳目標跟隨盾牌' },
  gianthammer: { name: '巨槌', quality: '紫色', icon: gianthammerIconUrl, sheet: shieldIconUrl, hitSheet: swordHitSheetUrl, color: '#c084fc', radius: 45, speed: 0, formula: '6 × VIT + 2 × STR', aim: true, label: '二階巨槌！', triple: '三階巨槌！', frames: 1, fps: 1, hitFrames: 6, hitSize: 34, desc: 'VIT>25 目標受傷+30% 3秒；VIT+STR>55 暴露弱點，下次受傷必定爆擊' },
  holyshield: { name: '黃金聖盾', quality: '金色', icon: holyshieldIconUrl, sheet: shieldIconUrl, hitSheet: swordHitSheetUrl, color: '#ffd76a', radius: 50, speed: 350, formula: '6 × VIT', spin: true, spinSpeed: 15, label: '二階聖盾！', triple: '三階聖盾！', frames: 1, fps: 1, hitFrames: 6, hitSize: 34, desc: 'VIT>30 聖光標記緩速50%；VIT+STR>55 命中標記目標造成小範圍 2×VIT 傷害' },
  crossbow: { name: '弩箭', quality: '藍色', icon: crossbowIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl, color: '#60a5fa', radius: 55, speed: 0, formula: '5 × DEX', aim: true, label: '二階弩箭！', triple: '三階弩箭！', frames: 8, fps: 18, hitFrames: 6, hitSize: 34, desc: 'DEX>15 附帶 DEX/100 爆擊率；DEX>30 爆擊傷害300%' },
  boomerang: { name: '迴力鏢', quality: '紫色', icon: boomerangIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl, color: '#c084fc', radius: 35, speed: 500, formula: '3 × DEX', returnPath: true, label: '二階迴力鏢！', triple: '三階迴力鏢！', frames: 8, fps: 20, rotateToPath: true, hitFrames: 6, hitSize: 34, desc: 'DEX>20 跑完軌跡後反向回來；DEX>40 爆擊傷害300%' },
  giantbow: { name: '巨人弓', quality: '金色', icon: giantbowIconUrl, sheet: lightningSheetUrl, hitSheet: lightningHitSheetUrl, color: '#ffd76a', radius: 60, speed: 0, formula: '5 × DEX + 2 × STR', aim: true, label: '二階巨人弓！', triple: '三階巨人弓！', frames: 8, fps: 18, hitFrames: 6, hitSize: 34, desc: 'DEX+STR>35 點擊位置持續3秒每秒50%傷害；>60 半徑85' },
};
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
function critSpec(type, stats = {}) {
  const STR = stats.STR || 0, DEX = stats.DEX || 0;
  if (type === 'greatsword' && STR > 30) return { chance: Math.min(.85, DEX / 100), mult: 2 };
  if (type === 'crossbow' && DEX > 15) return { chance: Math.min(.85, DEX / 100), mult: DEX > 30 ? 3 : 2 };
  if (type === 'boomerang' && DEX > 40) return { chance: Math.min(.65, DEX / 100), mult: 3 };
  return { chance: 0, mult: 2 };
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
  const [ui, setUi] = useState({ queue: [], selected: null, kills: 0, allyHp: 100, wave: 0, waveState: 'tutorial', rest: 0, enemiesLeft: 0, banner: '新手教學', drawing: false, timer: 0, gameOver: '', level: 1, exp: 0, expNeed: 80, weaponEnergy: 0, upgrading: false, upgradeOptions: [], showDev: false, classChosen: true, playerClass: '戰士', stats: WARRIOR.stats, bag: [...WARRIOR.initialBag], bagCapacity: WARRIOR.bagCapacity, showBag: false, selectedBagIndex: 0, tutorialActive: true, tutorialStep: 0, tutorialWeaponPicked: false, tutorialHighlight: 'battle', tutorialText: '怪物已經出現在村莊外！時間暫停。這些怪物要襲擊村莊了，玩家必須挺身而出！', nodeIndex: 0, shopOpen: false, shopItems: [], shopMessage: '', replaceOffer: null, shopBoughtFx: 0 });
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
    const s = stateRef.current;

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
      if (s.tutorialStep === 1 && item?.type === 'sword') {
        // 點下劍後立刻進入可操作狀態：怪物開始往前走，提示框收起，玩家可以畫線攻擊。
        s.tutorialPracticeType = 'sword';
        s.tutorialSpawned = true; // 使用一開始已出現的 8 隻怪，不重生。
        s.tutorialWeaponPicked = true;
        s.tutorialStep = 2;
        syncTutorialUi(2);
      } else if (s.tutorialStep === 8 && item?.type === 'shield') {
        // 盾牌教學：先顯示說明，玩家點盾後才開始練習並隱藏提示。
        s.tutorialWeaponPicked = true;
      } else if (s.tutorialStep === 9 && item?.type === 'bow') {
        // 弓箭教學：先顯示說明，玩家點弓後才開始練習並隱藏提示。
        s.tutorialWeaponPicked = true;
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
      s.showBag = !s.showBag;
      if (s.tutorialActive && s.tutorialStep === 6 && s.showBag) {
        s.tutorialStep = 7;
        setUi(v => ({ ...v, tutorialStep: 7, tutorialText: tutorialTexts[7].text, tutorialHighlight: tutorialTexts[7].highlight }));
      }
    }
    setUi(v => ({ ...v, showBag: s ? s.showBag : !v.showBag, bag: [...bagRef.current] }));
  };
  const selectBagWeapon = (idx) => {
    setUi(v => ({ ...v, selectedBagIndex: idx }));
  };

  const tutorialTexts = {
    0: { text: '怪物已經出現在村莊外！時間暫停。這些怪物要襲擊村莊了，玩家必須挺身而出！', highlight: 'battle', button: '' },
    1: { text: '勇者，請點擊下方發光的劍圖標，拿起武器準備戰鬥！', highlight: 'queue', button: '' },
    2: { text: '現在對怪物畫線攻擊！按住戰場拖曳，畫出你想攻擊的路線。\n你畫出的軌跡，就是武器飛行的軌跡！', highlight: 'battle', button: '' },
    3: { text: '第一波：怪物開始移動了！用劍把這 8 隻零星怪物全部擊倒，殺光後會進入升級教學。', highlight: 'battle', button: '' },
    5: { text: '經驗值滿了就會升級！選一個強化方向，這些素質會影響武器能力，某些武器未來也會需要達到門檻才會發動效果。STR 影響劍類傷害，DEX 影響投擲與弓箭，INT 影響法術，VIT 影響防禦。', highlight: 'level', button: '' },
    6: { text: '現在認識你的包包。請點開下方「包包 / 角色」，裡面可以看到角色素質、目前攜帶武器、武器傷害、半徑、速度與特效。', highlight: 'bagButton', button: '' },
    7: { text: '包包裡的武器會決定序列會生成哪些武器。目前你攜帶：劍、盾、弓箭。接著來練習盾牌。', highlight: 'bagPanel', button: '開始盾牌練習' },
    8: { text: '第二波：選擇盾牌並畫線攻擊。盾牌會擊退怪物，並且會被 VIT 增傷。這一段序列只會出現盾。', highlight: 'queue', button: '' },
    9: { text: '第三波：選擇弓箭後，在 1 秒內快速點擊多個目標位置。時間到後會針對標記地點打擊，弓箭會被 DEX 增傷。', highlight: 'battle', button: '' },
    10: { text: '武器充能條在玩家血條上方。擊殺怪物會充能 +10，充到 100 會歸零並立刻獲得一個武器方塊。現在先幫你充到 90，下一波怪物殺掉一隻就能體驗補方塊。', highlight: 'battle', button: '開始充能練習' },
    11: { text: '充能練習開始！擊殺任一怪物，讓藍色能量條充滿並獲得新的武器方塊。', highlight: 'battle', button: '' },
    12: { text: '完成新手教學！你現在已經是有能力的勇者，可以守護村莊了。', highlight: 'none', button: '開始冒險' },
  };

  const syncTutorialUi = (step) => {
    const data = tutorialTexts[step] || tutorialTexts[0];
    setUi(v => ({ ...v, tutorialActive: true, tutorialStep: step, tutorialText: data.text, tutorialHighlight: data.highlight, tutorialWeaponPicked: stateRef.current?.tutorialWeaponPicked || false, classChosen: true, playerClass: WARRIOR.name }));
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
        allyHp: 100, weaponEnergy: 0, kills: 0, level: 1, exp: 0, upgrading: false, upgradeOptions: [], gameOver: '', autoWeapon: 0,
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
    s.enemies = [];
    s.weapons = [];
    s.hitEffects = [];
    s.particles = [];
    s.path = [];
    s.isDrawing = false;
    s.waveState = 'tutorial';
    s.wave = step === 3 ? 1 : step === 8 ? 2 : 3;
    s.autoWeapon = 0;
    tutorialSetQueue(type, Math.min(3, type === 'sword' ? 2 : 1));
    syncTutorialUi(step);
  };

  const handleTutorialPrimary = () => {
    const s = stateRef.current;
    const step = ui.tutorialStep;
    if (step === 7) { if (s) s.showBag = false; setUi(v => ({ ...v, showBag: false })); startTutorialPractice('shield', 8); return; }
    if (step === 10) {
      if (s) {
        s.weaponEnergy = 90;
        s.tutorialStep = 11;
        s.tutorialPracticeType = 'sword';
        s.tutorialSpawned = false;
        s.tutorialWeaponPicked = true;
        s.enemies = [];
        s.weapons = [];
        s.path = [];
        s.isDrawing = false;
        s.waveState = 'tutorial';
        s.wave = 3;
        tutorialSetQueue('sword', 1);
        const hp = Math.ceil(18 * 1.5);
        for (let i = 0; i < 4; i++) {
          const fast = i % 2 === 1;
          s.enemies.push({
            id: uid(), type: fast ? 'MON' : 'ZOM', x: rand(s.w * .15, s.w * .85), y: 42 + rand(-8, 8),
            hp, maxHp: hp, atk: 3, cd: 0,
            speed: (s.battleH - 86) / 18 * (fast ? 1.25 : 1),
            flash: 0, frozen: 0, animSeed: Math.random() * 4,
            boss: false, finalBoss: false, radius: fast ? 11 : 13,
          });
        }
        s.tutorialSpawned = true;
        s.floatTexts.push({ id: uid(), text: '能量 90/100！擊殺怪物取得方塊', x: s.w / 2, y: 110, vy: -8, life: 1.4, color: '#7dd3fc', size: 22, glow: true });
      }
      setUi(v => ({ ...v, tutorialStep: 11, tutorialText: tutorialTexts[11].text, tutorialHighlight: tutorialTexts[11].highlight, weaponEnergy: 90, queue: queueRef.current }));
      return;
    }
    if (step === 12) { resetForAdventure(); return; }
  };

  const skipTutorial = () => resetForAdventure();

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
      w: 390, h: 780, battleH: 585, last: performance.now(), autoWeapon: 0,
      wave: 0, nodeIndex: 0, waveState: 'rest', restTime: 5, restDuration: 5, waveSpawnTimer: 0, waveSpawned: 0, waveTotal: 0, shopOpen: false, shopItems: [], shopMessage: '', replaceOffer: null, shopBoughtFx: 0, bannerLife: 1.5,
      berserkActive: false, berserkScheduled: false, berserkTriggered: false, berserkAt: 0, waveElapsed: 0,
      allies: [], enemies: [], weapons: [], shieldShots: [], slashes: [], hitEffects: [], particles: [], floatTexts: [], path: [], isDrawing: false, drawTime: 0,
      allyHp: 100, weaponEnergy: 0, kills: 0, level: 1, exp: 0, upgrading: false, upgradeOptions: [], gameOver: '', pointerId: null, animTime: 0,
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
    const releasePointer = (e) => {
      try {
        if (e?.pointerId != null && canvas.hasPointerCapture?.(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch (_) {}
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
      if (selectedWeapon?.aim) s.floatTexts.push({ id: uid(), text: '可連續點擊多個位置標記目標！', x: s.w/2, y: 96, vy: -8, life: .8, color: '#d9ff99', size: 20, glow: true });
      if (selectedWeapon?.shieldClick) { spawnShieldShot(s, selectedRef.current, getTierInfo(selectedRef.current)); s.floatTexts.push({ id: uid(), text: '連點螢幕召喚飛盾！', x: s.w/2, y: 96, vy: -8, life: .8, color: '#d7e4ff', size: 20, glow: true }); }
      if (selectedWeapon?.swipeSlash) { s.lastSlashX = p.x; s.lastSlashTime = performance.now(); s.floatTexts.push({ id: uid(), text: '左右滑動斬擊！滑越快砍越快', x: s.w/2, y: 96, vy: -8, life: .8, color: '#fff3b0', size: 18, glow: true }); }
      if (selectedWeapon?.multiLine) s.floatTexts.push({ id: uid(), text: '可畫多條線！時間到後一起發動', x: s.w/2, y: 96, vy: -8, life: .8, color: '#e9d5ff', size: 18, glow: true });
      setUi(v => ({ ...v, drawing: true, timer: s.drawTime }));
    };
    const moveDraw = e => {
      const s = stateRef.current; if (!s.isDrawing || e.pointerId !== s.pointerId || s.aimMode === 'bow' || s.aimMode === 'shieldClick') return;
      const p = toPoint(e); if (p.y <= s.battleH && p.y >= 0) {
        if (s.aimMode === 'swipeSlash') {
          const dx = p.x - (s.lastSlashX ?? p.x);
          const now = performance.now();
          const elapsed = Math.max(16, now - (s.lastSlashTime || now));
          const speedX = Math.abs(dx) / elapsed;
          const threshold = 28;
          if (Math.abs(dx) >= threshold) {
            launchSwipeSlash(s, selectedRef.current, getTierInfo(selectedRef.current), dx > 0 ? 1 : -1, speedX);
            s.lastSlashX = p.x;
            s.lastSlashTime = now;
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
      queueRef.current = normalizeWeaponQueue(queueRef.current.filter(x => x.id !== item.id));
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
        s.weapons.push({ id: uid(), type: item.type, path: weaponPath, seg: 0, t: 0, x: weaponPath[0].x, y: weaponPath[0].y, radius: base.radius, damage: weaponBaseDamage(item.type, stats) * tierInfo.power, hitCd: {}, trail: [], combo: tierInfo.tier, trailColor: tierTrailColor(item.type, tierInfo.tier), damageColor: tierEffectColor(item.type, tierInfo.tier), stats, returning: false });
      }
      consumeSelectedWeapon(item, tierInfo);
      if (s.tutorialActive && s.tutorialStep === 2) {
        s.tutorialStep = 3;
        s.tutorialStepTimer = 0;
        s.tutorialSpawned = true; // 使用一開始已經出現在場上的 8 隻怪，不重新生成。
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
      s.floatTexts.push({ id: uid(), text: 'Level Up！', x: s.w / 2, y: s.battleH * .45, vy: -6, life: 1.1, color: '#fff4b8', size: 34, glow: true });
      setUi(v => ({ ...v, level: s.level, exp: s.exp, expNeed: s.level * 80, upgrading: true, upgradeOptions: s.upgradeOptions, tutorialStep: s.tutorialStep || v.tutorialStep, tutorialText: tutorialTexts[s.tutorialStep]?.text || v.tutorialText, tutorialHighlight: tutorialTexts[s.tutorialStep]?.highlight || v.tutorialHighlight }));
      return true;
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
        bossCenterX: s.w / 2, bossMovePhase: Math.random() * Math.PI * 2, bossMoveAmp: s.w * .25, bossMoveTime: 0,
        skillCd: isBoss ? 5 : 0, skillState: '', skillTimer: 0, skillDuration: 0, shielded: false, hurtAnim: 0, fireSpawned: 0,
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
      for (let i = 0; i < 8; i++) spawnTutorialMob(s, i);
      s.floatTexts.push({ id: uid(), text: type === 'sword' ? '第一波練習！' : type === 'shield' ? '盾牌練習！' : '弓箭練習！', x: s.w / 2, y: 105, vy: -10, life: 1, color: '#fff3a3', size: 26, glow: true });
    }

    function updateTutorialPassive(s, dt) {
      s.hitEffects.forEach(h=>{ h.age += dt; h.life -= dt; });
      s.hitEffects = s.hitEffects.filter(h=>h.life>0);
      s.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;});
      s.particles=s.particles.filter(p=>p.life>0);
      s.floatTexts.forEach(f=>{f.y+=f.vy*dt;f.life-=dt;});
      s.floatTexts=s.floatTexts.filter(f=>f.life>0);
    }

    function tutorialUpdate(s, dt) {
      // 回傳 true 代表教學此步驟要完全暫停戰鬥時間，只保留動畫與 UI。
      if (s.tutorialStep === 0) {
        if (!s.tutorialIntroSpawned) {
          s.enemies = [];
          for (let i = 0; i < 8; i++) spawnTutorialMob(s, i);
          s.tutorialIntroSpawned = true;
          s.tutorialStepTimer = 0;
          s.wave = 1;
          s.waveState = 'tutorial';
          s.waveTotal = 8;
          s.waveSpawned = 8;
          s.floatTexts.push({ id: uid(), text: '怪物出現！', x: s.w / 2, y: 105, vy: -8, life: 1.1, color: '#fff3a3', size: 28, glow: true });
          syncTutorialUi(0);
        }
        s.tutorialStepTimer += dt;
        if (s.tutorialStepTimer >= 1.8) {
          s.tutorialStep = 1;
          s.tutorialStepTimer = 0;
          tutorialSetQueue('sword', 1);
          syncTutorialUi(1);
        }
        return true;
      }

      if (s.tutorialStep === 1 || s.tutorialStep === 6 || s.tutorialStep === 7 || s.tutorialStep === 10 || s.tutorialStep === 12) {
        return true;
      }
      // 劍：點下武器後 step2 直接讓怪物開始移動，玩家可立即畫線。
      if (s.tutorialStep === 2) return false;
      // 盾 / 弓：先停住顯示武器說明，玩家點該武器後才開始練習。
      if ((s.tutorialStep === 8 || s.tutorialStep === 9) && !s.tutorialWeaponPicked) {
        return true;
      }

      if (![3, 8, 9, 11].includes(s.tutorialStep)) return false;
      if (!s.tutorialSpawned) beginTutorialWave(s, s.tutorialPracticeType || 'sword');
      const forcedType = s.tutorialPracticeType || 'sword';
      s.autoWeapon += dt;
      if (s.autoWeapon >= 0.9) {
        if (queueRef.current.length < 7) {
          queueRef.current = normalizeWeaponQueue([...queueRef.current, { id: uid(), type: forcedType, tier: 1, born: Date.now() }]);
          setUi(v => ({ ...v, queue: queueRef.current }));
        }
        s.autoWeapon = 0;
      }
      if (s.tutorialSpawned && s.enemies.length === 0) {
        if (s.tutorialStep === 3 && !s.upgrading) {
          // 保險：如果剛好沒有因 EXP 進升級，仍強制觸發第一次升級教學。
          s.exp = Math.max(s.exp, s.level * 80);
          gainExp(s, 0);
        } else if (s.tutorialStep === 8) {
          startTutorialPractice('bow', 9);
        } else if (s.tutorialStep === 9) {
          s.tutorialStep = 10;
          queueRef.current = [];
          selectedRef.current = null;
          setUi(v => ({ ...v, queue: [], selected: null, tutorialStep: 10, tutorialText: tutorialTexts[10].text, tutorialHighlight: tutorialTexts[10].highlight }));
        } else if (s.tutorialStep === 11) {
          s.tutorialStep = 12;
          queueRef.current = [];
          selectedRef.current = null;
          setUi(v => ({ ...v, queue: [], selected: null, tutorialStep: 12, tutorialText: tutorialTexts[12].text, tutorialHighlight: tutorialTexts[12].highlight, weaponEnergy: s.weaponEnergy }));
        }
      }
      return false;
    }


    function applyWeaponSpecialOnHit(s, e, weapon, finalDamage = 0) {
      if (!weapon?.type) return;
      const stats = weapon.stats || s.stats || {};
      const STR = stats.STR || 0, DEX = stats.DEX || 0, VIT = stats.VIT || 0;
      if (weapon.type === 'katana' && STR + DEX > 25) {
        e.bleedTime = Math.max(e.bleedTime || 0, 3);
        e.bleedPct = e.boss ? 0.005 : 0.02;
      }
      if (weapon.type === 'greatshield' && VIT > 15) {
        e.stunned = Math.max(e.stunned || 0, 2);
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
      if (e.boss && e.shielded) {
        s.floatTexts.push({ id: uid(), text: '無效', x: e.x, y: e.y - 42, vy: -38, life: .55, color:'#d56bff', size:18, glow:true });
        for (let i=0;i<5;i++) s.particles.push({ id: uid(), x:e.x+rand(-28,28), y:e.y+rand(-36,36), vx:rand(-40,40), vy:rand(-40,40), life:.35, color:'#d56bff', size:3, glow:true });
        return;
      }
      const stats = weapon?.stats || s.stats || {};
      let finalDmg = dmg;
      let crit = false;
      if (e.wounded > 0) finalDmg *= 1.3;
      if (e.weakpoint) { finalDmg *= 2; e.weakpoint = false; crit = true; }
      if (weapon?.type === 'katana' && (stats.STR || 0) + (stats.DEX || 0) > 50 && (e.bleedTime || 0) > 0) {
        finalDmg *= 2;
        finalDmg += e.maxHp * (e.boss ? 0.03 : 0.25);
      }
      const critInfo = critSpec(weapon?.type, stats);
      if (!crit && critInfo.chance > 0 && Math.random() < critInfo.chance) { finalDmg *= critInfo.mult; crit = true; }
      e.hp -= finalDmg; e.flash = .08;
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
      const count = (e.boss ? 12 : 7) + (color === '#ffd76a' ? 8 : color === '#c084fc' ? 4 : 0);
      for (let i=0;i<count;i++) s.particles.push({
        id: uid(), x:e.x, y:e.y, vx:rand(-90,90), vy:rand(-90,90),
        life: color === '#ffd76a' ? .5 : color === '#c084fc' ? .42 : .35, color,
        size: color === '#ffd76a' ? rand(3,7) : color === '#c084fc' ? rand(2,6) : 4, glow: isTierColor
      });
    }
    function addWeaponCharge(s, amount = 10) {
      if (!s || s.gameOver) return;
      s.weaponEnergy = Math.min(100, (s.weaponEnergy || 0) + amount);
      if (s.weaponEnergy >= 100) {
        s.weaponEnergy = 0;
        const created = addWeapon('充能完成！獲得武器');
        if (!created) {
          s.floatTexts.push({ id: uid(), text: '充能完成！武器列已滿', x: s.w / 2, y: s.battleH - 92, vy: -18, life: 1, color: '#7dd3fc', size: 18, glow: true });
        }
      }
    }

    function killEnemy(s, e) {
      s.kills++;
      const isBossSummon = !!e.summonOwner;
      if (!e.boss) addWeaponCharge(s, 10);
      // Boss 召喚物（蝙蝠 / 火球）不給經驗；只有普通怪 +10，Boss +100。
      if (e.boss) gainExp(s, 100);
      else if (!isBossSummon) gainExp(s, 10);
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
          if (base.knockback && !target.boss) target.y = Math.max(34, target.y - base.knockback);
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
            w.path = [...w.path].reverse(); w.seg = 0; w.t = 0; w.returning = true; w.hitCd = {};
          } else { w.t = 1; w.done = true; }
        }
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
            if(w.type === 'greatshield' && (w.stats?.VIT || 0) > 30 && (e.stunned || 0) > 0 && !e.boss) { e.x = w.x; e.y = Math.max(34, w.y); }
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
    queueRef.current = normalizeWeaponQueue([...queueRef.current, { id: uid(), type, tier: 1, born: Date.now() }]);
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
    s.enemies = []; s.weapons = []; s.shieldShots = []; s.slashes = []; s.hitEffects = []; s.particles = []; s.path = [];
    const idx = Math.max(0, ADVENTURE_NODES.findIndex(n => n.type === 'wave' && n.wave === wave));
    s.nodeIndex = idx < 0 ? 0 : idx;
    s.wave = wave;
    s.shopOpen = false; s.shopItems = []; s.replaceOffer = null;
    s.waveState = 'rest'; s.restTime = .25; s.waveSpawned = 0; s.waveTotal = 0;
    setUi(v => ({ ...v, tutorialActive: false, wave: s.wave, waveState: 'rest', rest: 1, enemiesLeft: 0 }));
  };
  const toggleDev = () => setUi(v => ({ ...v, showDev: !v.showDev }));

  const tutorialData = tutorialTexts[ui.tutorialStep] || tutorialTexts[0];
  const hideTutorialBox = ui.drawing || [3, 11].includes(ui.tutorialStep) || ([8, 9].includes(ui.tutorialStep) && ui.tutorialWeaponPicked);

  return <div className="page"><div className={`phone ${(ui.upgrading || ui.showBag || ui.shopOpen) ? 'isPaused' : ''} ${ui.tutorialActive ? `tutorialMode highlight-${ui.tutorialHighlight || 'none'}` : ''}`} ref={wrapRef}>
    <canvas ref={canvasRef} />
    {ui.tutorialActive && !hideTutorialBox && <div className={`tutorialBox step${ui.tutorialStep}`}>
      <div className="tutorialTitle">新手教學</div>
      <div className="tutorialText">{ui.tutorialText || tutorialData.text}</div>
      {ui.tutorialStep === 5 && <div className="tutorialStatsIntro">
        <span><b>STR</b> 劍類傷害</span><span><b>DEX</b> 投擲 / 弓箭</span><span><b>INT</b> 法術傷害</span><span><b>VIT</b> 防禦 / 盾牌</span>
      </div>}
      <div className="tutorialActions">
        {tutorialData.button && <button className="tutorialPrimary" onClick={handleTutorialPrimary}>{tutorialData.button}</button>}
        <button className="tutorialSkip" onClick={skipTutorial}>跳過教學</button>
      </div>
    </div>}
    <div className="hud"><button className="devToggle" onClick={toggleDev}>DEV</button><div className="title">武器軌跡割草</div><div className="kills">擊殺：{ui.kills}</div></div>
    {ui.showDev && <div className="devPanel">
      <div className="devTitle">開發者模式</div>
      <div className="devRow"><span>跳關</span>{[1,5,10].map(n => <button key={n} onClick={() => devJumpWave(n)}>第{n}波</button>)}</div>
      <div className="devRow"><span>數值 +5</span>{STAT_KEYS.map(k => <button key={k} onClick={() => devAddStats(k, 5)}>{k}</button>)}</div>
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
        <button className="skipUpgrade" onClick={continueAfterUpgrade}>跳過選擇</button>
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
              <div className="shopDesc">{w.desc || (w.swipeSlash ? '左右滑動斬擊' : w.shieldClick ? '點擊召喚飛盾彈射' : w.freeze ? '命中凍結敵人' : w.knockback ? '命中擊退敵人' : w.aim ? '點擊指定地點打擊' : '沿軌跡多段命中')}</div>
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
          return <button key={idx} className={`bagSlot ${ui.selectedBagIndex === idx ? 'active' : ''}`} onClick={() => selectBagWeapon(idx)}>{w ? <><img src={w.icon} alt={w.name}/><small>{w.name}</small><small className="bagDamage">傷害 {weaponDamageText(type, ui.stats || WARRIOR.stats)}</small><small className="bagFormula">半徑 {w.radius}｜{w.swipeSlash ? '左右滑斬' : w.shieldClick ? '飛盾彈射' : w.aim ? '點擊標記' : w.knockback ? '擊退' : w.freeze ? '凍結' : '軌跡'}</small></> : <small>空格</small>}</button>;
        })}</div>
        {ui.bag?.[ui.selectedBagIndex ?? 0] && (() => { const type = ui.bag[ui.selectedBagIndex ?? 0]; const w = WEAPONS[type]; return <div className="weaponDetail"><b>{w.name}</b><span>傷害：{weaponDamageText(type, ui.stats || WARRIOR.stats)}</span><span>半徑：{w.radius}</span><span>速度：{w.aim ? '指定地點打擊' : w.speed < 350 ? '慢' : w.speed > 800 ? '最快' : w.speed > 600 ? '快' : '中'}</span><span>特效：{w.swipeSlash ? '1 秒內左右滑動螢幕，從基地向外進行橫向斬擊' : w.shieldClick ? '1 秒內連點螢幕，每次從基地前方射出飛盾追蹤最近敵人，並彈射兩次' : w.knockback ? '擊中後怪物往後退' : w.freeze ? '凍結 3 秒' : w.aim ? '1 秒內點擊地圖標記，時間到後打擊標記地點' : '沿軌跡多段命中'}</span></div> })()}
        <p className="bagHint">序列生成會從包包武器隨機抽取。商店節點可購買新武器並替換包包內容。</p>
      </div>
    </div>}
  </div></div>;
}

createRoot(document.getElementById('root')).render(<App />);
