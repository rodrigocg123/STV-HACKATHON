// ===============================
// CONFIG MAPA BASE
// ===============================

const configMapa = {

  center:
  [43.4623, -3.8099],

  zoom:
  13

};

// ===============================
// TILE LAYER PREMIUM
// ===============================

function crearTileLayer() {

  return L.tileLayer(

    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",

    {

      attribution:
      "&copy; OpenStreetMap & CARTO",

      subdomains:
      "abcd",

      maxZoom:
      20

    }

  );

}

// ===============================
// MAPA MOVILIDAD
// ===============================

export const mapMovilidad = L.map(

  "mapMovilidad",

  {

    zoomControl:
    false,

    attributionControl:
    false,

    preferCanvas:
    true

  }

).setView(

  configMapa.center,

  configMapa.zoom

);

crearTileLayer().addTo(
  mapMovilidad
);

L.control.zoom({

  position:
  "bottomright"

}).addTo(
  mapMovilidad
);

// ===============================
// MAPA SOSTENIBILIDAD
// ===============================

export const mapSostenibilidad = L.map(

  "mapSostenibilidad",

  {

    zoomControl:
    false,

    attributionControl:
    false,

    preferCanvas:
    true

  }

).setView(

  configMapa.center,

  configMapa.zoom

);

crearTileLayer().addTo(
  mapSostenibilidad
);

L.control.zoom({

  position:
  "bottomright"

}).addTo(
  mapSostenibilidad
);

// ===============================
// MAPA COMERCIO
// ===============================

export const mapComercio = L.map(

  "mapComercio",

  {

    zoomControl:
    false,

    attributionControl:
    false,

    preferCanvas:
    true

  }

).setView(

  configMapa.center,

  configMapa.zoom

);

crearTileLayer().addTo(
  mapComercio
);

L.control.zoom({

  position:
  "bottomright"

}).addTo(
  mapComercio
);

// ===============================
// AUTO RESIZE
// ===============================

window.addEventListener(

  "resize",

  () => {

    mapMovilidad.invalidateSize();

    mapSostenibilidad.invalidateSize();

    mapComercio.invalidateSize();

  }

);