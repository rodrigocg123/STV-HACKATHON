import { mapMovilidad } from "./mapas.js";

// ===============================
// CAPAS
// ===============================

const capaBus = L.layerGroup();

// ===============================
// BOTÓN BUS
// ===============================

window.addEventListener("DOMContentLoaded", () => {

  const btnBus = document.getElementById("btnBus");

  if (!btnBus) return;

  btnBus.addEventListener("click", () => {

    if (mapMovilidad.hasLayer(capaBus)) {

      mapMovilidad.removeLayer(capaBus);

    } else {

      mapMovilidad.addLayer(capaBus);

    }

  });

});

// ===============================
// FETCH BUS
// ===============================

fetch("http://localhost:3000/api/bus")

  .then(response => response.json())

  .then(data => {

    data.resources.forEach((parada) => {

      const lat = parseFloat(
        parada["wgs84_pos:lat"]
      );

      const lng = parseFloat(
        parada["wgs84_pos:long"]
      );

      if (!lat || !lng) return;

      const marker = L.circleMarker(
        [lat, lng],
        {
          radius: 7,
          color: "#2563eb",
          fillColor: "#2563eb",
          fillOpacity: 0.85,
          weight: 2
        }
      );

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