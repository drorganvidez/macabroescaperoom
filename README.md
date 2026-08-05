# Macabro Escape Room — web estática

Remodelación de [macabroescaperoom.com](https://www.macabroescaperoom.com) como sitio 100% estático:
sin WordPress, sin frameworks, sin build. HTML + CSS + ~40 líneas de JavaScript.

- **Producción:** https://macabroescaperoom.davidromero.dev (GitHub Pages + archivo `CNAME`)
- **Contenido:** textos, logo e imágenes originales del sitio WordPress, transcritos literalmente.
- **Reservas:** widget de [Escape Room Director](https://erdpanel.com) idéntico al original
  (La Ciega `data-game=101570`, Necronomicón y Reservas `data-game=101205`, bonos `data-type=coupon`).

## Estructura

```
index.html                  Portada (salas, modos, cómo funciona, reseñas, ubicación)
la-ciega/                   Sala La Ciega + calendario de reservas (ERD, estilo Light)
necronomicon/               Sala Necronomicón + calendario de reservas (ERD, estilo Dark)
reservas/                   Modos de juego + calendario general (ERD)
tarifas/                    Tabla de precios + accesos a las salas
bonos-regalos/              Bonos regalo + widget de compra de cupones (ERD)
preguntas-frecuentes/       FAQ (14 preguntas, acordeones nativos <details>)
contacto/                   Contacto + mapa
aviso-legal/  politica-de-privacidad/  politica-de-cookies/  terminos-y-condiciones/
salas/  galeria/            Redirecciones de páginas antiguas del WordPress
assets/css/styles.css       Única hoja de estilos
assets/js/main.js           Menú móvil, tráilers (click-to-load) y aviso de cookies
assets/fonts/               Cinzel 700 autoalojada (woff2, licencia SIL OFL)
assets/img/                 Imágenes originales optimizadas a WebP
404.html  robots.txt  sitemap.xml  CNAME  .nojekyll
```

Las URLs replican las del WordPress original (`/la-ciega/`, `/tarifas/`…), así que los enlaces
y el posicionamiento existentes se conservan.

## Despliegue

1. Subir el contenido de esta carpeta a la rama `main` del repo `drorganvidez/macabroescaperoom`.
2. En GitHub: *Settings → Pages → Deploy from a branch → main / (root)*.
3. En el DNS de `davidromero.dev`: `CNAME macabroescaperoom → drorganvidez.github.io`.
4. En *Settings → Pages*, confirmar el dominio `macabroescaperoom.davidromero.dev` y activar *Enforce HTTPS*.

## Desarrollo local

```bash
python3 -m http.server 8000
# http://localhost:8000
```

(Hace falta servidor porque las rutas son absolutas desde la raíz; abrir el archivo directamente no funciona.)

## Notas de mantenimiento

- Los textos de los tráilers, precios y FAQ están directamente en el HTML de cada página.
- El widget de reservas se carga con el script oficial de ERD (`erdpanel.com/dist/build.js`);
  si ERD cambia el `token` o los `game id`, basta editar el `div id="app"` de la página afectada.
- Las reseñas de Google están incrustadas estáticamente (las 10 del widget Trustindex original).
  Para actualizarlas, editar la sección de reseñas de `index.html`.
