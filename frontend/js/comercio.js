import {
  mapComercio
} from "./mapas.js";

// ===============================
// CAPAS
// ===============================

const capaComercio =
  L.layerGroup();

const capaHeatComercio =
  L.layerGroup();

// ===============================
// KPIs
// ===============================

const kpis =
  document.querySelectorAll(
    ".kpi strong"
  );

// ===============================
// RANKING
// ===============================

const rankingContainer =
  document.getElementById(
    "rankingContainer"
  );

// ===============================
// DATOS MOCK
// ===============================

const comercioData = [

  {

    municipio:
    "Santander",

    coords:
    [43.4623, -3.8099],

    actividad:
    96,

    crecimiento:
    18,

    locales:
    1240

  },

  {

    municipio:
    "Torrelavega",

    coords:
    [43.3494, -4.0470],

    actividad:
    74,

    crecimiento:
    11,

    locales:
    820

  },

  {

    municipio:
    "Camargo",

    coords:
    [43.4070, -3.8840],

    actividad:
    68,

    crecimiento:
    9,

    locales:
    640

  },

  {

    municipio:
    "Castro-Urdiales",

    coords:
    [43.3828, -3.2204],

    actividad:
    59,

    crecimiento:
    7,

    locales:
    510

  },

  {

    municipio:
    "Laredo",

    coords:
    [43.4115, -3.4161],

    actividad:
    52,

    crecimiento:
    5,

    locales:
    430

  }

];

// ===============================
// POPUP PREMIUM
// ===============================

function crearPopup({

  municipio,
  actividad,
  crecimiento,
  locales

}) {

  return `

    <div class="premium-popup">

      <div class="popup-header">

        <h3>
          🏪 ${municipio}
        </h3>

      </div>

      <div class="popup-body">

        <p>
          Actividad comercial detectada.
        </p>

        <div class="popup-metrics">

          <div>

            <span>
              Actividad
            </span>

            <strong>
              ${actividad}%
            </strong>

          </div>

          <div>

            <span>
              Crecimiento
            </span>

            <strong>
              +${crecimiento}%
            </strong>

          </div>

          <div>

            <span>
              Locales
            </span>

            <strong>
              ${locales}
            </strong>

          </div>

        </div>

      </div>

    </div>

  `;

}

// ===============================
// COLOR ACTIVIDAD
// ===============================

function obtenerColor(
  actividad
) {

  if (
    actividad >= 85
  ) {
    return "#00bfff";
  }

  if (
    actividad >= 70
  ) {
    return "#00ffae";
  }

  if (
    actividad >= 55
  ) {
    return "#ffb703";
  }

  return "#ff5e5e";

}

// ===============================
// RADIO ACTIVIDAD
// ===============================

function obtenerRadio(
  actividad
) {

  return actividad / 3;

}

// ===============================
// GENERAR MUNICIPIOS
// ===============================

comercioData.forEach(

  (zona) => {

    const color =
      obtenerColor(
        zona.actividad
      );

    const radius =
      obtenerRadio(
        zona.actividad
      );

    const circle =
      L.circleMarker(

        zona.coords,

        {

          radius:
          radius,

          color:
          color,

          fillColor:
          color,

          fillOpacity:
          0.72,

          weight:
          1.5

        }

      );

    circle.bindPopup(

      crearPopup({

        municipio:
        zona.municipio,

        actividad:
        zona.actividad,

        crecimiento:
        zona.crecimiento,

        locales:
        zona.locales

      })

    );

    circle.addTo(
      capaComercio
    );

  }

);

// ===============================
// HEATMAP
// ===============================

const heatData =

  comercioData.map(
    zona => [

      zona.coords[0],

      zona.coords[1],

      zona.actividad / 100

    ]
  );

const heatLayer = L.heatLayer(

  heatData,

  {

    radius:
    40,

    blur:
    28,

    maxZoom:
    15,

    gradient: {

      0.2:
      "#00ffae",

      0.4:
      "#ffee00",

      0.6:
      "#ffae00",

      0.8:
      "#ff5e00",

      1:
      "#ff2d55"

    }

  }

);

capaHeatComercio.addLayer(
  heatLayer
);

// ===============================
// RANKING
// ===============================

function generarRanking() {

  rankingContainer.innerHTML =
    "";

  const ordenados =

    [...comercioData]

    .sort(
      (
        a,
        b
      ) =>

        b.actividad -
        a.actividad

    );

  ordenados.forEach(

    (
      municipio,
      index
    ) => {

      const item =
        document.createElement(
          "div"
        );

      item.classList.add(
        "ranking-item"
      );

      item.innerHTML = `

        <span>
          #${index + 1}
          ${municipio.municipio}
        </span>

        <strong>
          ${municipio.actividad}%
        </strong>

      `;

      rankingContainer.appendChild(
        item
      );

    }

  );

}

// ===============================
// KPIs
// ===============================

function actualizarKPIs() {

  if (kpis[6]) {

    kpis[6].textContent =
      "+18%";

  }

  if (kpis[7]) {

    kpis[7].textContent =
      "42";

  }

  if (kpis[8]) {

    kpis[8].textContent =
      "12";

  }

}

// ===============================
// MAPA
// ===============================

mapComercio.addLayer(
  capaComercio
);

mapComercio.addLayer(
  capaHeatComercio
);

// ===============================
// INIT
// ===============================

generarRanking();

actualizarKPIs();

// ===============================
// ANIMACIÓN INICIAL
// ===============================

setTimeout(

  () => {

    mapComercio.flyTo(

      [43.4623, -3.8099],

      11,

      {

        duration:
        2

      }

    );

  },

  1400

);

// ===============================
// DEBUG
// ===============================

console.log(
  "Módulo comercio cargado"
);