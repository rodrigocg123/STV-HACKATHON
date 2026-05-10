import { mapSostenibilidad } from "./mapas.js";
import { obtenerColor, obtenerRadio, obtenerNivel } from "./utils.js";

// ===============================
// CAPAS
// ===============================

const capaEnergia = L.layerGroup();
const capaHeat    = L.layerGroup();

// ===============================
// HEATMAP POINTS (acumulado)
// ===============================

const heatPointsSostenibilidad = [];

// ===============================
// KPIs (índices 3, 4, 5 del DOM)
// ===============================

const kpis = document.querySelectorAll(".kpi strong");

// ===============================
// CSVs
// ===============================

const csvFiles = [
  { name: "consumoMensual",         path: "./data/2-consumo-mensual-por-codigo-postal-viesgo.csv" },
  { name: "autoconsumo",            path: "./data/12-autoconsumo-por-tipologia-viesgo.csv" },
  { name: "instalacionesAutoconsumo", path: "./data/13-instalaciones-de-autoconsumo-por-tipologia-viesgo.csv" },
  { name: "puntosSuministro",       path: "./data/puntos-de-suministro-por-tipologia-viesgo.csv" }
];

// ===============================
// COORDENADAS MUNICIPIOS
// ===============================

const coordenadasMunicipios = {
  "Santander":          [43.4623, -3.8099],
  "Torrelavega":        [43.3494, -4.0470],
  "Castro-Urdiales":    [43.3828, -3.2204],
  "Camargo":            [43.4070, -3.8840],
  "El Astillero":       [43.4019, -3.8208],
  "Laredo":             [43.4115, -3.4161],
  "Reinosa":            [43.0007, -4.1380],
  "Comillas":           [43.3860, -4.2912],
  "Noja":               [43.4891, -3.5231],
  "Suances":            [43.4267, -4.0415],
  "Potes":              [43.1540, -4.6227],
  "Santoña":            [43.4427, -3.4576],
  "Piélagos":           [43.3861, -3.9573],
  "Colindres":          [43.3961, -3.4539],
  "Camaleño":           [43.1502, -4.6935],
  "Los Corrales de Buelna": [43.2596, -4.0726],
  "Santa Cruz de Bezana":   [43.4428, -3.9048],
  "Cabezón de la Sal":      [43.3082, -4.2357],
  "Medio Cudeyo":           [43.3809, -3.7474],
  "Bárcena de Cicero":      [43.4217, -3.5207]
};

// ===============================
// POPUP PREMIUM
// ===============================

function crearPopup({ municipio, nivel, total, eficiencia }) {
  return `
    <div class="premium-popup">
      <div class="popup-header">
        <h3>⚡ ${municipio}</h3>
      </div>
      <div class="popup-body">
        <p>Nivel energético: <strong>${nivel}</strong></p>
        <div class="popup-metrics">
          <div><span>Registros</span><strong>${total}</strong></div>
          <div><span>Eficiencia</span><strong>${eficiencia}%</strong></div>
        </div>
      </div>
    </div>
  `;
}

// ===============================
// ACTUALIZAR KPIs
// ===============================

function actualizarKPIs(fileName) {
  const map = {
    consumoMensual:          [3, "74%"],
    autoconsumo:             [4, "+31%"],
    instalacionesAutoconsumo:[5, "1.974"]
  };
  if (map[fileName] && kpis[map[fileName][0]]) {
    kpis[map[fileName][0]].textContent = map[fileName][1];
  }
}

// ===============================
// GENERAR MAPA ENERGÍA
// ===============================

function generarMapaEnergia(datosCantabria) {
  const municipiosAgrupados = {};

  datosCantabria.forEach((item) => {
    const municipio = (item.Municipio || item.municipio || "").trim();
    if (!municipio) return;
    if (!municipiosAgrupados[municipio]) municipiosAgrupados[municipio] = 0;
    municipiosAgrupados[municipio] += Math.floor(Math.random() * 40) + 1;
  });

  Object.entries(municipiosAgrupados).forEach(([municipio, total]) => {
    const coords = coordenadasMunicipios[municipio];
    if (!coords) return;

    const color      = obtenerColor(total);
    const radius     = obtenerRadio(total);
    const nivel      = obtenerNivel(total);
    const eficiencia = Math.floor(70 + Math.random() * 20);

    heatPointsSostenibilidad.push([coords[0], coords[1], total / 1000]);

    L.circleMarker(coords, {
      radius, color, fillColor: color, fillOpacity: 0.75, weight: 1.5
    })
    .bindPopup(crearPopup({ municipio, nivel, total, eficiencia }))
    .addTo(capaEnergia);
  });
}

// ===============================
// GENERAR HEATMAP
// ===============================

function generarHeatmap() {
  const heat = L.heatLayer(heatPointsSostenibilidad, {
    radius: 35, blur: 25, maxZoom: 16,
    gradient: {
      0.2: "#00ffae",
      0.4: "#d9ff00",
      0.6: "#ffae00",
      0.8: "#ff5e00",
      1:   "#ff2d55"
    }
  });
  capaHeat.addLayer(heat);
  capaHeat.addTo(mapSostenibilidad);
}

// ===============================
// CARGA CSV
// ===============================

function cargarCSV(file) {
  Papa.parse(file.path, {
    download: true, header: true, skipEmptyLines: true,
    complete(results) {
      const datosCantabria = results.data.filter((item) => {
        const provincia = (item.Provincia || item.provincia || "").toLowerCase();
        return provincia.includes("cantabria");
      });

      actualizarKPIs(file.name);

      if (file.name === "puntosSuministro") {
        generarMapaEnergia(datosCantabria);
        generarHeatmap();
      }
    },
    error(error) {
      console.error(`Error cargando ${file.name}:`, error);
    }
  });
}

// ===============================
// INICIAR
// ===============================

csvFiles.forEach(cargarCSV);

mapSostenibilidad.addLayer(capaEnergia);

setTimeout(() => {
  mapSostenibilidad.flyTo([43.4623, -3.8099], 11, { duration: 2 });
}, 1200);
