# Robbie Laughlen — personal site

One page around a spinning 3D disc: experience, recognition and CV.

- `index.html` — all content, static HTML
- `styles.css` — styles (Inter Tight + IBM Plex Mono)
- `js/disc.js` — the disc (three.js via CDN): `mountDisc(canvas, opts)`
- `data/` — CV (UK/EU) and résumé (NA) PDFs

No build step. Preview with `python -m http.server` and open http://localhost:8000
