(function() {
  // Clock
  function updateClock() {
    const now = new Date();
    const date = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const clockEl = document.querySelector('.time') || document.getElementById('clock');
    if (clockEl) {
      clockEl.textContent = `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Render Projects
  const grid = document.getElementById('archive-grid');
  function renderTag(tag, link) {
    if (tag.toLowerCase() === 'link' && link) {
      return `<a href="${link}" target="_blank" rel="noopener noreferrer" class="tag-link">${tag}</a>`;
    }
    return `<span>${tag}</span>`;
  }

  PROJECTS.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="card-idx mono">0${idx + 1}</div>
      <div class="card-title">${p.title}</div>
      <div class="card-desc">${p.desc}</div>
      <div class="card-tags">
        ${p.tags.map(t => renderTag(t, p.link)).join('')}
      </div>
    `;

    card.addEventListener('click', (event) => {
      const linkEl = event.target.closest('.tag-link');
      if (linkEl) {
        event.preventDefault();
        event.stopPropagation();
        window.open(linkEl.href, '_blank', 'noopener,noreferrer');
        return;
      }
      openCard(p);
    });

    grid.appendChild(card);
  });

  // Modal
  const backdrop = document.getElementById('card-backdrop');
  const card = document.getElementById('card');
  const cardInner = document.getElementById('card-inner');

  function openCard(p) {
    const tagMarkup = p.tags.map(t => {
      const tag = String(t).toLowerCase();
      if (tag === 'link' && p.link) {
        return `<a href="${p.link}" target="_blank" rel="noopener noreferrer" class="tag-link">${t}</a>`;
      }
      return `<span>${t}</span>`;
    }).join('');

    cardInner.innerHTML = `
      <button class="card-close" id="card-close">&times;</button>
      <div class="card-idx mono">PROJECT 0${p.id}</div>
      <h2 style="margin:12px 0 16px; color:#fff;">${p.title}</h2>
      <p style="color:#aaa; line-height:1.8;">${p.detail}</p>
      <div class="card-tags" style="margin-top:24px;">
        ${tagMarkup}
      </div>
    `;
    backdrop.classList.add('open');
    card.classList.add('open');
    document.getElementById('card-close').addEventListener('click', closeCard);
  }

  function closeCard() {
    backdrop.classList.remove('open');
    card.classList.remove('open');
  }

  backdrop.addEventListener('click', closeCard);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCard();
  });
})();

// Video color sampler: samples the first frame of the hero video and updates CSS variables
(function() {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  function luminance(r, g, b) {
    // relative luminance
    const srgb = [r, g, b].map(v => v / 255).map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  }

  function sampleFrame() {
    try {
      const w = 32, h = 32;
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let r=0,g=0,b=0,count=0;
      for (let i=0;i<data.length;i+=4) {
        r += data[i]; g += data[i+1]; b += data[i+2]; count++;
      }
      r = Math.round(r/count); g = Math.round(g/count); b = Math.round(b/count);

      const hex = rgbToHex(r,g,b);
      const lum = luminance(r,g,b);

      // Set CSS variables to match the video's dominant tone
      const root = document.documentElement;
      root.style.setProperty('--accent', hex);
      root.style.setProperty('--accent-2', rgbToHex(Math.min(255, r+40), Math.min(255, g+40), Math.min(255, b+40)));
      root.style.setProperty('--glow', `rgba(${r}, ${g}, ${b}, 0.28)`);

      // Ensure text contrasts with background: light video -> dark text
      if (lum > 0.5) {
        root.style.setProperty('--text', '#071722');
      } else {
        root.style.setProperty('--text', '#edf7ff');
      }
    } catch (err) {
      // If canvas is tainted (CORS) or any error occurs, do nothing
      console.warn('Video sampling failed:', err);
    }
  }

  if (video.readyState >= 2) sampleFrame();
  else video.addEventListener('loadeddata', sampleFrame, { once: true });
  // Also resample when user seeks or the video loops
  video.addEventListener('seeked', sampleFrame);
  video.addEventListener('play', () => { setTimeout(sampleFrame, 200); });
})();