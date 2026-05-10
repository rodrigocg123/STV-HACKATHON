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

      }
    );

  }
);

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

    let current = "";

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
TUS OVERLAY
=============================== */

const tusOverlay =
  document.getElementById(
    "tusOverlay"
  );

const openTusMenu =
  document.getElementById(
    "openTusMenu"
  );

const closeTusMenu =
  document.getElementById(
    "closeTusMenu"
  );

const btnCheckSaldo =
  document.getElementById(
    "btnCheckSaldo"
  );

const btnRecargarBus =
  document.getElementById(
    "btnRecargarBus"
  );

const tusContent =
  document.getElementById(
    "tusContent"
  );

// ===============================
// OPEN
// ===============================

openTusMenu?.addEventListener(
  "click",
  () => {

    tusOverlay.classList.remove(
      "hidden"
    );

  }
);

// ===============================
// CLOSE BUTTON
// ===============================

closeTusMenu?.addEventListener(
  "click",
  () => {

    tusOverlay.classList.add(
      "hidden"
    );

  }
);


// ===============================
// CLOSE OUTSIDE
// ===============================

tusOverlay?.addEventListener(
  "click",
  (event) => {

    if (
      event.target === tusOverlay
    ) {

      tusOverlay.classList.add(
        "hidden"
      );

    }

  }
);

// ===============================
// NFC UI
// ===============================

function renderNFC(texto) {

  tusContent.innerHTML = `

    <div class="nfc-zone">

      <div class="nfc-card-big">
        💳
      </div>

      <h3>
        Acerque su tarjeta
      </h3>

      <p class="nfc-status">
        ${texto}
      </p>

    </div>

  `;

}

// ===============================
// SALDO
// ===============================

btnCheckSaldo?.addEventListener(
  "click",
  () => {

    renderNFC(
      "Esperando conexión inalámbrica..."
    );

    setTimeout(() => {

      const saldo =
        (
          Math.random() * 25
        ).toFixed(2);

      tusContent.innerHTML = `

        <div class="saldo-result">

          <h3>
            Tarjeta detectada
          </h3>

          <strong>
            ${saldo}€
          </strong>

          <p>
            Saldo disponible TUS Santander
          </p>

        </div>

      `;

    }, 5000);

  }
);


/* ===============================
RECARGAR TARJETA
=============================== */

btnRecargarBus?.addEventListener(
  "click",
  () => {

    renderNFC(
      "Esperando tarjeta para recarga..."
    );

    setTimeout(() => {

      const saldoInicial =
        (
          Math.random() * 20
        ).toFixed(2);

      tusContent.innerHTML = `

        <div class="recarga-input">

          <h3>
            Tarjeta detectada
          </h3>

          <p>

            Saldo actual:
            <strong>
              ${saldoInicial}€
            </strong>

          </p>

          <input
            id="cantidadRecarga"
            type="number"
            placeholder="Cantidad a recargar"
          >

          <button id="confirmarRecarga">

            Confirmar recarga

          </button>

        </div>

      `;

      document
        .getElementById(
          "confirmarRecarga"
        )
        ?.addEventListener(
          "click",
          () => {

            const cantidad = parseFloat(

              document.getElementById(
                "cantidadRecarga"
              ).value

            ) || 0;

            const nuevoSaldo = (

              parseFloat(saldoInicial) +
              cantidad

            ).toFixed(2);

            tusContent.innerHTML = `

              <div class="saldo-result">

                <h3>

                  ✓ Recarga completada

                </h3>

                <strong>

                  ${nuevoSaldo}€

                </strong>

                <p>

                  Nuevo saldo disponible

                </p>

              </div>

            `;

          }
        );

    }, 5000);

  }
);