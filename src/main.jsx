import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const WEAPONS = {
  sword: { name: '旋轉劍', icon: '⚔️', color: '#f0c040', radius: 40, speed: 720, damage: 24, label: '雙劍連斬！', triple: '三連旋斬！' },
  bomb: { name: '爆破彈', icon: '💥', color: '#ff6644', radius: 75, speed: 330, damage: 38, label: '雙重爆破！', triple: '三連爆破！' },
  ice: { name: '冰霜束', icon: '❄️', color: '#88ddff', radius: 30, speed: 500, damage: 16, freeze: 3, label: '雙重冰封！', triple: '三連冰霜！' },
  lightning: { name: '閃電鏈', icon: '⚡', color: '#ccaaff', radius: 55, speed: 920, damage: 20, label: '雙重閃電！', triple: '三連雷鏈！' },
};
const TYPES = Object.keys(WEAPONS);
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const uid = (() => { let n = 1; return () => n++; })();

function randomWeapon() { return TYPES[Math.floor(Math.random() * TYPES.length)]; }
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
    queueRef.current = [...queueRef.current, { id: uid(), type: randomWeapon() }].slice(-7);
    setUi(v => ({ ...v, queue: queueRef.current }));
    if (reason && stateRef.current) stateRef.current.floatTexts.push({ id: uid(), text: reason, x: rand(80, stateRef.current.w - 80), y: stateRef.current.h * .77, vy: -34, life: 1, color: '#fff6a8', size: 18 });
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
      allyHp: 100, kills: 0, gameOver: '', pointerId: null,
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
        const last = s.path[s.path.length - 1]; if (!last || dist(last, p) > 5) s.path.push(p);
      }
    };
    const endDraw = e => {
      const s = stateRef.current; if (!s.isDrawing || e.pointerId !== s.pointerId) return;
      launchWeapon(); s.isDrawing = false; s.drawTime = 0; s.pointerId = null;
      setUi(v => ({ ...v, drawing: false, timer: 0 }));
    };
    canvas.addEventListener('pointerdown', startDraw); canvas.addEventListener('pointermove', moveDraw); canvas.addEventListener('pointerup', endDraw); canvas.addEventListener('pointercancel', endDraw);

    function getCombo(item) {
      const q = queueRef.current; const idx = q.findIndex(x => x.id === item.id); if (idx < 0) return { power: 1, count: 1, ids: [item.id] };
      let l = idx, r = idx; while (l - 1 >= 0 && q[l - 1].type === item.type) l--; while (r + 1 < q.length && q[r + 1].type === item.type) r++;
      const count = r - l + 1; const use = q.slice(l, Math.min(r + 1, l + Math.min(3, count))).map(x => x.id);
      if (count >= 3) return { power: 2, count: 3, ids: use };
      if (count >= 2) return { power: 1.5, count: 2, ids: use.slice(0,2) };
      return { power: 1, count: 1, ids: [item.id] };
    }
    function launchWeapon() {
      const s = stateRef.current, item = selectedRef.current; if (!item || s.path.length < 2) return;
      const base = WEAPONS[item.type]; const combo = getCombo(item);
      const weaponPath = [...s.path];
      s.path = [];
      s.weapons.push({ id: uid(), type: item.type, path: weaponPath, seg: 0, t: 0, x: weaponPath[0].x, y: weaponPath[0].y, radius: base.radius * combo.power, damage: base.damage * combo.power, hitCd: {}, trail: [], combo: combo.count });
      queueRef.current = queueRef.current.filter(x => !combo.ids.includes(x.id));
      if (selectedRef.current && combo.ids.includes(selectedRef.current.id)) selectedRef.current = null;
      if (combo.count >= 2) s.floatTexts.push({ id: uid(), text: combo.count === 3 ? base.triple : base.label, x: s.w / 2, y: s.battleH / 2, vy: -10, life: 1.2, color: base.color, size: combo.count === 3 ? 34 : 26 });
      setUi(v => ({ ...v, queue: queueRef.current, selected: selectedRef.current?.id ?? null }));
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
      s.enemies.push({
        id: uid(), x: rand(s.w*.12, s.w*.88), y: isBoss ? 30 : 42,
        hp, maxHp: hp, atk: isBoss ? 25 : 5 + s.wave, cd: 0,
        speed: isBoss ? (s.battleH-86)/34 : cfg.speed(s), flash:0, frozen:0,
        boss: isBoss, radius: isBoss ? 28 : 13,
      });
      s.waveSpawned++;
    }
    function damageEnemy(s, e, dmg, color) {
      e.hp -= dmg; e.flash = .08;
      s.floatTexts.push({ id: uid(), text: Math.round(dmg).toString(), x: e.x + rand(-8,8), y: e.y - (e.boss ? 34 : 18), vy: -45, life: .65, color, size: e.boss ? 20 : 16 });
      for (let i=0;i<(e.boss?12:7);i++) s.particles.push({ id: uid(), x:e.x, y:e.y, vx:rand(-90,90), vy:rand(-90,90), life:.35, color });
    }
    function killEnemy(s, e) {
      s.kills++;
      const n = e.boss ? 36 : 14;
      for (let i=0;i<n;i++) s.particles.push({ id: uid(), x:e.x, y:e.y, vx:rand(-160,160), vy:rand(-160,160), life:.65, color:e.boss ? '#ffdf6e' : '#ffcc99' });
      if (e.boss) s.floatTexts.push({ id: uid(), text: 'BOSS 擊破！', x: e.x, y: e.y - 40, vy: -22, life: 1.2, color:'#ffdf6e', size:28 });
    }

    function update(dt) {
      const s = stateRef.current; if (s.gameOver) return;
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
      if (s.autoWeapon >= 3) { addWeapon(); s.autoWeapon = 0; }

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
            damageEnemy(s,e,w.damage,base.color);
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
      const g=ctx.createLinearGradient(0,0,0,s.battleH); g.addColorStop(0,'#2f6e35'); g.addColorStop(.52,'#4f9142'); g.addColorStop(1,'#6caf55'); ctx.fillStyle=g; ctx.fillRect(0,0,s.w,s.battleH);
      const rg=ctx.createRadialGradient(s.w/2,s.battleH*.45,20,s.w/2,s.battleH*.45,s.battleH*.72); rg.addColorStop(0,'rgba(255,255,255,.10)'); rg.addColorStop(1,'rgba(0,0,0,.18)'); ctx.fillStyle=rg; ctx.fillRect(0,0,s.w,s.battleH);
      ctx.fillStyle='rgba(255,255,255,.07)'; for(let y=22;y<s.battleH;y+=34) for(let x=(Math.floor(y/34)%2)*17;x<s.w;x+=34) ctx.fillRect(x,y,17,17);
      ctx.fillStyle='rgba(25,70,30,.18)'; for(let y=50;y<s.battleH-60;y+=78){ ctx.beginPath(); ctx.ellipse(s.w*.22,y,34,10,.1,0,Math.PI*2); ctx.ellipse(s.w*.78,y+26,42,12,-.1,0,Math.PI*2); ctx.fill(); }
      ctx.fillStyle='rgba(255,255,255,.10)'; ctx.fillRect(s.w*.08,42,s.w*.012,s.battleH-92); ctx.fillRect(s.w*.91,42,s.w*.012,s.battleH-92);
      ctx.fillStyle=s.berserkActive ? 'rgba(150,35,25,.62)' : 'rgba(80,30,30,.40)'; ctx.fillRect(0,0,s.w,42); ctx.fillStyle='#ffd6d6'; ctx.font='bold 15px system-ui'; ctx.textAlign='center'; ctx.fillText(s.waveState === 'rest' ? `休息中：${Math.max(0,Math.ceil(s.restTime))} 秒` : `第 ${s.wave} 波  剩餘 ${Math.max(0, s.waveTotal - s.waveSpawned + s.enemies.length)}${s.berserkActive ? '  狂暴中' : ''}`,s.w/2,28);
      const baseG=ctx.createLinearGradient(0,s.battleH-52,0,s.battleH); baseG.addColorStop(0,'#2d70c9'); baseG.addColorStop(1,'#17458f'); ctx.fillStyle=baseG; ctx.fillRect(0,s.battleH-46,s.w,40); ctx.fillStyle='rgba(255,255,255,.16)'; ctx.fillRect(0,s.battleH-46,s.w,5); ctx.fillStyle='#dff4ff'; ctx.fillText(`我方基地 HP ${Math.max(0,Math.ceil(s.allyHp))}`,s.w/2,s.battleH-20);
      ctx.fillStyle='rgba(255,255,255,.15)'; ctx.fillRect(0,s.battleH/2-1,s.w,2);
      s.enemies.forEach(e=>{ if(e.boss){ ctx.save(); ctx.translate(e.x,e.y); ctx.scale(1.8,1.8); drawPixelPerson(ctx,0,0,e.flash>0?'#fff':'#8f2cff','enemy',0,e.frozen); ctx.restore(); ctx.fillStyle='#2b102e'; ctx.fillRect(e.x-28,e.y-34,56,6); ctx.fillStyle='#ffdf6e'; ctx.fillRect(e.x-28,e.y-34,56*Math.max(0,e.hp/e.maxHp),6); } else drawPixelPerson(ctx,e.x,e.y,'#e34a38','enemy',e.flash,e.frozen); });
      for(const w of s.weapons){ const base=WEAPONS[w.type]; ctx.save(); for(const t of w.trail){ ctx.globalAlpha=t.life/.35*.35; ctx.fillStyle=base.color; ctx.beginPath(); ctx.arc(t.x,t.y,w.radius*.45,0,Math.PI*2); ctx.fill(); } ctx.globalAlpha=.17; ctx.fillStyle=base.color; ctx.beginPath(); ctx.arc(w.x,w.y,w.radius,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; ctx.shadowColor=base.color; ctx.shadowBlur=18; ctx.font='30px serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(base.icon,w.x,w.y); ctx.restore(); }
      if(s.path.length>1){ ctx.strokeStyle='#ffffff'; ctx.lineWidth=4; ctx.lineCap='round'; ctx.beginPath(); s.path.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)); ctx.stroke(); }
      s.particles.forEach(p=>{ctx.globalAlpha=clamp(p.life*2,0,1);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,4,4);ctx.globalAlpha=1;});
      s.floatTexts.forEach(f=>{ctx.globalAlpha=clamp(f.life,0,1);ctx.fillStyle=f.color;ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=4;ctx.font=`900 ${f.size}px system-ui`;ctx.textAlign='center';ctx.strokeText(f.text,f.x,f.y);ctx.fillText(f.text,f.x,f.y);ctx.globalAlpha=1;});
      ctx.fillStyle='rgba(18,23,33,.95)'; ctx.fillRect(0,s.battleH,s.w,s.h-s.battleH);
    }
    function loop(now){ const s=stateRef.current; const dt=Math.min(.033,(now-s.last)/1000); s.last=now; update(dt); render(); requestAnimationFrame(loop); }
    const raf=requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); canvas.removeEventListener('pointerdown', startDraw); canvas.removeEventListener('pointermove', moveDraw); canvas.removeEventListener('pointerup', endDraw); canvas.removeEventListener('pointercancel', endDraw); };
  }, []);

  const groups = useMemo(() => {
    const q = ui.queue; return q.map((it, i) => {
      let c = 1; if (q[i-1]?.type === it.type || q[i+1]?.type === it.type) c = 2; if ((q[i-2]?.type===it.type&&q[i-1]?.type===it.type)||(q[i-1]?.type===it.type&&q[i+1]?.type===it.type)||(q[i+1]?.type===it.type&&q[i+2]?.type===it.type)) c = 3; return c;
    });
  }, [ui.queue]);

  return <div className="page"><div className="phone" ref={wrapRef}>
    <canvas ref={canvasRef} />
    <div className="hud"><div className="title">武器軌跡割草</div><div className="wave">第 {ui.wave || 1}/10 波</div><div className="kills">擊殺：{ui.kills}</div></div>
    {ui.drawing && <div className="timer">畫軌跡：{ui.timer.toFixed(1)}s</div>}
    {ui.gameOver && <div className="gameOver"><b>{ui.gameOver}</b><button onClick={()=>location.reload()}>重新開始</button></div>}
    <div className="queue">
      <div className="hint">選武器 → 戰場按住拖曳，時停 1 秒內畫軌跡</div>
      <div className="blocks">{ui.queue.map((item, i) => {
        const w=WEAPONS[item.type]; const combo=groups[i];
        return <button key={item.id} onClick={()=>selectBlock(item)} className={`block ${ui.selected===item.id?'selected':''} combo${combo}`} style={{'--c':w.color}}><span>{w.icon}</span>{combo>=2 && <em>{combo}連</em>}</button>
      })}</div>
    </div>
  </div></div>;
}

createRoot(document.getElementById('root')).render(<App />);
