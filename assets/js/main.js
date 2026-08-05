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

  /* Scroll suave SOLO para anclas dentro de la misma página (el aterrizaje
     desde otra página con #fragmento queda instantáneo, sin animación). */
  var suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var destino = document.getElementById(a.getAttribute('href').slice(1));
    if (!destino) return;
    e.preventDefault();
    destino.scrollIntoView({ behavior: suave ? 'smooth' : 'auto' });
    history.pushState(null, '', a.getAttribute('href'));
  });

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

  /* Parche de contraste del widget ERD sobre fondo oscuro: el panel envía la
     fecha del paso de hora con style="color:#000 !important" en línea, que
     ninguna hoja CSS puede anular; lo reescribimos al pintar y en cada paso. */
  var mount = document.querySelector('.erd-mount:not(.erd-mount--light)');
  if (mount && 'MutationObserver' in window) {
    var reparar = function () {
      mount.querySelectorAll('.checkout-slots-heading, .checkout-slots-heading__date').forEach(function (el) {
        el.style.setProperty('color', '#e9e2d6', 'important');
      });
      /* Fondo de la sala en el panel de horas: si el juego no tiene imagen
         configurada en el panel de ERD, inyectamos la nuestra imitando el
         div .game-background que el widget crea para los juegos que sí. */
      var deseado = mount.getAttribute('data-game-bg');
      if (deseado) {
        var host = mount.querySelector('.extended-game-with-slots');
        if (host && !host.querySelector('.game-background')) {
          var logo = document.querySelector('.header__logo img');
          var base = logo ? logo.getAttribute('src').replace(/logo\.webp$/, '') : './assets/img/';
          var bg = document.createElement('div');
          bg.className = 'game-background';
          bg.style.cssText = 'background-image:url(' + base + deseado + ');opacity:.7';
          host.insertBefore(bg, host.firstChild);
        }
      }
    };
    new MutationObserver(reparar).observe(mount, { childList: true, subtree: true });
    reparar();
  }

  /* Los avisos del widget ERD llegan como alert() nativos del navegador;
     los mostramos como un modal integrado en el diseño. */
  var alertNativo = window.alert.bind(window);
  window.alert = function (msg) {
    try {
      var overlay = document.createElement('div');
      overlay.className = 'aviso-modal';
      overlay.setAttribute('role', 'alertdialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Aviso');
      var caja = document.createElement('div');
      caja.className = 'aviso-modal__caja';
      var titulo = document.createElement('h2');
      titulo.textContent = 'Aviso';
      var texto = document.createElement('p');
      texto.textContent = String(msg);
      var boton = document.createElement('button');
      boton.className = 'btn btn--blood';
      boton.type = 'button';
      boton.textContent = 'Aceptar';
      var tecla = function (e) { if (e.key === 'Escape') cerrar(); };
      var cerrar = function () { overlay.remove(); document.removeEventListener('keydown', tecla); };
      boton.addEventListener('click', cerrar);
      overlay.addEventListener('click', function (e) { if (e.target === overlay) cerrar(); });
      document.addEventListener('keydown', tecla);
      caja.append(titulo, texto, boton);
      overlay.append(caja);
      document.body.append(overlay);
      boton.focus();
    } catch (e) { alertNativo(msg); }
  };

  /* Reseñas: carrusel automático suave con bucle infinito. Se pausa con el
     ratón encima, al tocar/arrastrar o al navegar con teclado, y no se activa
     si el usuario prefiere movimiento reducido. */
  var reviews = document.querySelector('.reviews');
  if (reviews && reviews.children.length > 1 && suave) {
    Array.prototype.slice.call(reviews.children).forEach(function (c) {
      var clon = c.cloneNode(true);
      clon.setAttribute('aria-hidden', 'true');
      reviews.append(clon);
    });
    reviews.classList.add('reviews--auto');
    var pausa = 0;
    var pausar = function (ms) { pausa = Date.now() + (ms || 0); };
    reviews.addEventListener('pointerenter', function () { pausar(1e9); });
    reviews.addEventListener('pointerleave', function () { pausar(600); });
    reviews.addEventListener('pointerdown', function () { pausar(1e9); });
    reviews.addEventListener('pointerup', function () { pausar(3000); });
    reviews.addEventListener('wheel', function () { pausar(3000); }, { passive: true });
    reviews.addEventListener('touchstart', function () { pausar(1e9); }, { passive: true });
    reviews.addEventListener('touchend', function () { pausar(3000); });
    reviews.addEventListener('focusin', function () { pausar(1e9); });
    reviews.addEventListener('focusout', function () { pausar(1500); });
    var VELOCIDAD = 32; // píxeles por segundo, independiente de los FPS
    var previo = null;
    var paso = function (t) {
      if (previo !== null && Date.now() > pausa && document.visibilityState === 'visible') {
        var mitad = reviews.scrollWidth / 2;
        var avance = Math.min((t - previo) / 1000, .1) * VELOCIDAD;
        reviews.scrollLeft = reviews.scrollLeft >= mitad ? reviews.scrollLeft - mitad : reviews.scrollLeft + avance;
      }
      previo = t;
      requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

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
