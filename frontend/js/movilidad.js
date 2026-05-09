import { mapMovilidad } from "./mapas.js";

// ===============================
// CAPAS
// ===============================

const capaBus = L.layerGroup();

const capaBici = L.layerGroup();

const capaCarrilBici = L.layerGroup();

const capaRecarga = L.layerGroup();

const capaPMR = L.layerGroup();
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

// ===============================
// FETCH BICI
// ===============================

fetch("http://localhost:3000/api/bici")

  .then(response => response.json())

  .then(data => {

    const stations =
      data.data.stations;

    stations.forEach((station) => {

      const lat = station.lat;

      const lon = station.lon;

      if (!lat || !lon) return;

      const iconoBici = L.divIcon({

        className: "bike-marker",

        html: "🚲",

        iconSize: [28, 28]

      });

      const marker = L.marker(
        [lat, lon],
        {
          icon: iconoBici
        }
      );

      marker.bindPopup(`

        <div style="min-width:220px">

          <h3 style="
            margin-bottom:8px;
            color:#16a34a;
          ">
            🚲 ${station.name}
          </h3>

          <p>
            🅿 Capacidad:
            <strong>
              ${station.capacity || "N/A"}
            </strong>
          </p>

        </div>

      `);

      capaBici.addLayer(marker);

    });

  })

  .catch(error => {

    console.error(
      "Error cargando BICI:",
      error
    );

  });
// ===============================
// FETCH CARRIL BICI
// ===============================

fetch("./data/carril_bici.json")

  .then(response => response.json())

  .then(data => {

    const carriles =
      data.resources || [];

    carriles.forEach((carril) => {

      const wkt =
        carril["ayto:WKT"];

      if (!wkt) return;

      // ===============================
      // EXTRAER COORDENADAS
      // ===============================

      const textoCoords =
        wkt
          .replace("LINESTRING (", "")
          .replace("LINESTRING(", "")
          .replace(")", "");

      const puntos =
        textoCoords
          .split(",")

          .map(punto => {

            const coords =
              punto.trim().split(" ");

            const x =
              parseFloat(coords[0]);

            const y =
              parseFloat(coords[1]);

            // ===============================
            // UTM30N -> WGS84
            // ===============================

            const convertido = proj4(
              "EPSG:25830",
              "EPSG:4326",
              [x, y]
            );

            const lng = convertido[0];

            const lat = convertido[1];

            return [lat, lng];

          });

      // ===============================
      // DIBUJAR LÍNEA
      // ===============================

      const linea = L.polyline(
        puntos,
        {
          color: "#39ff14",
          weight: 6,
          opacity: 0.95,
          lineCap: "round",
          lineJoin: "round"
        }
      );

      linea.on("add", () => {

        const element =
          linea.getElement();

        if (element) {

          element.style.filter =
            "drop-shadow(0 0 6px #39ff14)";

        }

      });

      linea.bindPopup(`
        <strong>
          🚲 Carril bici Santander
        </strong>
      `);

      capaCarrilBici.addLayer(linea);

    });

  })

  .catch(error => {

    console.error(
      "Error CARRIL BICI:",
      error
    );

  });// ===============================
// RECARGA CSV
// ===============================

Papa.parse(
  "./data/4-puntos_publicos_de_recarga_de_vehiculos_electricos-viesgo.csv",
  {

    download: true,

    header: true,

    skipEmptyLines: true,

    complete: function (results) {

      console.log(
        "CSV RECARGA:",
        results.data
      );
      console.log(results.data[0]);

      const datosCantabria = results.data.filter(
        punto =>
          punto["Provincia"] === "Cantabria"
      );

      datosCantabria.forEach((punto) => {

        const lat = parseFloat(
          punto["Latitud"]
        );

        const lon = parseFloat(
          punto["Longitud"]
        );

        if (!lat || !lon) return;

        const municipio =
          punto["Municipio"] ||
          "Cantabria";

        const potencia =
          punto["Potencia Máxima Admisible (kW)"] ||
          "N/A";

        const marker = L.circleMarker(
          [lat, lon],
          {
            radius: 6,
            color: "#f59e0b",
            fillColor: "#facc15",
            fillOpacity: 0.9,
            weight: 2
          }
        );

        marker.bindPopup(`

          <div style="min-width:220px">

            <h3 style="
              color:#f59e0b;
              margin-bottom:8px;
            ">
              ⚡ Punto de recarga
            </h3>

            <p>
              🏙 Municipio:
              <strong>${municipio}</strong>
            </p>

            <p>
              🔋 Potencia máxima:
              <strong>${potencia} kW</strong>
            </p>

          </div>

        `);

        capaRecarga.addLayer(marker);

      });

    },

    error: function (error) {

      console.error(
        "Error RECARGA CSV:",
        error
      );

    }

  }
);
// ===============================
// FETCH PMR LOCAL
// ===============================

