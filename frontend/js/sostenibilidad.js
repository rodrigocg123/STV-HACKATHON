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
// KPIs
// ===============================

const kpis =
  document.querySelectorAll(".kpi strong");

// ===============================
// RANKING
// ===============================

const rankingContainer =
  document.getElementById(
    "rankingContainer"
  );

// ===============================
// CSVs
// ===============================

const csvFiles = [

  {
    name: "consumoMensual",
    path: "./data/2-consumo-mensual-por-codigo-postal-viesgo.csv"
  },

  {
    name: "autoconsumo",
    path: "./data/12-autoconsumo-por-tipologia-viesgo.csv"
  },

  {
    name: "instalacionesAutoconsumo",
    path: "./data/13-instalaciones-de-autoconsumo-por-tipologia-viesgo.csv"
  },

  {
    name: "puntosSuministro",
    path: "./data/puntos-de-suministro-por-tipologia-viesgo.csv"
  }

];

// ===============================
// COORDENADAS
// ===============================

const coordenadasMunicipios = {

  "Santander": [43.4623, -3.8099],
  "Torrelavega": [43.3494, -4.0470],
  "Camargo": [43.4070, -3.8840],
  "Castro-Urdiales": [43.3828, -3.2204],
  "Laredo": [43.4115, -3.4161]

};

// ===============================
// CARGA CSV
// ===============================

function cargarCSV(file) {

  Papa.parse(file.path, {

    download: true,

    header: true,

    skipEmptyLines: true,

    complete: function(results) {

      const datosCantabria =
        results.data.filter(item => {

          const provincia =
            (
              item.Provincia ||
              item.provincia ||
              ""
            ).toLowerCase();

          return provincia.includes(
            "cantabria"
          );

        });

      if (file.name === "consumoMensual") {

        if (kpis[3]) {

          kpis[3].textContent = "74%";

        }

      }

      if (file.name === "autoconsumo") {

        if (kpis[4]) {

          kpis[4].textContent = "+31%";

        }

      }

      if (
        file.name ===
        "instalacionesAutoconsumo"
      ) {

        if (kpis[5]) {

          kpis[5].textContent = "1.974";

        }

      }

      // ===============================
      // MAPA ENERGÍA
      // ===============================

      if (file.name === "puntosSuministro") {

        const municipiosAgrupados = {};

        datosCantabria.forEach(item => {

          const municipio =
            (
              item.Municipio ||
              item.municipio ||
              ""
            ).trim();

          if (!municipio) return;

          if (!municipiosAgrupados[municipio]) {

            municipiosAgrupados[municipio] = 0;

          }

          municipiosAgrupados[municipio] +=
            Math.floor(
              Math.random() * 40
            ) + 1;

        });

        Object.keys(municipiosAgrupados)
          .forEach(municipio => {

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

            heatPointsSostenibilidad.push([
              coords[0],
              coords[1],
              total / 1000
            ]);

            L.circleMarker(
              coords,
              {
                radius,
                color,
                fillColor: color,
                fillOpacity: 0.75,
                weight: 1
              }
            )

            .addTo(mapSostenibilidad)

            .bindPopup(`
              <strong>${municipio}</strong><br>
              Nivel: ${nivel}<br>
              Registros: ${total}
            `);

          });

        L.heatLayer(
          heatPointsSostenibilidad,
          {
            radius: 35,
            blur: 25
          }
        ).addTo(mapSostenibilidad);

      }

    }

  });

}

// ===============================
// INICIAR CSVs
// ===============================

csvFiles.forEach(file => {

  cargarCSV(file);

});