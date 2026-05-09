// ===============================
// TILE LAYER BASE
// ===============================

function crearTileLayer() {

  return L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        "&copy; OpenStreetMap contributors"
    }
  );

}

// ===============================
// CONFIG MAPA BASE
// ===============================

const configMapa = {
  center: [43.4623, -3.8099],
  zoom: 13
};

// ===============================
// MAPA MOVILIDAD
// ===============================

export const mapMovilidad = L.map(
  "mapMovilidad",
  {
    zoomControl: true
  }
).setView(
  configMapa.center,
  configMapa.zoom
);

// TILE
crearTileLayer().addTo(mapMovilidad);

// ===============================
// MOUSE POSITION
// ===============================

L.control.mousePosition({

  position: "bottomleft",

  separator: " | ",

  numDigits: 6,

  prefix: "Coords:"

}).addTo(mapMovilidad);

// ===============================
// CLICK COORDS
// ===============================

mapMovilidad.on(
  "click",
  function (e) {

    console.log(
      `LAT: ${e.latlng.lat}, LNG: ${e.latlng.lng}`
    );

  }
);

// ===============================
// MAPA SOSTENIBILIDAD
// ===============================

export const mapSostenibilidad = L.map(
  "mapSostenibilidad",
  {
    zoomControl: true
  }
).setView(
  configMapa.center,
  configMapa.zoom
);

// TILE
crearTileLayer().addTo(mapSostenibilidad);

// ===============================
// MAPA COMERCIO
// ===============================

export const mapComercio = L.map(
  "mapComercio",
  {
    zoomControl: true
  }
).setView(
  configMapa.center,
  configMapa.zoom
);

// TILE
crearTileLayer().addTo(mapComercio);