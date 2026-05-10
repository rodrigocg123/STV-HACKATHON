import { mapMovilidad } from "./mapas.js";

// ===============================
// CAPAS
// ===============================

const capaBus = L.layerGroup();
const capaBici = L.layerGroup();
const capaCarrilBici = L.layerGroup();
const capaRecarga = L.layerGroup();
const capaPMR = L.layerGroup();
const capaZBE = L.layerGroup();
const capaCamarasZBE = L.layerGroup();
const capaHeatMovilidad = L.layerGroup();
const capaPOI = L.layerGroup();

// ===============================
// ICONOS
// ===============================

const iconoBici = L.divIcon({
  className: "bike-marker",
  html: "🚲",
  iconSize: [28, 28]
});

const iconoCamara = L.divIcon({
  className: "camera-marker",
  html: "📷",
  iconSize: [26, 26]
});

// ===============================
// POPUP PREMIUM
// ===============================

function crearPopup({ color, titulo, contenido }) {
  return `
    <div class="premium-popup">
      <div class="popup-header">
        <h3 style="color:${color}">${titulo}</h3>
      </div>
      <div class="popup-body">${contenido}</div>
    </div>
  `;
}

// ===============================
// TOGGLE CAPA ÚNICA
// ===============================

function toggleLayer(btnId, layer) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (mapMovilidad.hasLayer(layer)) {
      mapMovilidad.removeLayer(layer);
      btn.classList.remove("active");
    } else {
      mapMovilidad.addLayer(layer);
      btn.classList.add("active");
    }
  });
}

// ===============================
// TOGGLE MÚLTIPLES CAPAS
// ===============================

function toggleMultipleLayers(btnId, layers) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener("click", () => {
    const activa = mapMovilidad.hasLayer(layers[0]);
    layers.forEach((layer) => {
      activa
        ? mapMovilidad.removeLayer(layer)
        : mapMovilidad.addLayer(layer);
    });
    btn.classList.toggle("active", !activa);
  });
}

// ===============================
// HEATMAP MOVILIDAD
// ===============================

const heatData = [
  [43.4623, -3.8099, 0.9],
  [43.4635, -3.8084, 0.8],
  [43.4652, -3.8041, 0.7],
  [43.4589, -3.8172, 0.85],
  [43.4597, -3.8125, 0.75],
  [43.4668, -3.8015, 0.95],
  [43.4558, -3.8241, 0.6]
];

const heatLayer = L.heatLayer(heatData, {
  radius: 34,
  blur: 28,
  maxZoom: 17,
  gradient: {
    0.2: "#00bfff",
    0.4: "#00ffae",
    0.6: "#ffee00",
    0.8: "#ff7b00",
    1: "#ff2d55"
  }
});

capaHeatMovilidad.addLayer(heatLayer);
mapMovilidad.addLayer(capaHeatMovilidad);

// ===============================
// FETCH BUS
// ===============================

fetch("http://localhost:3000/api/bus")
  .then(r => r.json())
  .then(data => {
    data.resources.forEach((parada) => {
      const lat = parseFloat(parada["wgs84_pos:lat"]);
      const lng = parseFloat(parada["wgs84_pos:long"]);
      if (!lat || !lng) return;
      L.circleMarker([lat, lng], {
        radius: 7, color: "#2563eb", fillColor: "#2563eb",
        fillOpacity: 0.9, weight: 2
      })
        .bindPopup(crearPopup({
          color: "#2563eb",
          titulo: "🚌 Parada BUS",
          contenido: `<p>${parada["vivo:address1"] || "Sin dirección"}</p>`
        }))
        .addTo(capaBus);
    });
  })
  .catch(err => console.error("BUS ERROR:", err));

// ===============================
// FETCH BICI
// ===============================

fetch("http://localhost:3000/api/bici")
  .then(r => r.json())
  .then(data => {
    data.data.stations.forEach((station) => {
      if (!station.lat || !station.lon) return;
      L.marker([station.lat, station.lon], { icon: iconoBici })
        .bindPopup(crearPopup({
          color: "#16a34a",
          titulo: `🚲 ${station.name}`,
          contenido: `<p>🅿 Capacidad: <strong>${station.capacity || "N/A"}</strong></p>`
        }))
        .addTo(capaBici);
    });
  })
  .catch(err => console.error("BICI ERROR:", err));

// ===============================
// CARRIL BICI
// ===============================

