// ===============================
// COLOR DINÁMICO
// ===============================

export function obtenerColor(total) {

  if (total > 2200) return "#dc2626";

  if (total > 1800) return "#f97316";

  if (total > 1200) return "#eab308";

  return "#22c55e";

}

// ===============================
// RADIO
// ===============================

export function obtenerRadio(total) {

  if (total > 400) return 20;

  if (total > 250) return 16;

  if (total > 150) return 13;

  if (total > 80) return 10;

  return 6;

}

// ===============================
// NIVEL
// ===============================

export function obtenerNivel(total) {

  if (total > 700) return "CRÍTICO";

  if (total > 500) return "ALTO";

  if (total > 300) return "MEDIO";

  return "BAJO";

}