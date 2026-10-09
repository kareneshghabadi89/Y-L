/* منطق سایت: گالری، نمایش تمام‌صفحه، موسیقی و انیمیشن‌ها.
   برای عوض کردن نقاشی‌ها و موسیقی فقط js/data.js را ویرایش کن. */
(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var ARTS = Array.isArray(window.ARTWORKS) ? window.ARTWORKS : [];
  var MUSIC = window.MUSIC || {};
  var IMG_DIR = 'assets/images/';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fa = function (n) { try { return n.toLocaleString('fa-IR'); } catch (e) { return String(n); } };

  /* ---------- انیمیشن ورود ---------- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { $('#hero').classList.add('ready'); });
  });

  /* ---------- دکمه مشاهده گالری ---------- */
  $('#ctaBtn').addEventListener('click', function (e) {
    e.preventDefault();
    $('#gallery').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------- نورِ دنبال‌کننده ماوس (فقط دسکتاپ) ---------- */
  var hero = $('#hero');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
    var pending = false, mx = 50, my = 28;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * 100;
      my = ((e.clientY - r.top) / r.height) * 100;
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        hero.style.setProperty('--mx', mx + '%');
        hero.style.setProperty('--my', my + '%');
        pending = false;
      });
    }, { passive: true });
  }

  /* ---------- ذرات نور ---------- */
  (function dust() {
    var c = $('#dust'); if (!c || !c.getContext) return;
    var ctx = c.getContext('2d'), w = 0, h = 0, ps = [], raf = 0, visible = true;
    function mk() {
      return { x: Math.random() * w, y: Math.random() * h, r: .5 + Math.random() * 1.5,
               vx: (Math.random() - .5) * .1, vy: -.04 - Math.random() * .16,
               a: .15 + Math.random() * .5, t: Math.random() * 6.28 };
    }
    function size() {
      var d = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      var n = Math.round(Math.min(55, (w * h) / 24000));
      ps = []; for (var i = 0; i < n; i++) ps.push(mk());
      draw(true);
    }
    function draw(still) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        if (!still) {
          p.t += .012; p.x += p.vx + Math.sin(p.t) * .12; p.y += p.vy;
          if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
          if (p.x < -5) p.x = w + 5; if (p.x > w + 5) p.x = -5;
        }
        ctx.beginPath();
        ctx.fillStyle = 'rgba(242,204,143,' + (p.a * (.65 + .35 * Math.sin(p.t * 3))).toFixed(3) + ')';
        ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
    }
    function loop() { if (!visible || document.hidden) { raf = 0; return; } draw(false); raf = requestAnimationFrame(loop); }
    function start() { if (!raf && !reduce) raf = requestAnimationFrame(loop); }
    size();
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(size, 200); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); }).observe(hero);
    }
    document.addEventListener('visibilitychange', start);
    start();
  })();

  /* ---------- ساخت گالری از روی data.js ---------- */
  var grid = $('#galleryGrid');
  var revealIO = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 }) : null;

  ARTS.forEach(function (a, i) {
    var fig = document.createElement('figure'); fig.className = 'piece';
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'art';
    btn.setAttribute('aria-label', 'بزرگ‌نمایی ' + (a.title || 'نقاشی ' + fa(i + 1)));
    var frame = document.createElement('div'); frame.className = 'art-frame';
    var img = new Image();
    img.alt = a.title || ('نقاشی ' + fa(i + 1));
    img.loading = 'lazy'; img.decoding = 'async';
    img.addEventListener('load', function () { img.classList.add('loaded'); });
    img.addEventListener('error', function () {
      frame.innerHTML = '';
      var m = document.createElement('div'); m.className = 'art-missing';
      m.textContent = IMG_DIR + a.file; frame.appendChild(m);
    });
    img.src = IMG_DIR + a.file;
    frame.appendChild(img); btn.appendChild(frame); fig.appendChild(btn);
    if (a.title || a.description) {
      var cap = document.createElement('figcaption');
      if (a.title) { var t = document.createElement('span'); t.className = 'cap-title'; t.dir = 'auto'; t.textContent = a.title; var st = document.createElement('span'); st.className = 'cap-star'; st.setAttribute('aria-hidden', 'true'); st.textContent = '✦'; t.appendChild(st); cap.appendChild(t); }
      if (a.description) { var d = document.createElement('p'); d.className = 'cap-desc'; d.textContent = a.description; cap.appendChild(d); }
      fig.appendChild(cap);
    }
    btn.addEventListener('click', function () { openLB(i); });
    grid.appendChild(fig);
    if (revealIO) revealIO.observe(fig); else fig.classList.add('in');
  });

  /* ---------- قاب شناور در بخش شروع (اولین نقاشی) ---------- */
  (function heroFrame() {
    var fr = $('#heroFrame'), im = $('#heroImg');
    if (!fr || !ARTS.length) return;
    im.addEventListener('load', function () { fr.hidden = false; });
    im.addEventListener('error', function () { fr.hidden = true; });
    im.src = IMG_DIR + ARTS[0].file;
    $('#heroFrameBtn').addEventListener('click', function () { openLB(0); });
  })();

  /* ---------- پیام ویژه: روشن شدن پاراگراف‌ها ---------- */
  var paras = document.querySelectorAll('#thread p');
  if ('IntersectionObserver' in window) {
    var litIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('lit'); litIO.unobserve(en.target); } });
    }, { rootMargin: '-30% 0px -30% 0px' });
    paras.forEach(function (p) { litIO.observe(p); });
  } else { paras.forEach(function (p) { p.classList.add('lit'); }); }

  /* ---------- پیام پایانی ---------- */
  var fin = $('#finalCard');
  if ('IntersectionObserver' in window) {
    var finIO = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { fin.classList.add('in'); finIO.disconnect(); }
    }, { threshold: .35 });
    finIO.observe(fin);
  } else fin.classList.add('in');

  /* ---------- نمایش تمام‌صفحه ---------- */
  var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbCount = $('#lbCount');
  var idx = 0, lastFocus = null, swapTimer = 0;

  function render(animate) {
    var a = ARTS[idx]; if (!a) return;
    function apply() {
      lbImg.onload = lbImg.onerror = function () { lbImg.classList.remove('out'); };
      lbImg.src = IMG_DIR + a.file;
      lbImg.alt = a.title || '';
      lbCap.innerHTML = '';
      if (a.title) { var b = document.createElement('b'); b.dir = 'auto'; b.textContent = a.title; lbCap.appendChild(b); }
      if (a.description) { var s = document.createElement('span'); s.textContent = a.description; lbCap.appendChild(s); }
      lbCount.textContent = fa(idx + 1) + ' / ' + fa(ARTS.length);
      [idx + 1, idx - 1].forEach(function (n) {
        var k = (n + ARTS.length) % ARTS.length; if (k === idx) return;
        new Image().src = IMG_DIR + ARTS[k].file;
      });
    }
    clearTimeout(swapTimer);
    if (animate && !reduce) { lbImg.classList.add('out'); swapTimer = setTimeout(apply, 200); } else apply();
  }
  function go(step) { if (ARTS.length < 2) return; idx = (idx + step + ARTS.length) % ARTS.length; render(true); }
  function openLB(i) {
    idx = i; lastFocus = document.activeElement; render(false);
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock');
    $('#lbClose').focus({ preventScroll: true });
  }
  function closeLB() {
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $('#lbClose').addEventListener('click', closeLB);
  $('#lbPrev').addEventListener('click', function () { go(-1); });
  $('#lbNext').addEventListener('click', function () { go(1); });
  lb.addEventListener('click', function (e) {
    if (e.target.closest('img, button, .lb-cap')) return;
    closeLB();
  });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    else if (e.key === 'ArrowLeft') go(1);    /* در متن راست‌به‌چپ، «بعدی» سمت چپ است */
    else if (e.key === 'ArrowRight') go(-1);
    else if (e.key === 'Tab') {
      var f = lb.querySelectorAll('button'), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  var sx = 0, sy = 0;
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ---------- موسیقی ---------- */
  (function music() {
    var player = $('#player'), btn = $('#pBtn'), seek = $('#pSeek'), vol = $('#pVol');
    if (!MUSIC.file) { player.hidden = true; return; }
    $('#pTitle').textContent = MUSIC.title || 'Music';
    var audio = new Audio();
    audio.preload = 'metadata'; audio.loop = MUSIC.loop !== false;
    audio.volume = typeof MUSIC.volume === 'number' ? Math.min(1, Math.max(0, MUSIC.volume)) : .6;
    vol.value = Math.round(audio.volume * 100);
    function fill(el) { el.style.setProperty('--p', (el.value / el.max * 100) + '%'); }
    fill(vol); fill(seek);

    function broken() { player.hidden = true; try { audio.pause(); } catch (e) {} console.info('موسیقی پیدا نشد:', MUSIC.file); }
    audio.addEventListener('error', broken);
    audio.addEventListener('play', function () { player.classList.add('playing'); player.classList.remove('hint'); btn.setAttribute('aria-label', 'توقف موسیقی'); });
    audio.addEventListener('pause', function () { player.classList.remove('playing'); btn.setAttribute('aria-label', 'پخش موسیقی'); });
    audio.addEventListener('timeupdate', function () {
      if (audio.duration && isFinite(audio.duration) && document.activeElement !== seek) {
        seek.value = audio.currentTime / audio.duration * 1000; fill(seek);
      }
    });
    function tryPlay(manual) {
      var p; try { p = audio.play(); } catch (e) { broken(); return; }
      if (p && p.catch) p.catch(function (err) {
        if (err && err.name === 'NotSupportedError') broken();
        else if (!manual) player.classList.add('hint');   /* مرورگر اجازه پخش خودکار نداد؛ دکمه پخش را نشان بده */
      });
    }
    btn.addEventListener('click', function () { if (audio.paused) tryPlay(true); else audio.pause(); });
    seek.addEventListener('input', function () {
      fill(seek); if (audio.duration && isFinite(audio.duration)) audio.currentTime = seek.value / 1000 * audio.duration;
    });
    vol.addEventListener('input', function () { audio.volume = vol.value / 100; fill(vol); });

    audio.src = MUSIC.file;
    if (MUSIC.autoplay !== false) tryPlay(false); else player.classList.add('hint');
  })();
})();
