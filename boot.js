(function() {
  document.body.classList.add('no-scroll');

  function initBoot() {
    const boot = document.getElementById('boot');
    const bar = document.getElementById('boot-bar');
    const status = document.getElementById('boot-status');
    const value = document.getElementById('boot-value');
    const page = document.getElementById('page');

    if (!boot || !bar || !status || !value || !page) return;

    const steps = [
  { pct: 0,   text: 'INITIATING ST. PAVLOV OS' },
  { pct: 10,  text: 'CONNECTING ARCHIVE SERVER' },
  { pct: 20,  text: 'DECODING ARCANUM INDEX' },
  { pct: 32,  text: 'CALIBRATING ISOLATION BARRIER' },
  { pct: 44,  text: 'ESTABLISHING RESONANCE MATRIX' },
  { pct: 56,  text: 'STRENGTHENING LAPIDARY SHIELD' },
  { pct: 68,  text: 'SYNCHRONIZING REGULUS SIGNAL' },
  { pct: 80,  text: 'SCANNING CHRONO-DISRUPTION' },
  { pct: 85,  text: 'WARNING: THE RAIN REVERSING' },
  { pct: 91,  text: 'RECONNECTING SIGNAL...' },
  { pct: 92,  text: 'RECONNECTING SIGNAL...' },
  { pct: 93,  text: 'RECONNECTING SIGNAL...' },
  { pct: 94,  text: 'RECONNECTING SIGNAL...' },
  { pct: 95,  text: 'RECONNECTING SIGNAL...' },
  { pct: 96,  text: 'RECONNECTING SIGNAL...' },
  { pct: 97,  text: 'RECONNECTING SIGNAL...' },
  { pct: 98,  text: 'RECONNECTING SIGNAL...' },
  { pct: 99,  text: 'RECONNECTING SIGNAL...' },
  { pct: 100, text: 'WELCOME BACK, TIMEKEEPER.' }
];
    let i = 0;
    let timeoutId = null;
    let bootComplete = false;
    let isStalling = false;
    let currentPct = 0;
    let resolutionPhaseActive = false;

    function updateStatus(text, pct) {
      currentPct = pct;
      
      // Handle 100% resolution phase
      if (pct === 100 && !resolutionPhaseActive) {
        enterResolutionPhase();
        return;
      }

      status.classList.remove('status-fade');
      void status.offsetWidth;
      status.classList.add('status-fade');
      status.textContent = text;
      value.textContent = String(pct).padStart(3, '0') + '%';
      bar.style.width = pct + '%';

      // Danger/glitch active ONLY on 85-89% (WARNING phase)
      if (pct >= 85 && pct < 90) {
        boot.classList.add('storm-approaching');
        status.classList.add('glitch-flicker');
      } else {
        boot.classList.remove('storm-approaching');
        status.classList.remove('glitch-flicker');
      }
    }

    function enterResolutionPhase() {
      resolutionPhaseActive = true;

      // 1. Remove storm effects instantly
      boot.classList.remove('storm-approaching');
      status.classList.remove('glitch-flicker');
      boot.classList.add('resolution-phase');

      // 2. Change main text and percentage
      status.classList.remove('status-fade');
      void status.offsetWidth;
      status.classList.add('status-fade');
      status.textContent = 'WELCOME BACK, TIMEKEEPER.';
      value.textContent = '100%';
      bar.style.width = '100%';

      // 3. Create and add subtitle element for resolution phase
      let subText = document.getElementById('boot-subtext');
      if (!subText) {
        subText = document.createElement('div');
        subText.id = 'boot-subtext';
        subText.className = 'boot-subtext mono';
        subText.textContent = 'The rain has stopped. The world is still.';
        
        // Insert after boot-readout
        const readout = document.querySelector('.boot-readout');
        if (readout && readout.parentNode) {
          readout.parentNode.insertBefore(subText, readout.nextSibling);
        }
      }
      subText.classList.add('fade-in-resolution');

      // 4. Hold this moment for 2.5s, then fade out smoothly
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      timeoutId = setTimeout(() => {
        // Fade out the loader with smooth transition
        boot.style.transition = 'opacity 1s ease-out';
        boot.style.opacity = '0';
        
        setTimeout(() => {
          boot.style.display = 'none';
          page.classList.add('ready');
          document.body.classList.remove('no-scroll');
        }, 1000);
      }, 2500);
    }

    function finishBoot() {
      if (bootComplete) return;

      bootComplete = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      // Skip to resolution phase directly if resolution not already active
      if (!resolutionPhaseActive) {
        enterResolutionPhase();
      }
    }

    function next() {
      if (bootComplete) return;

      if (i >= steps.length) {
        timeoutId = setTimeout(finishBoot, 400);
        return;
      }

      const s = steps[i];
      updateStatus(s.text, s.pct);

      // If we just hit 100%, the resolution phase is now active
      if (s.pct === 100) {
        bootComplete = true;
        return;
      }

      i++;

      // Timing intervals by phase
      if (s.pct < 88) {
        // Early steps: 500ms delay
        timeoutId = setTimeout(next, 500);
      } else if (s.pct >= 94 && s.pct < 100) {
        // Climax 94%-99% (RECONNECTING): 250ms delay - slow, one per one
        timeoutId = setTimeout(next, 250);
      } else {
        // Warning phase 88-93%: 800ms delay for dramatic effect
        timeoutId = setTimeout(next, 800);
      }
    }

    // Skip animation with click or keydown
    function skipBoot() {
      if (!bootComplete && !isStalling) {
        finishBoot();
      }
    }

    boot.addEventListener('click', skipBoot);
    document.addEventListener('keydown', skipBoot);

    next();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBoot);
  } else {
    initBoot();
  }
})();