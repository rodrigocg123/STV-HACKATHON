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