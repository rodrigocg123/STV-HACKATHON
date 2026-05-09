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

  });
// ===============================
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
// ZONA BAJAS EMISIONES
// ===============================

const coordenadasZBE = [

  // ===============================
  // OESTE · LEALTAD / CENTRO
  // ===============================
  [43.46260855489555, -3.808406082676972],

  // ===============================
  // NOROESTE · GUEVARA
  // ===============================

  [43.46147939445098, -3.808363183430997],
  [43.461790889093834, -3.804384278365549],

  // ===============================
  // NORTE · SANTA LUCÍA
  // ===============================

  [43.46251666548063, -3.79717947072458],
  [43.46324866278646, -3.79668612954373],
  [43.465257716227775, -3.797029323511534],

  // ===============================
  // NORTE-ESTE · MENÉNDEZ PELAYO
  // ===============================

  [43.464712630808975, -3.799109936941459],
  [43.46426098488145, -3.7991313865644565],

  // ===============================
  // ESTE · PUERTO CHICO
  // ===============================

  [43.46393392882751, -3.803378411916257],
  [43.46363801944452, -3.803893202867983],

  // ===============================
  // SUR-ESTE · PASEO DE PEREDA
  // ===============================

  [43.46377818722755, -3.80421494721281],
  [43.463591296777956, -3.806123963658832],
  [43.463186365488475, -3.806209762150783],

  // ===============================
  // SUR · PEREDA / CORREOS
  // ===============================

  [43.46289045244632, -3.8053303276082344],
  [43.46259453795573, -3.808333274826634],

  // ===============================
  // CIERRE
  // ===============================

  [43.461488739408686, -3.8083332748266834]

];
const zonaZBE = L.polygon(
  coordenadasZBE,
  {
    color: "#ef4444",
    fillColor: "#ef4444",
    fillOpacity: 0.22,
    weight: 4
  }
);

zonaZBE.bindPopup(`

  <div style="min-width:240px">

    <h3 style="
      color:#ef4444;
      margin-bottom:8px;
    ">
      🚘 Zona de Bajas Emisiones
    </h3>

    <p>
      Área urbana con restricciones
      de tráfico contaminante.
    </p>

    <p>
      🌱 Objetivo:
      mejorar calidad del aire.
    </p>

  </div>

`);

capaZBE.addLayer(zonaZBE);
// ===============================
// CÁMARAS ZBE
// ===============================

const camarasZBE = [

  // ===============================
  // PASEO DE PEREDA · SUR
  // ===============================

  {
    nombre: "ZBE01",
    coords: [43.46209615238184, -3.8011875802423205]
  },

  {
    nombre: "ZBE02",
    coords: [43.46223632373976, -3.7994930600261965]
  },

  // ===============================
  // PUERTO CHICO · ESTE
  // ===============================

  {
    nombre: "ZBE03",
    coords: [43.46234534568236, -3.798227532269847]
  },

  {
    nombre: "ZBE04",
    coords: [43.46278143148672, -3.796983454136496]
  },

  {
    nombre: "ZBE05",
    coords: [43.463217514145484, -3.7967475082836204]
  },

  {
    nombre: "ZBE06",
    coords: [43.46360687100417, -3.7967689579065977]
  },

  // ===============================
  // SANTA LUCÍA · NORTE
  // ===============================

  {
    nombre: "ZBE07",
    coords: [43.46402737359942, -3.7968547563985697]
  },

  {
    nombre: "ZBE08",
    coords: [43.46463476106221, -3.796983454136496]
  },

  {
    nombre: "ZBE09",
    coords: [43.4643544291433, -3.7991713156813693]
  },

  {
    nombre: "ZBE10",
    coords: [43.46432328107207, -3.7998148043710227]
  },

  // ===============================
  // GUEVARA · NOROESTE
  // ===============================

  {
    nombre: "ZBE11",
    coords: [43.46427655893511, -3.800737138159547]
  },

  {
    nombre: "ZBE12",
    coords: [43.46426098488145, -3.80168092157105]
  },

  {
    nombre: "ZBE13",
    coords: [43.46379376140558, -3.8023673095066988]
  },

  // ===============================
  // LEALTAD · OESTE
  // ===============================

  {
    nombre: "ZBE14",
    coords: [43.46366916786884, -3.804040380099825]
  },

  {
    nombre: "ZBE16",
    coords: [43.46374703885938, -3.8054775048404957]
  },

  {
    nombre: "ZBE17",
    coords: [43.46281258035237, -3.8054131559711233]
  },
  {
    nombre: "ZBE18",
    coords: [43.46376105553198, -3.8037606817931695]
  }

];
camarasZBE.forEach((camara) => {

  const iconoCamara = L.divIcon({

    className: "camera-marker",

    html: "📷",

    iconSize: [26, 26]

  });

  const marker = L.marker(
    camara.coords,
    {
      icon: iconoCamara
    }
  );

  marker.bindPopup(`

    <div style="min-width:220px">

      <h3 style="
        color:#ef4444;
        margin-bottom:8px;
      ">
        📷 ${camara.nombre}
      </h3>

      <p>
        Cámara de control ZBE
      </p>

      <p>
        🚘 Control de acceso
        de vehículos.
      </p>

    </div>

  `);

  capaCamarasZBE.addLayer(marker);

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

    // ===============================
    // ZBE
    // ===============================

    const btnCoche =
      document.getElementById(
        "btnCoche"
      );

    if (btnCoche) {

      btnCoche.addEventListener(
        "click",
        () => {

          const zbeActiva =
            mapMovilidad.hasLayer(
              capaZBE
            );

          if (zbeActiva) {

            // ===============================
            // OCULTAR ZBE
            // ===============================

            mapMovilidad.removeLayer(
              capaZBE
            );

            mapMovilidad.removeLayer(
              capaCamarasZBE
            );

          } else {

            // ===============================
            // MOSTRAR ZBE
            // ===============================

            mapMovilidad.addLayer(
              capaZBE
            );

            mapMovilidad.addLayer(
              capaCamarasZBE
            );

          }

        }
      );

    }

  }
);