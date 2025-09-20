// script.js — behavior for the fake UI v2 (dark, improved UX, no ESP)
document.addEventListener('DOMContentLoaded', ()=>{

  const aimBtn = document.getElementById('aimBtn');
  const controls = document.getElementById('controls');
  const sensitivity = document.getElementById('sensitivity');
  const sensVal = document.getElementById('sensVal');
  const statLock = document.getElementById('stat-lock');
  const statAcc = document.getElementById('stat-acc');
  const modal = document.getElementById('modal');
  const consoleEl = document.getElementById('console');
  const closeModal = document.getElementById('closeModal');
  const resetBtn = document.getElementById('resetBtn');
  const modeBtns = document.querySelectorAll('.mode');

  let running=false;
  let locks=0, accuracy=0;
  let mode = 'smooth';

  // init UI
  sensVal.textContent = sensitivity.value;

  sensitivity.addEventListener('input', ()=> {
    sensVal.textContent = sensitivity.value;
  });

  modeBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      modeBtns.forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      mode = btn.dataset.mode;
      appendConsole("> Mode set to " + mode);
    });
  });

  // keyboard shortcut Space to toggle
  document.addEventListener('keydown', (e)=>{
    if(e.code==='Space'){
      e.preventDefault();
      aimBtn.click();
    }
  });

  aimBtn.addEventListener('click', ()=> {
    if(!running){
      startSequence();
    } else {
      stopSequence();
    }
  });

  function startSequence(){
    running = true;
    aimBtn.classList.add('on');
    aimBtn.setAttribute('aria-pressed','true');
    controls.classList.add('show');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.getElementById('modalTitle').textContent = "Booting Aimbot UI...";
    consoleEl.innerHTML = "<code>> Initializing...</code>\n";
    fakeLog([
      "> Loading aim-engine (demo)...",
      "> Calibrating sensitivity: " + sensitivity.value,
      "> Applying " + mode + " smoothing",
      "> Aligning crosshair overlay (UI only)",
      "> Finalizing..."
    ], 700, ()=> {
      appendConsole("> Ready. This is a simulated UI only.");
      aimBtn.querySelector('.label').textContent = "Aimbot (ON)";
      // start stat updates
      statTick();
    });
  }

  function stopSequence(){
    running = false;
    aimBtn.classList.remove('on');
    aimBtn.setAttribute('aria-pressed','false');
    controls.classList.remove('show');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    aimBtn.querySelector('.label').textContent = "Aimbot";
    appendConsole("> Shutdown complete.");
  }

  function fakeLog(lines, interval=600, cb){
    let i=0;
    (function next(){
      if(i>=lines.length){ if(cb) cb(); return; }
      appendConsole(lines[i++]);
      setTimeout(next, interval + Math.random()*300);
    })();
  }

  function appendConsole(text){
    consoleEl.innerHTML += "<code>" + text + "</code>\n";
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  function statTick(){
    if(!running) return;
    const s = Number(sensitivity.value);
    // smooth mode increases gradually, snap gives sharper jumps
    if(mode === 'smooth'){
      locks += Math.round(0.3 + s/60 * (Math.random()*1.6));
      accuracy = Math.min(99, Math.round(60 + s*0.35 + Math.random()*8));
    } else {
      locks += Math.round(0.6 + s/40 * (Math.random()*2.6));
      accuracy = Math.min(99, Math.round(50 + s*0.6 + Math.random()*12));
    }

    statLock.textContent = locks;
    statAcc.textContent = accuracy + "%";

    if(Math.random() > 0.7) appendConsole("> Lock acquired. confidence: " + accuracy + "%");

    setTimeout(statTick, 1200 + Math.random()*1400);
  }

  closeModal.addEventListener('click', ()=>{
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
  });

  resetBtn.addEventListener('click', ()=>{
    locks=0; accuracy=0;
    statLock.textContent = locks;
    statAcc.textContent = accuracy + "%";
    consoleEl.innerHTML = "<code>> Reset complete.</code>\n";
  });

});
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
