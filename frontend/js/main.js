import "./mapas.js";
import "./movilidad.js";
import "./sostenibilidad.js";
import "./comercio.js";

/* ===============================
LOADER
=============================== */

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.classList.add("hidden"), 1400);
});

/* ===============================
KPIs ANIMADOS
=============================== */

function animateValue(element, start, end, duration, suffix = "") {
  if (!element) return;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.textContent = Math.floor(progress * (end - start) + start) + suffix;
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
}

window.addEventListener("DOMContentLoaded", () => {
  animateValue(document.getElementById("kpiCongestion"), 0, 72, 1800, "%");
  animateValue(document.getElementById("kpiFlujo"),      0, 18, 2000, "%");
  animateValue(document.getElementById("kpiZonas"),      0, 14, 1700);
});

/* ===============================
TIMELINE
=============================== */

/* ===============================
PANEL DE ZONAS DE TRÁFICO
=============================== */

const trafficZones = [
  { name: "Centro",        base: 72, trend: +3 },
  { name: "Sardinero",     base: 58, trend: +5 },
  { name: "Puerto Chico",  base: 84, trend: +2 },
  { name: "Universidades", base: 34, trend: -4 },
  { name: "Castilla",      base: 51, trend: +1 },
];

function trafficStatus(pct) {
  if (pct >= 80) return { label: "Alto tráfico", color: "#e74c3c" };
  if (pct >= 60) return { label: "Denso",         color: "#f39c12" };
  if (pct >= 40) return { label: "Moderado",      color: "#3498db" };
  return              { label: "Fluido",          color: "#2ecc71" };
}

function jitterTraffic(base, trend) {
  const v = base + trend * Math.random() * 0.4 + (Math.random() - 0.5) * 6;
  return Math.max(5, Math.min(98, Math.round(v)));
}

function renderTrafficZones() {
  const grid = document.getElementById("trafficZoneGrid");
  if (!grid) return;

  trafficZones.forEach(z => {
    let card = grid.querySelector(`[data-zone="${z.name}"]`);
    if (!card) {
      card = document.createElement("div");
      card.className = "traffic-zone-card";
      card.dataset.zone = z.name;
      grid.appendChild(card);
    }
    const pct   = jitterTraffic(z.base, z.trend);
    const s     = trafficStatus(pct);
    const arrow = z.trend > 0 ? "↑" : "↓";
    card.innerHTML = `
      <div class="tzc-name">${z.name}</div>
      <div class="tzc-label" style="color:${s.color}">${s.label}</div>
      <div class="tzc-bar-bg">
        <div class="tzc-bar-fill" style="width:${pct}%; background:${s.color}"></div>
      </div>
      <div class="tzc-footer">
        <span class="tzc-pct" style="color:${s.color}">${pct}%</span>
        <span class="tzc-trend">${arrow} tendencia</span>
      </div>
    `;
  });

  const el = document.getElementById("trafficLastUpdate");
  if (el) {
    const n = new Date();
    el.textContent = `${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}:${String(n.getSeconds()).padStart(2,"0")}`;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  renderTrafficZones();
  setInterval(renderTrafficZones, 15000);
});

/* ===============================
SMOOTH SECTION REVEAL
=============================== */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".fade-up").forEach((element) => {
  element.style.opacity    = "0";
  element.style.transform  = "translateY(40px)";
  element.style.transition = "all .9s ease";
  revealObserver.observe(element);
});

/* ===============================
PARALLAX HERO
=============================== */

window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  if (hero) hero.style.backgroundPositionY = `${window.scrollY * 0.4}px`;
});

/* ===============================
MOBILE ACTIVE NAV
=============================== */

const sections    = document.querySelectorAll("section");
const mobileLinks = document.querySelectorAll(".mobile-nav a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    if (pageYOffset >= section.offsetTop - 200) {
      current = section.getAttribute("id");
    }
  });
  mobileLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

/* ===============================
FAKE LIVE DATA — congestión
=============================== */

setInterval(() => {
  const congestion = document.getElementById("kpiCongestion");
  if (congestion) {
    congestion.textContent = `${Math.floor(68 + Math.random() * 8)}%`;
  }
}, 6000);

/* ===============================
TUS OVERLAY
=============================== */

const tusOverlay   = document.getElementById("tusOverlay");
const openTusMenu  = document.getElementById("openTusMenu");
const closeTusMenu = document.getElementById("closeTusMenu");
const btnCheckSaldo  = document.getElementById("btnCheckSaldo");
const btnRecargarBus = document.getElementById("btnRecargarBus");
const tusContent     = document.getElementById("tusContent");

openTusMenu?.addEventListener("click", () => {
  tusOverlay.classList.remove("hidden");
});

closeTusMenu?.addEventListener("click", () => {
  tusOverlay.classList.add("hidden");
});

tusOverlay?.addEventListener("click", (event) => {
  if (event.target === tusOverlay) tusOverlay.classList.add("hidden");
});

// ===============================
// NFC UI (reutilizable)
// ===============================

function renderNFC(texto) {
  tusContent.innerHTML = `
    <div class="nfc-zone">
      <div class="nfc-card-big">💳</div>
      <h3>Acerque su tarjeta</h3>
      <p class="nfc-status">${texto}</p>
    </div>
  `;
}

// ===============================
// SALDO
// ===============================

btnCheckSaldo?.addEventListener("click", () => {
  renderNFC("Esperando conexión inalámbrica...");
  setTimeout(() => {
    const saldo = (Math.random() * 25).toFixed(2);
    tusContent.innerHTML = `
      <div class="saldo-result">
        <h3>Tarjeta detectada</h3>
        <strong>${saldo}€</strong>
        <p>Saldo disponible TUS Santander</p>
      </div>
    `;
  }, 2000);
});

// ===============================
// RECARGAR TARJETA
// ===============================

btnRecargarBus?.addEventListener("click", () => {
  renderNFC("Esperando tarjeta para recarga...");
  setTimeout(() => {
    const saldoInicial = (Math.random() * 20).toFixed(2);
    tusContent.innerHTML = `
      <div class="recarga-input">
        <h3>Tarjeta detectada</h3>
        <p>Saldo actual: <strong>${saldoInicial}€</strong></p>
        <input id="cantidadRecarga" type="number" placeholder="Cantidad a recargar">
        <button id="confirmarRecarga">Confirmar recarga</button>
      </div>
    `;
    document.getElementById("confirmarRecarga")?.addEventListener("click", () => {
      const cantidad    = parseFloat(document.getElementById("cantidadRecarga").value) || 0;
      const nuevoSaldo  = (parseFloat(saldoInicial) + cantidad).toFixed(2);
      tusContent.innerHTML = `
        <div class="saldo-result">
          <h3>✓ Recarga completada</h3>
          <strong>${nuevoSaldo}€</strong>
          <p>Nuevo saldo disponible</p>
        </div>
      `;
    });
  }, 2000);
});
