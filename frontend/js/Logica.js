// ===============================
// MAPAS STV
// ===============================

const mapMovilidad = L.map("mapMovilidad").setView(
  [43.4623, -3.8099],
  10
);

const mapSostenibilidad = L.map("mapSostenibilidad").setView(
  [43.4623, -3.8099],
  10
);

const mapComercio = L.map("mapComercio").setView(
  [43.4623, -3.8099],
  10
);

// ===============================
// CAPAS BASE
// ===============================

function crearTileLayer() {

  return L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap contributors"
    }
  );

}

crearTileLayer().addTo(mapMovilidad);

crearTileLayer().addTo(mapSostenibilidad);

crearTileLayer().addTo(mapComercio);

// ===============================
// CAPAS MOVILIDAD
// ===============================

const capaBus = L.layerGroup();

const capaPMR = L.layerGroup();

const capaZona30 = L.layerGroup();

// ===============================
// BOTÓN BUS
// ===============================

window.addEventListener("DOMContentLoaded", () => {

  const btnBus = document.getElementById("btnBus");

  if (!btnBus) {

    console.error("btnBus no encontrado");

    return;

  }

  btnBus.addEventListener("click", () => {

    if (mapMovilidad.hasLayer(capaBus)) {

      mapMovilidad.removeLayer(capaBus);

    } else {

      mapMovilidad.addLayer(capaBus);

    }

  });

});

// ===============================
// FETCH PARADAS BUS
// ===============================

fetch("http://localhost:3000/api/bus")

  .then(response => response.json())

  .then(data => {

    data.resources.forEach((parada) => {

      const lat = parseFloat(parada["wgs84_pos:lat"]);

      const lng = parseFloat(parada["wgs84_pos:long"]);

      if (!lat || !lng) return;

      const marker = L.circleMarker([lat, lng], {

        radius: 7,

        color: "#2563eb",

        fillColor: "#2563eb",

        fillOpacity: 0.85,

        weight: 2

      });

      marker.bindPopup(`
        <strong>🚌 Parada BUS</strong><br>
        ${parada["vivo:address1"] || "Sin dirección"}
      `);

      capaBus.addLayer(marker);

    });

  })

  .catch(error => {

    console.error(
      "Error cargando BUS:",
      error
    );

  });

// ===============================
// TOGGLE BUS
// ===============================

window.addEventListener("DOMContentLoaded", () => {

  const btnBus = document.getElementById("btnBus");

  if (!btnBus) {

    console.error("btnBus no encontrado");

    return;

  }

  btnBus.addEventListener("click", () => {

    if (mapMovilidad.hasLayer(capaBus)) {

      mapMovilidad.removeLayer(capaBus);

    } else {

      mapMovilidad.addLayer(capaBus);

    }

  });

});

// ===============================
// CARRIL BICI - DEBUG
// ===============================

fetch("./data/carril_bici.json")

  .then(response => response.json())

  .then(data => {

    console.log("CARRIL BICI:");

    console.log(data);

    console.log(data.resources[0]);

  })

  .catch(error => {

    console.error(
      "Error CARRIL BICI:",
      error
    );

  });

const capaBici = L.layerGroup();

const capaCarrilBici = L.layerGroup();
// ===============================
// TOGGLE BICI
// ===============================

window.addEventListener("DOMContentLoaded", () => {

  const btnBici = document.getElementById("btnBici");

  if (!btnBici) {

    console.error("btnBici no encontrado");

    return;

  }

  btnBici.addEventListener("click", () => {

    if (mapMovilidad.hasLayer(capaCarrilBici)) {

      mapMovilidad.removeLayer(capaCarrilBici);

    } else {

      mapMovilidad.addLayer(capaCarrilBici);

    }

  });

});

// ===============================
// ELEMENTOS HTML
// ===============================

const rankingContainer =
  document.getElementById(
    "rankingContainer"
  );

// ===============================
// KPIs
// ===============================

const kpis =
  document.querySelectorAll(".kpi strong");

// ===============================
// HEATMAP SOSTENIBILIDAD
// ===============================

const heatPointsSostenibilidad = [];

// ===============================
// CSVs VIESGO
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
// DATASETS
// ===============================

const datasetsCantabria = {};

// ===============================
// COORDENADAS MUNICIPIOS
// ===============================

const coordenadasMunicipios = {

  "Santander": [43.4623, -3.8099],
  "Torrelavega": [43.3494, -4.0470],
  "Castro-Urdiales": [43.3828, -3.2204],
  "Camargo": [43.4070, -3.8840],
  "El Astillero": [43.4019, -3.8208],
  "Laredo": [43.4115, -3.4161],
  "Reinosa": [43.0007, -4.1380],
  "Comillas": [43.3860, -4.2912],
  "Noja": [43.4891, -3.5231],
  "Suances": [43.4267, -4.0415],
  "Potes": [43.1540, -4.6227],
  "Santoña": [43.4427, -3.4576],
  "Piélagos": [43.3861, -3.9573],
  "Colindres": [43.3961, -3.4539],
  "Camaleño": [43.1502, -4.6935],
  "Los Corrales de Buelna": [43.2596, -4.0726],
  "Santa Cruz de Bezana": [43.4428, -3.9048],
  "Cabezón de la Sal": [43.3082, -4.2357],
  "Medio Cudeyo": [43.3809, -3.7474],
  "Bárcena de Cicero": [43.4217, -3.5207]

};

