/* ============================================================
   Progressive enhancement only — the page is fully readable
   with JavaScript disabled. Nothing here is required content.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- sticky nav shadow ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    };

    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // close after tapping a link, or on Escape
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms';
      revealObserver.observe(el);
    });
  }

  /* ---------- active nav link (scroll spy) ---------- */
  var sections = Array.prototype.filter.call(
    document.querySelectorAll('main section[id]'),
    function (s) { return document.querySelector('.nav__menu a[href="#' + s.id + '"]'); }
  );

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('.nav__menu a.is-current').forEach(function (a) {
          a.classList.remove('is-current');
          a.removeAttribute('aria-current');
        });
        var link = document.querySelector('.nav__menu a[href="#' + entry.target.id + '"]');
        if (link) {
          link.classList.add('is-current');
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- typewriter tagline ---------- */
  var typed = document.querySelector('[data-typewriter]');
  if (typed && !reduceMotion) {
    var out = typed.querySelector('.hero__typed-out');
    var phrases;
    try {
      phrases = JSON.parse(typed.getAttribute('data-typewriter'));
    } catch (err) {
      phrases = null;
    }

    if (out && Array.isArray(phrases) && phrases.length) {
      var pi = 0, ci = 0, deleting = false;

      var tick = function () {
        var phrase = phrases[pi];
        ci += deleting ? -1 : 1;
        out.textContent = phrase.slice(0, ci);

        var delay = deleting ? 32 : 58;
        if (!deleting && ci === phrase.length) {
          deleting = true;
          delay = 2100;
        } else if (deleting && ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          delay = 420;
        }
        window.setTimeout(tick, delay);
      };
      tick();
    }
  } else if (typed) {
    // static fallback so the line isn't empty
    var staticOut = typed.querySelector('.hero__typed-out');
    try {
      var list = JSON.parse(typed.getAttribute('data-typewriter'));
      if (staticOut && list && list.length) staticOut.textContent = list[0];
    } catch (err) { /* leave blank */ }
  }

  /* ---------- animated stat counters ---------- */
  var counters = document.querySelectorAll('[data-count-to]');
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        countObserver.unobserve(el);

        var target = parseInt(el.getAttribute('data-count-to'), 10);
        if (isNaN(target)) return;

        var duration = 900;
        var start = null;
        var step = function (now) {
          if (start === null) start = now;
          var t = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = String(Math.round(target * eased));
          if (t < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- project filter ---------- */
  var chips = document.querySelectorAll('.chip[data-filter]');
  var grid = document.getElementById('projectGrid');
  var emptyMsg = document.getElementById('projectEmpty');

  if (chips.length && grid) {
    var cards = grid.querySelectorAll('.card--project');

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var filter = chip.getAttribute('data-filter');

        chips.forEach(function (c) {
          var active = c === chip;
          c.classList.toggle('is-active', active);
          c.setAttribute('aria-pressed', String(active));
        });

        var shown = 0;
        cards.forEach(function (card) {
          var tags = (card.getAttribute('data-tags') || '').split(/\s+/);
          var match = filter === 'all' || tags.indexOf(filter) !== -1;
          card.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });

        if (emptyMsg) emptyMsg.hidden = shown > 0;
      });
    });
  }

  /* ---------- badge image fallback ----------
     Badge images are hotlinked from the issuer. If the issuer is unreachable,
     offline, or the id is still a placeholder, swap in the mono abbreviation
     tile rather than leaving a broken-image icon in the grid. */
  document.querySelectorAll('.badge__img').forEach(function (img) {
    var fallback = function () {
      if (img.dataset.fellBack) return;
      img.dataset.fellBack = '1';

      var tile = document.createElement('span');
      tile.className = 'badge__abbr mono';
      tile.textContent = img.getAttribute('data-abbr') || 'CERT';
      img.replaceWith(tile);
    };

    img.addEventListener('error', fallback);
    // covers images that failed before this script ran
    if (img.complete && img.naturalWidth === 0) fallback();
  });

  /* ---------- copy email ---------- */
  var copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    var label = document.getElementById('copyEmailLabel');
    var status = document.getElementById('copyStatus');
    var original = label ? label.textContent : '';
    var resetTimer;

    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email') || '';

      var report = function (ok) {
        var msg = ok ? 'Copied' : 'Press Ctrl+C to copy';
        if (label) label.textContent = msg;
        if (status) status.textContent = ok ? 'Email address copied to clipboard' : 'Copy failed';
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(function () {
          if (label) label.textContent = original;
          if (status) status.textContent = '';
        }, 2200);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () { report(true); },
                                                  function () { report(false); });
      } else {
        report(false);
      }
    });
  }
})();