fetch("./data/carril_bici.json")
  .then(r => r.json())
  .then(data => {
    (data.resources || []).forEach((carril) => {
      const wkt = carril["ayto:WKT"];
      if (!wkt) return;

      const textoCoords = wkt
        .replace("LINESTRING (", "")
        .replace("LINESTRING(", "")
        .replace(")", "");

      const puntos = textoCoords.split(",").map((punto) => {
        const coords = punto.trim().split(" ");
        const convertido = proj4("EPSG:25830", "EPSG:4326", [
          parseFloat(coords[0]),
          parseFloat(coords[1])
        ]);
        return [convertido[1], convertido[0]];
      });

      L.polyline(puntos, {
        color: "#39ff14", weight: 6, opacity: 0.95,
        lineCap: "round", lineJoin: "round"
      })
        .bindPopup(crearPopup({
          color: "#39ff14",
          titulo: "🚲 Carril bici",
          contenido: "<p>Infraestructura ciclista urbana.</p>"
        }))
        .addTo(capaCarrilBici);
    });
  })
  .catch(err => console.error("CARRIL BICI ERROR:", err));

// ===============================
// PUNTOS DE RECARGA (CSV)
// ===============================

Papa.parse("./data/4-puntos_publicos_de_recarga_de_vehiculos_electricos-viesgo.csv", {
  download: true, header: true, skipEmptyLines: true,
  complete(results) {
    results.data
      .filter(p => p["Provincia"] === "Cantabria")
      .forEach((punto) => {
        const lat = parseFloat(punto["Latitud"]);
        const lon = parseFloat(punto["Longitud"]);
        if (!lat || !lon) return;
        L.circleMarker([lat, lon], {
          radius: 6, color: "#f59e0b", fillColor: "#facc15",
          fillOpacity: 0.9, weight: 2
        })
          .bindPopup(crearPopup({
            color: "#f59e0b",
            titulo: "⚡ Punto de recarga",
            contenido: `
            <p>🏙 ${punto["Municipio"] || "Cantabria"}</p>
            <p>🔋 ${punto["Potencia Máxima Admisible (kW)"] || "N/A"} kW</p>
          `
          }))
          .addTo(capaRecarga);
      });
  }
});

// ===============================
// PMR
// ===============================

fetch("./data/pmr.json")
  .then(r => r.json())
  .then(data => {
    (data.resources || data).forEach((plaza) => {
      const lat = parseFloat(plaza.latitud || plaza["geo:lat"] || plaza.latitude);
      const lon = parseFloat(plaza.longitud || plaza["geo:long"] || plaza.longitude);
      if (!lat || !lon) return;
      L.circleMarker([lat, lon], {
        radius: 6, color: "#7c3aed", fillColor: "#a855f7",
        fillOpacity: 0.9, weight: 2
      })
        .bindPopup(crearPopup({
          color: "#7c3aed",
          titulo: "♿ Plaza PMR",
          contenido: "<p>Plaza accesible detectada.</p>"
        }))
        .addTo(capaPMR);
    });
  })
  .catch(err => console.error("PMR ERROR:", err));

// ===============================
// ZBE — ZONA BAJAS EMISIONES
// ===============================

const coordenadasZBE = [
  [43.46260855489555, -3.808406082676972],
  [43.46147939445098, -3.808363183430997],
  [43.461790889093834, -3.804384278365549],
  [43.46251666548063, -3.79717947072458],
  [43.46324866278646, -3.79668612954373],
  [43.465257716227775, -3.797029323511534],
  [43.464712630808975, -3.799109936941459],
  [43.46426098488145, -3.7991313865644565],
  [43.46393392882751, -3.803378411916257],
  [43.46363801944452, -3.803893202867983],
  [43.46377818722755, -3.80421494721281],
  [43.463591296777956, -3.806123963658832],
  [43.463186365488475, -3.806209762150783],
  [43.46289045244632, -3.8053303276082344],
  [43.46259453795573, -3.808333274826634],
  [43.461488739408686, -3.8083332748266834]
];

L.polygon(coordenadasZBE, {
  color: "#ef4444", fillColor: "#ef4444",
  fillOpacity: 0.22, weight: 4
})
  .bindPopup(crearPopup({
    color: "#ef4444",
    titulo: "🚘 Zona Bajas Emisiones",
    contenido: "<p>Área urbana restringida.</p><p>🌱 Mejora de calidad del aire.</p>"
  }))
  .addTo(capaZBE);

// ===============================
// CÁMARAS ZBE
// ===============================

