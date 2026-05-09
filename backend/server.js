import express from "express";

import cors from "cors";

const app = express();

const PORT = 3000;

/* ===============================
CORS
=============================== */

app.use(cors());

/* ===============================
API BUS
=============================== */

app.get("/api/bus", async (req, res) => {

  try {

    const response = await fetch(
      "http://datos.santander.es/api/rest/datasets/paradas_bus.json"
    );

    const data = await response.json();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error cargando datos BUS"
    });

  }

});
// ===============================
// API BICI
// ===============================

app.get("/api/bici", async (req, res) => {

  try {

    const response = await fetch(
      "https://gbfs.nextbike.net/maps/gbfs/v2/nextbike_ek/es/station_information.json"
    );

    const data = await response.json();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error cargando datos BICI"
    });

  }

});
// ===============================
// API RECARGA
// ===============================

app.get("/api/recarga", async (req, res) => {

  try {

    const response = await fetch(
      "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/4-puntos_publicos_de_recarga_de_vehiculos_electricos-viesgo/records?limit=100"
    );

    const data = await response.json();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error cargando RECARGA"
    });

  }

});
// ===============================
// API PMR
// ===============================

app.get("/api/pmr", async (req, res) => {

  try {

    const response = await fetch(
      "http://datos.santander.es/resource/?ds=plazas-pmr&id=12eac87c-bf46-48aa-bcc4-20fcf60ffdd2&ft=JSON"
    );

    const text = await response.text();

    const data = JSON.parse(text);

    res.json(data);

  } catch (error) {

    console.error(
      "ERROR PMR:",
      error
    );

    res.status(500).json({
      error: "Error cargando PMR"
    });

  }

});
/* ===============================
SERVIDOR
=============================== */

app.listen(PORT, () => {

  console.log(`
  ==============================
  Backend iniciado
  http://localhost:${PORT}
  ==============================
  `);

});