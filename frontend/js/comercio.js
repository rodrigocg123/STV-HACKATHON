import { mapComercio } from "./mapas.js";
import { obtenerColorActividad, obtenerRadioActividad } from "./utils.js";

// ===============================
// CAPAS
// ===============================

const capaComercio = L.layerGroup();
const capaHeatComercio = L.layerGroup();
const alterneLayer = L.layerGroup();
const comercioLayer = L.layerGroup();
const relaxLayer = L.layerGroup();

// ===============================
// KPIs (índices 6, 7, 8 del DOM)
// ===============================

const kpis = document.querySelectorAll(".kpi strong");

// ===============================
// RANKING CONTAINER
// ===============================

const rankingContainer = document.getElementById("rankingContainer");

// ===============================
// DATOS
// ===============================

const comercioData = [
  { municipio: "Santander", coords: [43.4623, -3.8099], actividad: 96, crecimiento: 18, locales: 1240 },
  { municipio: "Torrelavega", coords: [43.3494, -4.0470], actividad: 74, crecimiento: 11, locales: 820 },
  { municipio: "Camargo", coords: [43.4070, -3.8840], actividad: 68, crecimiento: 9, locales: 640 },
  { municipio: "Castro-Urdiales", coords: [43.3828, -3.2204], actividad: 59, crecimiento: 7, locales: 510 },
  { municipio: "Laredo", coords: [43.4115, -3.4161], actividad: 52, crecimiento: 5, locales: 430 }
];

// ===============================
// POPUP PREMIUM
// ===============================

function crearPopup({ municipio, actividad, crecimiento, locales }) {
  return `
    <div class="premium-popup">
      <div class="popup-header">
        <h3>🏪 ${municipio}</h3>
      </div>
      <div class="popup-body">
        <p>Actividad comercial detectada.</p>
        <div class="popup-metrics">
          <div><span>Actividad</span><strong>${actividad}%</strong></div>
          <div><span>Crecimiento</span><strong>+${crecimiento}%</strong></div>
          <div><span>Locales</span><strong>${locales}</strong></div>
        </div>
      </div>
    </div>
  `;
}

// ===============================
// GENERAR MARCADORES
// ===============================

comercioData.forEach((zona) => {
  const color = obtenerColorActividad(zona.actividad);
  const radius = obtenerRadioActividad(zona.actividad);

  L.circleMarker(zona.coords, {
    radius, color, fillColor: color, fillOpacity: 0.72, weight: 1.5
  })
    .bindPopup(crearPopup(zona))
    .addTo(capaComercio);
});

// ===============================
// ALTERNE
// ===============================

const zonasAlterne = [
  {
    nombre: "Mercado Esperanza",
    lat: 43.46278517139077,
    lng: -3.8099860507953687
  },
  {
    nombre: "Mercado del Este",
    lat: 43.46232520259103,
    lng: -3.8044132208086117
  },
  {
    nombre: "La Cañía",
    lat: 43.47097336060281,
    lng: -3.7827295699441152
  },
  {
    nombre: "Cañadío",
    lat: 43.46343418203234,
    lng: -3.8017514176919507
  }
];

zonasAlterne.forEach(punto => {

  L.circleMarker([punto.lat, punto.lng], {
    radius: 12,
    fillColor: "#ff4d6d",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.9
  })

    .bindPopup(`
      <strong>🍸 ${punto.nombre}</strong><br>
      Zona perfecta para tomar algo
    `)

    .addTo(alterneLayer);

});

// ===============================
// COMPRAS
// ===============================

const zonasComerciales = [
  {
    nombre: "El Corte Inglés",
    lat: 43.43740920404116,
    lng: -3.8395388741972556
  },
  {
    nombre: "Valle Real",
    lat: 43.426840676362886,
    lng: -3.840359884262228
  },
  {
    nombre: "Juan de Herrera",
    lat: 43.46217434391993,
    lng: -3.808974587382844
  },
  {
    nombre: "Jesús de Monasterio",
    lat: 43.4632,
    lng: -3.8048
  }
];

