// ===============================
// MAPA MOVILIDAD
// ===============================

export const mapMovilidad = L.map(
  "mapMovilidad"
).setView(
  [43.4623, -3.8099],
  10
);

// ===============================
// MAPA SOSTENIBILIDAD
// ===============================

export const mapSostenibilidad = L.map(
  "mapSostenibilidad"
).setView(
  [43.4623, -3.8099],
  10
);

// ===============================
// MAPA COMERCIO
// ===============================

export const mapComercio = L.map(
  "mapComercio"
).setView(
  [43.4623, -3.8099],
  10
);

// ===============================
// TILE LAYER
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

crearTileLayer().addTo(mapMovilidad);

crearTileLayer().addTo(mapSostenibilidad);

crearTileLayer().addTo(mapComercio);