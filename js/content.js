// Renders the page content from data.js.
import { site } from "../data.js";

const $ = (s) => document.querySelector(s);

$("#name").innerHTML = site.name.replace(" ", "<br>");
$("#tag").textContent = `${site.tagline} — ${site.location}`;

$("#content").innerHTML = `
<section id="notes"><div class="wrap">
  <div class="head"><h2>Liner notes</h2><span class="mono">A / 01</span></div>
  <div class="about"><p>${site.about}</p>
    <dl>${site.facts.map(([k, v]) => `<div><dt class="mono">${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
  </div>
</div></section>

<section id="credits"><div class="wrap">
  <div class="head"><h2>Credits</h2><span class="mono">A / 02</span></div>
  ${site.jobs.map((j) => `<div class="job"><div class="mono">${j.when}<br>${j.org}</div>
    <div><h3>${j.role}, ${j.org}</h3><ul>${j.points.map((p) => `<li>${p}</li>`).join("")}</ul></div></div>`).join("")}
  <ul class="awards">${site.awards.map(([y, a]) => `<li><span class="mono">${y}</span>${a}</li>`).join("")}</ul>
</div></section>

<section id="sheet"><div class="wrap">
  <div class="head"><h2>Contact sheet</h2><span class="mono">B / 01 — Projects</span></div>
  <div class="sheet">${site.projects.map((p, i) => `
    <a class="frame" data-n="${String(i + 12).padStart(2, "0")}A" href="${p.href}" target="_blank" rel="noopener">
      <img src="${p.img}" alt="${p.title}" loading="lazy">
      <div class="cap"><b>${p.title}</b>${p.desc}<br><small class="mono">${p.year} · ${p.stack}</small></div>
    </a>`).join("")}</div>
</div></section>

<section id="tracks"><div class="wrap">
  <div class="head"><h2>Tracklist</h2><span class="mono">B / 02 — Music</span></div>
  <ol class="tracks">${site.music.map((m) => `<li><a href="${m.href}" target="_blank" rel="noopener">
    <img src="${m.img}" alt=""><div><b>${m.title}</b><p>${m.desc}</p></div><span class="mono">${m.year}</span></a></li>`).join("")}</ol>
</div></section>

<section id="contact" class="contact"><div class="wrap">
  <div class="head"><h2>Contact</h2><span class="mono">Side C</span></div>
  <a class="email" href="mailto:${site.email}">${site.email}</a>
  <div class="links mono">${site.links.map(([l, h]) => `<a href="${h}" target="_blank" rel="noopener">${l} ↗</a>`).join("")}</div>
  <footer class="mono"><span>© 2025 ${site.name}</span><a href="#">Top ↑</a></footer>
</div></section>`;

