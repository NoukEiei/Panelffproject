// script.js — behavior for the fake UI
document.addEventListener('DOMContentLoaded', ()=>{

  const aimBtn = document.getElementById('aimBtn');
  const modal = document.getElementById('modal');
  const consoleEl = document.getElementById('console');
  const modalTitle = document.getElementById('modalTitle');
  const closeModal = document.getElementById('closeModal');
  const resetBtn = document.getElementById('resetBtn');
  const controls = document.getElementById('controls');
  const statLock = document.getElementById('stat-lock');
  const statAcc = document.getElementById('stat-acc');
  const statEsp = document.getElementById('stat-esp');
  const strength = document.getElementById('strength');
  const strVal = document.getElementById('strVal');

  let running=false;
  let locks=0, espHits=0, accuracy=0;

  // update strength label
  strength.addEventListener('input', ()=> strVal.textContent = strength.value);

  aimBtn.addEventListener('click', ()=> {
    aimBtn.classList.add('glow');
    if(!running){
      startFakeSequence();
    } else {
      // toggle off
      stopFakeSequence();
    }
  });

  function startFakeSequence(){
    running=true;
    aimBtn.textContent = "Starting...";
    // show controls
    controls.setAttribute('aria-hidden','false');
    controls.style.opacity=1;
    // open modal
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    modalTitle.textContent = "Connecting to local kernel";
    consoleEl.textContent = '';
    fakeLog([
      "> Establishing secure tunnel...",
      "> Loading aim-model (v4.2.1)...",
      "> Calibrating 3D prediction mesh...",
      "> Registering crosshair imprint...",
      "> Finalizing..."
    ], 800, ()=>{
      modalTitle.textContent = "Aimbot Online";
      appendConsole("> Ready. UI-only demo mode.");
      aimBtn.textContent = "Aimbot (ON)";
      aimBtn.dataset.on = "1";

      // start fake stat increment
      statTick();
    });
  }

  function stopFakeSequence(){
    running=false;
    aimBtn.classList.remove('glow');
    aimBtn.textContent = "Aimbot";
    aimBtn.dataset.on = "0";
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    appendConsole("> Shutting down systems...");
  }

  function fakeLog(lines, interval=700, cb){
    let i=0;
    (function next(){
      if(i>=lines.length){ if(cb) cb(); return; }
      appendConsole(lines[i++]);
      setTimeout(next, interval + Math.random()*400);
    })();
  }

  function appendConsole(text){
    consoleEl.textContent += text + "\n";
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  function statTick(){
    // only while running
    if(!running) return;
    // increment fake stats based on strength
    const s = Number(strength.value);
    locks += Math.round(0.5 + s/40 * (Math.random()*2));
    espHits += Math.round(Math.random()*2);
    accuracy = Math.min(99, Math.round(Math.min(95, s*0.9 + Math.random()*6)));
    statLock.textContent = locks;
    statAcc.textContent = accuracy + "%";
    statEsp.textContent = espHits;
    // playful console messages sometimes
    if(Math.random() > 0.7) appendConsole("> Lock acquired. confidence: " + accuracy + "%");
    // continue
    setTimeout(statTick, 1500 + Math.random()*1200);
  }

  // close modal
  closeModal.addEventListener('click', ()=> {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
  });

  resetBtn.addEventListener('click', ()=>{
    locks=0; espHits=0; accuracy=0;
    statLock.textContent = locks;
    statAcc.textContent = accuracy + "%";
    statEsp.textContent = espHits;
    consoleEl.textContent = "> Reset complete.\n";
  });

  // Accessibility: allow Esc to close
  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape'){
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden','true');
    }
  });

  // initial small animation
  setTimeout(()=> aimBtn.animate([{transform:'scale(0.98)'},{transform:'scale(1)'}], {duration:800,iterations:1}), 400);
});
