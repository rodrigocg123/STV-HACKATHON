// ===============================
// COLOR DINÁMICO — energía
// ===============================

export function obtenerColor(total) {
  if (total >= 2200) return "#ff2d55";
  if (total >= 1800) return "#ff7b00";
  if (total >= 1200) return "#ffb703";
  if (total >= 700)  return "#00ffae";
  return "#00bfff";
}

// ===============================
// RADIO DINÁMICO — energía
// ===============================

export function obtenerRadio(total) {
  if (total >= 2200) return 28;
  if (total >= 1800) return 24;
  if (total >= 1200) return 20;
  if (total >= 700)  return 16;
  if (total >= 300)  return 12;
  return 8;
}

// ===============================
// NIVEL ENERGÉTICO
// ===============================

export function obtenerNivel(total) {
  if (total >= 2200) return "CRÍTICO";
  if (total >= 1800) return "ALTO";
  if (total >= 1200) return "MEDIO-ALTO";
  if (total >= 700)  return "MEDIO";
  return "BAJO";
}

// ===============================
// COLOR — actividad comercial
// ===============================

export function obtenerColorActividad(actividad) {
  if (actividad >= 85) return "#00bfff";
  if (actividad >= 70) return "#00ffae";
  if (actividad >= 55) return "#ffb703";
  return "#ff5e5e";
}

// ===============================
// RADIO — actividad comercial
// ===============================

export function obtenerRadioActividad(actividad) {
  return actividad / 3;
}

// ===============================
// FORMATO NÚMEROS
// ===============================

export function formatearNumero(numero) {
  return new Intl.NumberFormat("es-ES").format(numero);
}

// ===============================
// PORCENTAJE RANDOM
// ===============================

export function generarPorcentaje(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===============================
// CLASIFICACIÓN ACTIVIDAD
// ===============================

export function clasificarActividad(valor) {
  if (valor >= 85) return "MUY ALTA";
  if (valor >= 70) return "ALTA";
  if (valor >= 55) return "MEDIA";
  return "BAJA";
}

// ===============================
// GRADIENTE HEATMAP
// ===============================

export const heatmapGradient = {
  0.2: "#00bfff",
  0.4: "#00ffae",
  0.6: "#ffee00",
  0.8: "#ff7b00",
  1:   "#ff2d55"
};