const camarasZBE = [
  { nombre: "ZBE01", coords: [43.46209615238184, -3.8011875802423205] },
  { nombre: "ZBE02", coords: [43.46223632373976, -3.7994930600261965] },
  { nombre: "ZBE03", coords: [43.46234534568236, -3.798227532269847] },
  { nombre: "ZBE04", coords: [43.46278143148672, -3.796983454136496] },
  { nombre: "ZBE05", coords: [43.463217514145484, -3.7967475082836204] },
  { nombre: "ZBE06", coords: [43.46360687100417, -3.7967689579065977] },
  { nombre: "ZBE07", coords: [43.46402737359942, -3.7968547563985697] },
  { nombre: "ZBE08", coords: [43.46463476106221, -3.796983454136496] },
  { nombre: "ZBE09", coords: [43.4643544291433, -3.7991713156813693] },
  { nombre: "ZBE10", coords: [43.46432328107207, -3.7998148043710227] },
  { nombre: "ZBE11", coords: [43.46427655893511, -3.800737138159547] },
  { nombre: "ZBE12", coords: [43.46426098488145, -3.80168092157105] },
  { nombre: "ZBE13", coords: [43.46379376140558, -3.8023673095066988] },
  { nombre: "ZBE14", coords: [43.46366916786884, -3.804040380099825] },
  { nombre: "ZBE16", coords: [43.46374703885938, -3.8054775048404957] },
  { nombre: "ZBE17", coords: [43.46281258035237, -3.8054131559711233] }
];

camarasZBE.forEach((camara) => {
  L.marker(camara.coords, { icon: iconoCamara })
    .bindPopup(crearPopup({
      color: "#ef4444",
      titulo: `📷 ${camara.nombre}`,
      contenido: "<p>Cámara de control ZBE.</p><p>🚘 Supervisión de accesos.</p>"
    }))
    .addTo(capaCamarasZBE);
});

// ===============================
// BOTONES — registrar UNA sola vez
// ===============================

window.addEventListener("DOMContentLoaded", () => {
  toggleLayer("btnBus", capaBus);
  toggleLayer("btnRecarga", capaRecarga);
  toggleLayer("btnPMR", capaPMR);
  toggleMultipleLayers("btnBici", [capaBici, capaCarrilBici]);
  toggleMultipleLayers("btnCoche", [capaZBE, capaCamarasZBE]);
});
// ===============================
// PUNTOS DE INTERES
// ===============================
const puntosInteres = [
  {
    nombre: "Ayuntamiento",
    coords: [43.46230464020074, -3.809933251345217],
  },
  {
    nombre: "Catedral",
    coords: [43.460673930663006, -3.8073161220027756],
  },
  {
    nombre: "Centro Botín",
    coords: [43.460375514987604, -3.8041150260390952],
  },
  {
    nombre: "Jardines de Pereda",
    coords: [43.461208476740836, -3.8050582060837606],
  },
  {
    nombre: "Parque de las Llamas",
    coords: [43.47396400306918, -3.801076115841891],
  },
  {
    nombre: "Campos de Sport del Sardinero",
    coords: [43.47628397552997, -3.793371464424469],
  },
  {
    nombre: "La Magdalena",
    coords: [43.46940645398475, -3.769502662499196],
  },
  {
    nombre: "El Sardinero",
    coords: [43.473190903651954, -3.783393133883271],
  },
];

puntosInteres.forEach((poi) => {
  L.marker(poi.coords)
    .bindPopup(
      crearPopup({
        color: "#00bfff",
        titulo: `📍 ${poi.nombre}`,
        contenido: "<p>Punto de interés urbano.</p>",
      })
    )
    .addTo(capaPOI);
});
// ===============================
// CAPAS ACTIVAS AL INICIO
// ===============================
mapMovilidad.addLayer(capaPOI);


const kpis = [

  {
    label: "🚨 Zona con más tráfico",
    values: ["Centro", "Sardinero", "Castilla/Hermida"]
  },

  {
    label: "🚲 Ahorro usando bicicleta",
    values: ["+22%", "+27%", "+31%", "+35%"]
  },

  {
    label: "🚌 Ahorro usando TUS",
    values: ["+12%", "+17%", "+21%", "+25%"]
  }

];

let currentKpi = 0;

function actualizarKpiDinamico() {

  const kpi = kpis[currentKpi];

  const valor =
    kpi.values[
    Math.floor(Math.random() * kpi.values.length)
    ];

  const card = document.getElementById("dynamicKpi");

  card.classList.remove("active");

  setTimeout(() => {

    document.getElementById("kpiLabel")
      .textContent = kpi.label;

    document.getElementById("kpiValue")
      .textContent = valor;

    card.classList.add("active");

  }, 250);

  currentKpi =
    (currentKpi + 1) % kpis.length;

}

actualizarKpiDinamico();

setInterval(actualizarKpiDinamico, 3500);