zonasComerciales.forEach(zona => {

  L.circleMarker([zona.lat, zona.lng], {
    radius: 12,
    fillColor: "#00cfff",
    color: "#ffffff",
    weight: 2,
    fillOpacity: 0.9
  })

    .bindPopup(`
      <strong>🛍️ ${zona.nombre}</strong><br>
      Zona comercial destacada
    `)

    .addTo(comercioLayer);

});

// ===============================
// RELAX
// ===============================

const zonasRelax = [
  {
    nombre: "Castelar",
    lat: 43.46308402537032,
    lng: -3.793678432962418
  },
  {
    nombre: "Paseo Pereda",
    lat: 43.46228222745491,
    lng: -3.799911996340795
  },
  {
    nombre: "Jardines de Pereda",
    lat: 43.46097753085245,
    lng: -3.804509999385604
  },
  {
    nombre: "El Sardinero",
    lat: 43.472102154790306,
    lng: -3.782018345630512
  },
  {
    nombre: "Piquío",
    lat: 43.47389917430477,
    lng: -3.78409985763639
  }
];

zonasRelax.forEach(zona => {

  L.circleMarker([zona.lat, zona.lng], {
    radius: 12,
    fillColor: "#7CFFB2",
    color: "#ffffff",
    weight: 2,
    fillOpacity: 0.9
  })

    .bindPopup(`
      <strong>☕ ${zona.nombre}</strong><br>
      Zona tranquila para pasear y relajarse
    `)

    .addTo(relaxLayer);

});

// ===============================
// CONTROL CAPAS
// ===============================

function ocultarLayers() {

  mapComercio.removeLayer(alterneLayer);
  mapComercio.removeLayer(comercioLayer);
  mapComercio.removeLayer(relaxLayer);

}

// ===============================
// BOTONES
// ===============================

document
  .getElementById("btnAlterne")
  .addEventListener("click", () => {

    ocultarLayers();

    alterneLayer.addTo(mapComercio);

  });

document
  .getElementById("btnComercio")
  .addEventListener("click", () => {

    ocultarLayers();

    comercioLayer.addTo(mapComercio);

  });

document
  .getElementById("btnRelax")
  .addEventListener("click", () => {

    ocultarLayers();

    relaxLayer.addTo(mapComercio);

  });

// ===============================
// HEATMAP
// ===============================

const heatData = comercioData.map(zona => [
  zona.coords[0], zona.coords[1], zona.actividad / 100
]);

L.heatLayer(heatData, {
  radius: 40, blur: 28, maxZoom: 15,
  gradient: {
    0.2: "#00ffae",
    0.4: "#ffee00",
    0.6: "#ffae00",
    0.8: "#ff5e00",
    1: "#ff2d55"
  }
})
  .addTo(capaHeatComercio);

// ===============================
// RANKING
// ===============================

function generarRanking() {
  if (!rankingContainer) return;
  const ordenados = [...comercioData].sort((a, b) => b.actividad - a.actividad);
  rankingContainer.innerHTML = ordenados
    .map((m, i) => `
      <div class="ranking-item">
        <span>#${i + 1} ${m.municipio}</span>
        <strong>${m.actividad}%</strong>
      </div>
    `)
    .join("");
}

// ===============================
// KPIs
// ===============================

function actualizarKPIs() {
  if (kpis[6]) kpis[6].textContent = "+18%";
  if (kpis[7]) kpis[7].textContent = "42";
  if (kpis[8]) kpis[8].textContent = "12";
}

// ===============================
// ACTIVAR CAPAS
// ===============================

mapComercio.addLayer(capaComercio);
mapComercio.addLayer(capaHeatComercio);

// ===============================
// INICIAR
// ===============================

generarRanking();
actualizarKPIs();

setTimeout(() => {
  mapComercio.flyTo([43.4623, -3.8099], 11, { duration: 2 });
}, 1400);