fetch("./data/pmr.json")

  .then(response => response.json())

  .then(data => {

    const plazas =
      data.resources || data;

    plazas.forEach((plaza) => {

      const lat = parseFloat(
        plaza.latitud ||
        plaza["geo:lat"] ||
        plaza.latitude
      );

      const lon = parseFloat(
        plaza.longitud ||
        plaza["geo:long"] ||
        plaza.longitude
      );

      if (!lat || !lon) return;

      const marker = L.circleMarker(
        [lat, lon],
        {
          radius: 6,
          color: "#7c3aed",
          fillColor: "#a855f7",
          fillOpacity: 0.9,
          weight: 2
        }
      );

      marker.bindPopup(`

        <div style="min-width:220px">

          <h3 style="
            color:#7c3aed;
            margin-bottom:8px;
          ">
            ♿ Plaza PMR
          </h3>

          <p>
            📍 Plaza accesible
          </p>

        </div>

      `);

      capaPMR.addLayer(marker);

    });

  })

  .catch(error => {

    console.error(
      "Error PMR:",
      error
    );

  });
// ===============================
// BOTONES
// ===============================

window.addEventListener(
  "DOMContentLoaded",
  () => {

    // ===============================
    // BUS
    // ===============================

    const btnBus =
      document.getElementById(
        "btnBus"
      );

    if (btnBus) {

      btnBus.addEventListener(
        "click",
        () => {

          if (
            mapMovilidad.hasLayer(
              capaBus
            )
          ) {

            mapMovilidad.removeLayer(
              capaBus
            );

          } else {

            mapMovilidad.addLayer(
              capaBus
            );

          }

        }
      );

    }

    // ===============================
    // BICI
    // ===============================

    const btnBici =
      document.getElementById(
        "btnBici"
      );

    if (btnBici) {

      btnBici.addEventListener(
        "click",
        () => {

          if (
            mapMovilidad.hasLayer(
              capaBici
            )
          ) {

            mapMovilidad.removeLayer(
              capaBici
            );

            mapMovilidad.removeLayer(
              capaCarrilBici
            );

          } else {

            mapMovilidad.addLayer(
              capaBici
            );

            mapMovilidad.addLayer(
              capaCarrilBici
            );

          }

        }
      );

    }

    // ===============================
    // RECARGA
    // ===============================

    const btnRecarga =
      document.getElementById(
        "btnRecarga"
      );

    if (btnRecarga) {

      btnRecarga.addEventListener(
        "click",
        () => {

          if (
            mapMovilidad.hasLayer(
              capaRecarga
            )
          ) {

            mapMovilidad.removeLayer(
              capaRecarga
            );

          } else {

            mapMovilidad.addLayer(
              capaRecarga
            );

          }

        }
      );

    }
    // ===============================
    // PMR
    // ===============================

    const btnPMR =
      document.getElementById(
        "btnPMR"
      );

    if (btnPMR) {

      btnPMR.addEventListener(
        "click",
        () => {

          if (
            mapMovilidad.hasLayer(
              capaPMR
            )
          ) {

            mapMovilidad.removeLayer(
              capaPMR
            );

          } else {

            mapMovilidad.addLayer(
              capaPMR
            );

          }

        }
      );

    }

  }
);