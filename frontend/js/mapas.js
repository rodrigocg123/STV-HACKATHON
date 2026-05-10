// ===============================
// MAPAS STV — inicialización
// ===============================

export const mapMovilidad = L.map("mapMovilidad").setView(
  [43.4623, -3.8099],
  13
  
);
mapMovilidad.on("click", (e) => {
  console.log(e.latlng);
});
mapMovilidad.attributionControl.remove();
export const mapSostenibilidad = L.map("mapSostenibilidad").setView(
  [43.4623, -3.8099],
  10
);
mapSostenibilidad.attributionControl.remove();
export const mapComercio = L.map("mapComercio").setView(
  [43.4623, -3.8099],
  10
);
mapComercio.attributionControl.remove();
// ===============================
// CAPA BASE
// ===============================

function crearTileLayer() {
  return L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: "&copy; OpenStreetMap contributors" }
  );
}

crearTileLayer().addTo(mapMovilidad);
crearTileLayer().addTo(mapSostenibilidad);
crearTileLayer().addTo(mapComercio);
