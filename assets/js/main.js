/* Macabro Escape Room — JS mínimo (menú, tráilers, cookies) */
(function () {
  'use strict';

  /* Vista previa local por file://: el navegador no sirve index.html al abrir
     una carpeta, así que completamos los enlaces de carpeta. En producción
     (http/https) este bloque no hace nada y las URLs quedan limpias. */
  if (location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (h && h.slice(-1) === '/' && h.indexOf('://') === -1 && h.charAt(0) !== '#') {
        a.setAttribute('href', h + 'index.html');
      }
    });
  }

  /* Menú móvil */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Desplegable "Salas": accesible con teclado y táctil, además del :hover CSS */
  document.querySelectorAll('.nav__salas').forEach(function (wrap) {
    var btn = wrap.querySelector('button');
    var menu = wrap.querySelector('ul');
    if (!btn || !menu) return;
    menu.id = menu.id || 'salas-menu';
    btn.setAttribute('aria-controls', menu.id);
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var open = wrap.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* Tráiler: fachada ligera; el iframe de YouTube solo se carga al pulsar y
     sustituye al botón (nada interactivo queda anidado). */
  document.querySelectorAll('.trailer[data-yt]').forEach(function (el) {
    el.addEventListener('click', function () {
      var box = document.createElement('div');
      box.className = 'trailer';
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + el.dataset.yt + '?autoplay=1&rel=0';
      f.title = el.getAttribute('aria-label') || 'Trailer';
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      box.appendChild(f);
      el.replaceWith(box);
    }, { once: true });
  });

  /* Aviso de cookies */
  var KEY = 'macabro-cookies-ok';
  var box = document.getElementById('cookies');
  var ok = document.getElementById('cookies-ok');
  try {
    if (box && ok && !localStorage.getItem(KEY)) {
      box.classList.add('is-visible');
      ok.addEventListener('click', function () {
        localStorage.setItem(KEY, '1');
        box.classList.remove('is-visible');
      });
    }
  } catch (e) { /* almacenamiento no disponible */ }
})();
