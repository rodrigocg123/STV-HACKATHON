// ===============================
// SCORE MOVILIDAD
// ===============================

export function calcularScoreMovilidad(zona) {

  let score = 0;

  score += zona.bus * 0.35;
  score += zona.bici * 0.30;
  score += zona.recarga * 0.20;
  score += (100 - zona.trafico) * 0.15;

  return Math.round(score);

}

// ===============================
// CLASIFICACIÓN
// ===============================

export function clasificarZona(score) {

  if (score >= 80) {

    return "ÓPTIMA";

  }

  if (score >= 60) {

    return "ESTABLE";

  }

  return "SATURADA";

}

// ===============================
// COLOR SCORE
// ===============================

export function obtenerColorScore(score) {

  if (score >= 80) {

    return "#22c55e";

  }

  if (score >= 60) {

    return "#eab308";

  }

  return "#ef4444";

}

// ===============================
// RECOMENDACIÓN MOVILIDAD
// ===============================

export function generarRecomendacionMovilidad(zona) {

  const score =
    calcularScoreMovilidad(zona);

  if (zona.trafico >= 80) {

    return {

      tipo: "Zona congestionada",

      color: "#ef4444",

      ahorro: "-18% tráfico potencial",

      motivo:
        "Alta densidad de tráfico detectada. Recomendable potenciar movilidad pública."

    };

  }

  if (zona.bici >= 80) {

    return {

      tipo: "Movilidad sostenible alta",

      color: "#22c55e",

      ahorro: "+31% movilidad verde",

      motivo:
        "Alta conectividad ciclista detectada."

    };

  }

  if (zona.recarga <= 45) {

    return {

      tipo: "Déficit de recarga",

      color: "#f97316",

      ahorro: "+22% potencial eléctrico",

      motivo:
        "Infraestructura eléctrica insuficiente."

    };

  }

  return {

    tipo: clasificarZona(score),

    color: obtenerColorScore(score),

    ahorro: "+12% eficiencia urbana",

    motivo:
      "Zona con movilidad equilibrada."

  };

}