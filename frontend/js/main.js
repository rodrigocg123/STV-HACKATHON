import "./mapas.js";

import "./movilidad.js";

import "./sostenibilidad.js";

import "./comercio.js";

/* ===============================
LOADER
=============================== */

window.addEventListener(
  "load",
  () => {

    const loader =
      document.getElementById(
        "loader"
      );

    setTimeout(() => {

      loader.classList.add(
        "hidden"
      );

    }, 1400);

  }
);

/* ===============================
KPIs ANIMADOS
=============================== */

function animateValue(
  element,
  start,
  end,
  duration,
  suffix = ""
) {

  if (!element) return;

  let startTimestamp = null;

  const step = (timestamp) => {

    if (!startTimestamp) {
      startTimestamp = timestamp;
    }

    const progress = Math.min(
      (timestamp - startTimestamp)
      / duration,
      1
    );

    const value = Math.floor(
      progress * (end - start)
      + start
    );

    element.textContent =
      value + suffix;

    if (progress < 1) {
      window.requestAnimationFrame(
        step
      );
    }

  };

  window.requestAnimationFrame(
    step
  );

}

/* ===============================
ANIMAR KPIs
=============================== */

window.addEventListener(
  "DOMContentLoaded",
  () => {

    animateValue(
      document.getElementById(
        "heroCongestion"
      ),
      0,
      72,
      1800,
      "%"
    );

    animateValue(
      document.getElementById(
        "heroSostenibilidad"
      ),
      0,
      84,
      2200,
      "%"
    );

    animateValue(
      document.getElementById(
        "heroActividad"
      ),
      0,
      18,
      2000,
      "%"
    );

    animateValue(
      document.getElementById(
        "kpiCongestion"
      ),
      0,
      72,
      1800,
      "%"
    );

    animateValue(
      document.getElementById(
        "kpiFlujo"
      ),
      0,
      18,
      2000,
      "%"
    );

    animateValue(
      document.getElementById(
        "kpiZonas"
      ),
      0,
      14,
      1700
    );

  }
);

/* ===============================
TIMELINE
=============================== */

const timelineButtons =
  document.querySelectorAll(
    ".timeline-btn"
  );

timelineButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        timelineButtons.forEach(
          (btn) => {

            btn.classList.remove(
              "active"
            );

          }
        );

        button.classList.add(
          "active"
        );

        updateTimelineMode(
          button.textContent
        );

      }
    );

  }
);

/* ===============================
TIMELINE LOGIC
=============================== */

function updateTimelineMode(
  mode
) {

  const aiPanel =
    document.querySelector(
      ".urban-ai"
    );

  if (!aiPanel) return;

  const insights =
    aiPanel.querySelectorAll(
      ".ai-insight"
    );

  if (
    mode.includes("Mañana")
  ) {

    insights[0].innerHTML =
      "⚠ Incremento de tráfico detectado en accesos escolares.";

    insights[1].innerHTML =
      "🚌 Refuerzo de movilidad urbana durante primeras horas.";

  }

  if (
    mode.includes("Tarde")
  ) {

    insights[0].innerHTML =
      "🚗 Alta densidad de tráfico prevista en el centro urbano.";

    insights[1].innerHTML =
      "🏪 Incremento de actividad comercial detectado.";

  }

  if (
    mode.includes("Noche")
  ) {

    insights[0].innerHTML =
      "🌙 Descenso de congestión urbana durante la noche.";

    insights[1].innerHTML =
      "⚡ Menor presión energética detectada.";

  }

}

/* ===============================
SCROLL HEADER EFFECT
=============================== */
window.addEventListener(
  "scroll",
  () => {

    const header =
      document.querySelector(
        "header"
      );

    if (!header) return;

    if (
      window.scrollY > 60
    ) {

      header.style.background =
        "rgba(7,17,31,.92)";

      header.style.boxShadow =
        "0 10px 40px rgba(0,0,0,.35)";

    } else {

      header.style.background =
        "rgba(7,17,31,.75)";

      header.style.boxShadow =
        "0 8px 30px rgba(0,0,0,.25)";

    }

  }
);
/* ===============================
SMOOTH SECTION REVEAL
=============================== */

const revealElements =
  document.querySelectorAll(
    ".fade-up"
  );

const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if (
            entry.isIntersecting
          ) {

            entry.target.style.opacity =
              "1";

            entry.target.style.transform =
              "translateY(0)";

          }

        }
      );

    },
    {
      threshold: 0.15
    }
  );

revealElements.forEach(
  (element) => {

    element.style.opacity =
      "0";

    element.style.transform =
      "translateY(40px)";

    element.style.transition =
      "all .9s ease";

    revealObserver.observe(
      element
    );

  }
);

/* ===============================
PARALLAX HERO
=============================== */

window.addEventListener(
  "scroll",
  () => {

    const hero =
      document.querySelector(
        ".hero"
      );

    if (!hero) return;

    hero.style.backgroundPositionY =
      `${window.scrollY * 0.4}px`;

  }
);

/* ===============================
LIVE CLOCK
=============================== */

function updateLiveClock() {

  const now =
    new Date();

  const hours =
    String(
      now.getHours()
    ).padStart(2, "0");

  const minutes =
    String(
      now.getMinutes()
    ).padStart(2, "0");

  const liveIndicator =
    document.querySelector(
      ".live-indicator"
    );

  if (!liveIndicator) return;

  liveIndicator.innerHTML = `
    <span class="live-dot"></span>
    ${hours}:${minutes} EN DIRECTO
  `;

}

updateLiveClock();

setInterval(
  updateLiveClock,
  1000
);

/* ===============================
MOBILE ACTIVE NAV
=============================== */

const sections =
  document.querySelectorAll(
    "section"
  );

const mobileLinks =
  document.querySelectorAll(
    ".mobile-nav a"
  );

window.addEventListener(
  "scroll",
  () => {

    let current =
      "";

    sections.forEach(
      (section) => {

        const sectionTop =
          section.offsetTop;

        if (
          pageYOffset >=
          sectionTop - 200
        ) {

          current =
            section.getAttribute(
              "id"
            );

        }

      }
    );

    mobileLinks.forEach(
      (link) => {

        link.classList.remove(
          "active"
        );

        if (
          link.getAttribute(
            "href"
          ) === `#${current}`
        ) {

          link.classList.add(
            "active"
          );

        }

      }
    );

  }
);

/* ===============================
FAKE LIVE DATA
=============================== */

setInterval(
  () => {

    const congestion =
      document.getElementById(
        "kpiCongestion"
      );

    if (!congestion) return;

    const random =
      Math.floor(
        68 + Math.random() * 8
      );

    congestion.textContent =
      `${random}%`;

  },
  6000
);
/* ===============================
URBAN PULSE TOGGLE
=============================== */

window.addEventListener(
  "DOMContentLoaded",
  () => {

    const togglePulse =
      document.getElementById(
        "togglePulse"
      );

    const urbanPulse =
      document.getElementById(
        "urbanPulse"
      );

    if (
      !togglePulse ||
      !urbanPulse
    ) return;

    togglePulse.addEventListener(
      "click",
      () => {

        urbanPulse.classList.toggle(
          "active"
        );

      }
    );

  }
);