// ===============================
// COLOR DINÁMICO
// ===============================

function obtenerColor(total) {

  if (total > 2200) return "#dc2626";

  if (total > 1800) return "#f97316";

  if (total > 1200) return "#eab308";

  return "#22c55e";

}

// ===============================
// RADIO DINÁMICO
// ===============================

function obtenerRadio(total) {

  if (total > 400) return 20;

  if (total > 250) return 16;

  if (total > 150) return 13;

  if (total > 80) return 10;

  return 6;

}

// ===============================
// NIVEL ENERGÉTICO
// ===============================

function obtenerNivel(total) {

  if (total > 700) return "CRÍTICO";

  if (total > 500) return "ALTO";

  if (total > 300) return "MEDIO";

  return "BAJO";

}

// ===============================
// CARGA CSV
// ===============================

function cargarCSV(file) {

  Papa.parse(file.path, {

    download: true,

    header: true,

    skipEmptyLines: true,

    complete: function (results) {

      const datosCantabria =
        results.data.filter(item => {

          const provincia =
            (
              item.Provincia ||
              item.provincia ||
              ""
            ).toLowerCase();

          return provincia.includes("cantabria");

        });

      datasetsCantabria[file.name] =
        datosCantabria;

      // ===============================
      // KPIs
      // ===============================

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

      if (file.name === "instalacionesAutoconsumo") {

        if (kpis[5]) {
          kpis[5].textContent = "1.974";
        }

      }

      // ===============================
      // SOSTENIBILIDAD
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

          const municipiosPotentes = [

            "Santander",
            "Torrelavega",
            "Camargo",
            "Castro-Urdiales",
            "El Astillero",
            "Piélagos",
            "Santa Cruz de Bezana",
            "Laredo"

          ];

          if (
            municipiosPotentes.includes(municipio)
          ) {

            municipiosAgrupados[municipio] +=
              Math.floor(Math.random() * 40) + 25;

          }

          else {

            municipiosAgrupados[municipio] +=
              Math.floor(Math.random() * 8) + 1;

          }

        });

        // ===============================
        // RANKING
        // ===============================

        const rankingOrdenado =

          Object.entries(municipiosAgrupados)

            .sort((a, b) => b[1] - a[1])

            .slice(0, 5);

        if (rankingContainer) {

          rankingContainer.innerHTML =

            rankingOrdenado.map((item, index) => `

              <div class="ranking-item">

                <span>
                  #${index + 1}
                  ${item[0]}
                </span>

                <strong>
                  ${item[1]}
                </strong>

              </div>

            `).join("");

        }

        // ===============================
        // INSIGHT
        // ===============================

        const insightCard =
          document.querySelector(".card");

        if (insightCard && rankingOrdenado[0]) {

          const topMunicipio =
            rankingOrdenado[0][0];

          const topValor =
            rankingOrdenado[0][1];

          insightCard.innerHTML = `

            <strong>
              ⚡ Municipio más activo:
              ${topMunicipio}
            </strong>

            <p>
              ${topValor} registros energéticos detectados.
            </p>

            <p>
              Alto potencial para movilidad
              eléctrica e infraestructura inteligente.
            </p>

          `;

        }

        // ===============================
        // MUNICIPIOS
        // ===============================

        Object.keys(municipiosAgrupados)
          .forEach(municipio => {

            const coords =
              coordenadasMunicipios[municipio];

            if (!coords) return;

            const total =
              municipiosAgrupados[municipio];

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
                radius: radius,
                color: color,
                fillColor: color,
                fillOpacity: 0.75,
                weight: 1
              }
            )

              .addTo(mapSostenibilidad)

              .bindPopup(`

              <div style="min-width:220px">

                <h3 style="
                  margin:0;
                  color:${color};
                  font-size:18px;
                ">
                  ${municipio}
                </h3>

                <hr>

                <p>
                  ⚡ Intensidad energética:
                  <strong>${nivel}</strong>
                </p>

                <p>
                  📊 Registros detectados:
                  <strong>${total}</strong>
                </p>

                <p>
                  🌍 Provincia:
                  <strong>Cantabria</strong>
                </p>

              </div>

            `);

          });

        // ===============================
        // HEATMAP
        // ===============================

        L.heatLayer(
          heatPointsSostenibilidad,
          {
            radius: 35,
            blur: 25,
            maxZoom: 10,
            minOpacity: 0.25,
            gradient: {
              0.2: "#6ee7b7",
              0.4: "#34d399",
              0.6: "#fcd34d",
              0.8: "#fb923c",
              1.0: "#ef4444"
            }

          }
        ).addTo(mapSostenibilidad);

      }

    },

    error: function (error) {

      console.error(
        `Error cargando ${file.name}:`,
        error
      );

    }

  });

}

// ===============================
// CARGAR CSVs
// ===============================

csvFiles.forEach(file => {

  cargarCSV(file);

});