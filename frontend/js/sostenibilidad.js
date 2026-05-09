import {
  mapSostenibilidad
} from "./mapas.js";

import {

  obtenerColor,
  obtenerRadio,
  obtenerNivel

} from "./utils.js";

// ===============================
// HEATMAP
// ===============================

const heatPointsSostenibilidad = [];

// ===============================
// CAPAS
// ===============================

const capaEnergia =
  L.layerGroup();

const capaHeat =
  L.layerGroup();

// ===============================
// KPIs
// ===============================

const kpis =
  document.querySelectorAll(
    ".kpi strong"
  );

// ===============================
// CSVs
// ===============================

const csvFiles = [

  {

    name:
    "consumoMensual",

    path:
    "./data/2-consumo-mensual-por-codigo-postal-viesgo.csv"

  },

  {

    name:
    "autoconsumo",

    path:
    "./data/12-autoconsumo-por-tipologia-viesgo.csv"

  },

  {

    name:
    "instalacionesAutoconsumo",

    path:
    "./data/13-instalaciones-de-autoconsumo-por-tipologia-viesgo.csv"

  },

  {

    name:
    "puntosSuministro",

    path:
    "./data/puntos-de-suministro-por-tipologia-viesgo.csv"

  }

];

// ===============================
// COORDENADAS
// ===============================

const coordenadasMunicipios = {

  "Santander":
  [43.4623, -3.8099],

  "Torrelavega":
  [43.3494, -4.0470],

  "Camargo":
  [43.4070, -3.8840],

  "Castro-Urdiales":
  [43.3828, -3.2204],

  "Laredo":
  [43.4115, -3.4161]

};

// ===============================
// POPUP PREMIUM
// ===============================

function crearPopup({

  municipio,
  nivel,
  total,
  eficiencia

}) {

  return `

    <div class="premium-popup">

      <div class="popup-header">

        <h3>
          ⚡ ${municipio}
        </h3>

      </div>

      <div class="popup-body">

        <p>
          Nivel energético:
          <strong>${nivel}</strong>
        </p>

        <div class="popup-metrics">

          <div>

            <span>
              Registros
            </span>

            <strong>
              ${total}
            </strong>

          </div>

          <div>

            <span>
              Eficiencia
            </span>

            <strong>
              ${eficiencia}%
            </strong>

          </div>

        </div>

      </div>

    </div>

  `;

}

// ===============================
// ACTUALIZAR KPIs
// ===============================

function actualizarKPIs(
  fileName
) {

  if (
    fileName ===
    "consumoMensual"
  ) {

    if (kpis[3]) {

      kpis[3].textContent =
        "74%";

    }

  }

  if (
    fileName ===
    "autoconsumo"
  ) {

    if (kpis[4]) {

      kpis[4].textContent =
        "+31%";

    }

  }

  if (
    fileName ===
    "instalacionesAutoconsumo"
  ) {

    if (kpis[5]) {

      kpis[5].textContent =
        "1.974";

    }

  }

}

// ===============================
// GENERAR MUNICIPIOS
// ===============================

function generarMapaEnergia(
  datosCantabria
) {

  const municipiosAgrupados = {};

  datosCantabria.forEach(
    (item) => {

      const municipio = (

        item.Municipio ||

        item.municipio ||

        ""

      ).trim();

      if (!municipio) return;

      if (
        !municipiosAgrupados[
          municipio
        ]
      ) {

        municipiosAgrupados[
          municipio
        ] = 0;

      }

      municipiosAgrupados[
        municipio
      ] +=

      Math.floor(
        Math.random() * 40
      ) + 1;

    }
  );

  Object.keys(
    municipiosAgrupados
  )

  .forEach(
    (municipio) => {

      const coords =

        coordenadasMunicipios[
          municipio
        ];

      if (!coords) return;

      const total =

        municipiosAgrupados[
          municipio
        ];

      const color =
        obtenerColor(total);

      const radius =
        obtenerRadio(total);

      const nivel =
        obtenerNivel(total);

      const eficiencia =
        Math.floor(
          70 + Math.random() * 20
        );

      heatPointsSostenibilidad.push([

        coords[0],
        coords[1],
        total / 1000

      ]);

      const circle = L.circleMarker(

        coords,

        {

          radius:
          radius,

          color:
          color,

          fillColor:
          color,

          fillOpacity:
          0.75,

          weight:
          1.5

        }

      );

      circle.bindPopup(

        crearPopup({

          municipio,
          nivel,
          total,
          eficiencia

        })

      );

      circle.addTo(
        capaEnergia
      );

    }
  );

}

// ===============================
// GENERAR HEATMAP
// ===============================

function generarHeatmap() {

  const heat = L.heatLayer(

    heatPointsSostenibilidad,

    {

      radius:
      35,

      blur:
      25,

      maxZoom:
      16,

      gradient: {

        0.2:
        "#00ffae",

        0.4:
        "#d9ff00",

        0.6:
        "#ffae00",

        0.8:
        "#ff5e00",

        1:
        "#ff2d55"

      }

    }

  );

  capaHeat.addLayer(
    heat
  );

  capaHeat.addTo(
    mapSostenibilidad
  );

}

// ===============================
// CARGA CSV
// ===============================

function cargarCSV(
  file
) {

  Papa.parse(

    file.path,

    {

      download:
      true,

      header:
      true,

      skipEmptyLines:
      true,

      complete:
      function(results) {

        const datosCantabria =

          results.data.filter(
            item => {

              const provincia = (

                item.Provincia ||

                item.provincia ||

                ""

              ).toLowerCase();

              return provincia.includes(
                "cantabria"
              );

            }
          );

        actualizarKPIs(
          file.name
        );

        if (
          file.name ===
          "puntosSuministro"
        ) {

          generarMapaEnergia(
            datosCantabria
          );

          generarHeatmap();

        }

      }

    }

  );

}

// ===============================
// INICIAR CSVs
// ===============================

csvFiles.forEach(
  file => {

    cargarCSV(
      file
    );

  }
);

// ===============================
// ACTIVAR CAPAS
// ===============================

mapSostenibilidad.addLayer(
  capaEnergia
);

// ===============================
// ANIMACIÓN INICIAL
// ===============================

setTimeout(

  () => {

    mapSostenibilidad.flyTo(

      [43.4623, -3.8099],

      11,

      {

        duration:
        2

      }

    );

  },

  1200

);